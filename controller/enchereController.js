const Enchere = require("../models/enchereModel");
const objectId = require("mongoose").Types.ObjectId;
const User = require("../models/userModel");
const Projet = require("../models/projetModel");
const sendEmail = require("../helper/verification/email");
const { creerNotification } = require("./notificationController");

module.exports.addEnchere = async (req, res) => {
    const { user, projet, description, montant, delaiEstime } = req.body;
    try {
        const dejaFaitUneOffre = await Enchere.findOne({ user, projet });
        if (dejaFaitUneOffre) return res.status(400).json({ message: "Vous avez déjà soumis une offre pour ce projet" });

        const enchere = await Enchere.create({ user, projet, description, montant, delaiEstime });

        // Notifier le propriétaire du projet
        const projetDoc = await Projet.findById(projet).populate("user");
        if (projetDoc?.user) {
            await creerNotification({
                destinataire: projetDoc.user._id,
                type: "nouvelle_offre",
                titre: "Nouvelle offre reçue",
                message: `Vous avez reçu une nouvelle offre de ${montant ? montant + ' GNF' : ''} sur votre projet "${projetDoc.titre}"`,
                lien: `/profil/projet`,
                data: { enchereId: enchere._id, projetId: projet }
            });
        }

        return res.status(201).json({ message: "Offre soumise avec succès", enchere });
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'enchère:", error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports.getEncheresByUser = async (req, res) => {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const encheres = await Enchere.find()
            .populate({ path: "user", populate: { path: "profile" } })
            .populate({ path: "projet", match: { user: userId }, populate: { path: "user" } })
            .sort({ createdAt: -1 });

        const result = encheres.filter(e => e.projet !== null);
        const total = result.length;
        const paginated = result.slice((page - 1) * limit, page * limit);
        res.status(200).json({ status: 200, result: paginated, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.getEnchere = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const total = await Enchere.countDocuments();
        const enchere = await Enchere.find()
            .populate({ path: "user", populate: { path: "profile" } })
            .populate("projet")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json({ status: 200, data: enchere, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports.getEncheresByProjet = async (req, res) => {
    const { projetId } = req.params;
    try {
        const encheres = await Enchere.find({ projet: projetId })
            .populate({ path: "user", select: "-password", populate: { path: "profile" } })
            .sort({ createdAt: -1 });
        res.status(200).json({ status: 200, data: encheres });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Accepter une offre et notifier le travailleur
module.exports.updateEnchere = async (req, res) => {
    const enchereId = req.params.id;
    if (!objectId.isValid(enchereId)) return res.status(400).json({ message: "Id invalide" });

    try {
        const enchere = await Enchere.findByIdAndUpdate(
            enchereId,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!enchere) return res.status(404).json({ message: "Enchère non trouvée" });

        if (req.body.statut === "accepte" || enchere.userChoisi) {
            const destId = enchere.userChoisi || enchere.user;
            const user = await User.findById(destId);

            if (user?.email) {
                const emailMsg = `Bonjour, vous avez été sélectionné pour exécuter un projet sur Gollink. Connectez-vous pour voir les détails.`;
                await sendEmail(user.email, "Félicitations - Offre acceptée", emailMsg);
            }

            await creerNotification({
                destinataire: destId,
                type: "offre_acceptee",
                titre: "Votre offre a été acceptée !",
                message: "Le client a accepté votre offre. Vous pouvez maintenant commencer la mission.",
                lien: `/profil/missions`,
                data: { enchereId: enchere._id }
            });

            // Mettre les autres offres du même projet en "refuse"
            if (enchere.projet) {
                await Enchere.updateMany(
                    { projet: enchere.projet, _id: { $ne: enchereId }, statut: "en_attente" },
                    { statut: "refuse" }
                );
            }
        }

        res.status(200).json({ message: "Offre mise à jour avec succès", enchere });
    } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports.getEncheresChoix = async (req, res) => {
    const userChoisi = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const encheres = await Enchere.find({ userChoisi })
            .sort({ createdAt: -1 })
            .populate({ path: "projet", populate: { path: "user", populate: { path: "profile" } } });

        const result = encheres.filter(e => e.projet !== null);
        const total = result.length;
        const paginated = result.slice((page - 1) * limit, page * limit);
        res.status(200).json({ status: 200, result: paginated, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Offres soumises par un travailleur
module.exports.getMesOffres = async (req, res) => {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const total = await Enchere.countDocuments({ user: userId });
        const encheres = await Enchere.find({ user: userId })
            .populate({ path: "projet", populate: [{ path: "secteur" }, { path: "user", select: "-password" }] })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json({ status: 200, data: encheres, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.deleteEnchere = async (req, res) => {
    const enchereId = req.params.id;
    if (!objectId.isValid(enchereId)) return res.status(400).json({ message: "Id invalide" });
    try {
        const enchere = await Enchere.findByIdAndDelete({ _id: enchereId });
        if (!enchere) return res.status(404).json({ message: "Enchère non trouvée" });
        res.status(200).json({ message: "Offre retirée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
