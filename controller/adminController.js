const UserModel = require("../models/userModel");
const projetModel = require("../models/projetModel");
const Enchere = require("../models/enchereModel");
const Avis = require("../models/avisModel");
const Signalement = require("../models/signalementModel");
const secteurModel = require("../models/secteurModel");
const AuditLog = require("../models/auditLogModel");
const { creerNotification } = require("./notificationController");
const mongoose = require("mongoose");

// ─── Helper : enregistre une action dans l'audit log ─────────────────────────
const log = async (req, action, description = "", extras = {}) => {
  try {
    await AuditLog.create({
      utilisateur: req.user._id,
      action,
      description,
      ip: req.ip || req.headers["x-forwarded-for"] || "inconnue",
      ...extras,
    });
  } catch { /* Ne jamais bloquer la route principale pour un log */ }
};

// ─── Statistiques publiques (page d'accueil — sans auth) ────────────────────
module.exports.getPublicStats = async (req, res) => {
  try {
    const secteurModel = require("../models/secteurModel");
    const Avis         = require("../models/avisModel");

    const [totalPros, totalProjets, totalMetiers, totalAvis] = await Promise.all([
      UserModel.countDocuments({ role: { $in: ["independant", "entreprise"] } }),
      projetModel.countDocuments({ etat: "termine" }),
      secteurModel.countDocuments({ isActive: true }),
      Avis.countDocuments({ isVisible: true }),
    ]);

    // Note moyenne calculée sur tous les avis visibles
    const moyenneResult = await Avis.aggregate([
      { $match: { isVisible: true } },
      { $group: { _id: null, moyenne: { $avg: "$note" } } },
    ]);
    const noteMoyenne = moyenneResult[0]?.moyenne
      ? parseFloat(moyenneResult[0].moyenne.toFixed(1))
      : null;

    res.status(200).json({ totalPros, totalProjets, totalMetiers, totalAvis, noteMoyenne });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Statistiques globales ───────────────────────────────────────────────────
module.exports.getStats = async (req, res) => {
    try {
        const [totalUsers, totalProjets, totalOffres, totalAvis] = await Promise.all([
            UserModel.countDocuments(),
            projetModel.countDocuments(),
            Enchere.countDocuments(),
            Avis.countDocuments({ isVisible: true }),
        ]);

        const usersByRole = await UserModel.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        const projetsByEtat = await projetModel.aggregate([
            { $group: { _id: "$etat", count: { $sum: 1 } } }
        ]);

        // Inscriptions des 7 derniers jours
        const sept = new Date();
        sept.setDate(sept.getDate() - 7);
        const inscriptionsRecentes = await UserModel.aggregate([
            { $match: { createdAt: { $gte: sept } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            totalUsers, totalProjets, totalOffres, totalAvis,
            usersByRole, projetsByEtat, inscriptionsRecentes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── Gestion des utilisateurs ────────────────────────────────────────────────
module.exports.getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { role, search, isSuspended } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.email = { $regex: search, $options: "i" };

    try {
        const total = await UserModel.countDocuments(filter);
        const users = await UserModel.find(filter)
            .select("-password")
            .populate("profile")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const filteredUsers = isSuspended !== undefined
            ? users.filter(u => u.profile?.isSuspended === (isSuspended === "true"))
            : users;

        res.status(200).json({ users: filteredUsers, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── Activer / désactiver un compte utilisateur ──────────────────────────────
module.exports.toggleActiverUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findById(id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        user.isActive = !user.isActive;
        await user.save();

        const action = user.isActive ? "activé" : "désactivé";
        await log(req, "SUSPENDRE_USER", `Compte ${action} : ${user.email}`, { cibleType: "user", cibleId: id });

        res.status(200).json({ message: `Compte ${action} avec succès`, isActive: user.isActive });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.verifierUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findById(id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const Model = mongoose.model(user.roleRef);
        await Model.findByIdAndUpdate(user.profile, { isVerified: true });

        await creerNotification({
            destinataire: user._id,
            type: "compte_verifie",
            titre: "Compte vérifié !",
            message: "Votre compte a été vérifié par l'équipe Gollink. Vous êtes maintenant badge ✓",
            lien: "/profil"
        });

        await log(req, "VERIFIER_USER", `Vérification du compte ${user.email}`, { cibleType: "user", cibleId: id });
        res.status(200).json({ message: "Compte vérifié avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.activerPremium = async (req, res) => {
    const { id } = req.params;
    const { activer } = req.body;
    try {
        const user = await UserModel.findById(id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const Model = mongoose.model(user.roleRef);
        await Model.findByIdAndUpdate(user.profile, { statut: activer ? "premium" : "freemium" });

        if (activer) {
            await creerNotification({
                destinataire: user._id,
                type: "compte_premium",
                titre: "Compte Premium activé !",
                message: "Votre compte est maintenant Premium. Profitez de tous les avantages exclusifs.",
                lien: "/profil"
            });
        }

        await log(req, "PREMIUM_USER", `${activer ? "Activation" : "Désactivation"} premium pour ${user.email}`, { cibleType: "user", cibleId: id });
        res.status(200).json({ message: `Compte ${activer ? "premium activé" : "repassé en freemium"}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.suspendreUser = async (req, res) => {
    const { id } = req.params;
    const { suspendre } = req.body;
    try {
        const user = await UserModel.findById(id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const Model = mongoose.model(user.roleRef);
        await Model.findByIdAndUpdate(user.profile, { isSuspended: suspendre });

        await log(req, "SUSPENDRE_USER", `${suspendre ? "Suspension" : "Réactivation"} du compte ${user.email}`, { cibleType: "user", cibleId: id });
        res.status(200).json({ message: `Compte ${suspendre ? "suspendu" : "réactivé"} avec succès` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.deleteUserAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        await log(req, "SUPPRIMER_USER", `Suppression du compte ${user.email}`, { cibleType: "user", cibleId: id });
        res.status(200).json({ message: "Utilisateur supprimé définitivement" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── Gestion des projets ─────────────────────────────────────────────────────
module.exports.getAllProjets = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { etat, secteur } = req.query;
    const filter = {};
    if (etat) filter.etat = etat;
    if (secteur) filter.secteur = secteur;

    try {
        const total = await projetModel.countDocuments(filter);
        const projets = await projetModel.find(filter)
            .populate("secteur")
            .populate({ path: "user", select: "-password", populate: { path: "profile", select: "prenom nom adresse photo" } })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json({ projets, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.deleteProjetAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        await projetModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Projet supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── Gestion des secteurs ────────────────────────────────────────────────────
module.exports.createSecteur = async (req, res) => {
    try {
        const secteur = await secteurModel.create(req.body);
        await log(req, "CREER_SECTEUR", `Création du secteur « ${secteur.nom} »`, { cibleType: "secteur", cibleId: secteur._id.toString() });
        res.status(201).json({ message: "Secteur créé", secteur });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.updateSecteur = async (req, res) => {
    const { id } = req.params;
    try {
        const secteur = await secteurModel.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        if (!secteur) return res.status(404).json({ message: "Secteur non trouvé" });
        await log(req, "MODIFIER_SECTEUR", `Modification du secteur « ${secteur.nom} »`, { cibleType: "secteur", cibleId: id });
        res.status(200).json({ message: "Secteur mis à jour", secteur });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.deleteSecteur = async (req, res) => {
    const { id } = req.params;
    try {
        await secteurModel.findByIdAndDelete(id);
        await log(req, "SUPPRIMER_SECTEUR", `Suppression du secteur id=${id}`, { cibleType: "secteur", cibleId: id });
        res.status(200).json({ message: "Secteur supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── Gestion des avis ────────────────────────────────────────────────────────
module.exports.getAllAvis = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    try {
        const total = await Avis.countDocuments();
        const avis = await Avis.find()
            .populate({ path: "auteur",      select: "email photo", populate: { path: "profile", select: "prenom nom" } })
            .populate({ path: "destinataire", select: "email photo", populate: { path: "profile", select: "prenom nom" } })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json({ avis, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.masquerAvis = async (req, res) => {
    const { id } = req.params;
    try {
        const avis = await Avis.findById(id);
        if (!avis) return res.status(404).json({ message: "Avis non trouvé" });
        // Bascule la visibilité au lieu de toujours masquer
        avis.isVisible = !avis.isVisible;
        await avis.save();
        await log(req, "MASQUER_AVIS", `Avis id=${id} → isVisible=${avis.isVisible}`, { cibleType: "avis", cibleId: id });
        res.status(200).json({ message: avis.isVisible ? "Avis rendu visible" : "Avis masqué", isVisible: avis.isVisible });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
