const projetModel = require("../models/projetModel");
const objectId = require("mongoose").Types.ObjectId;
const { creerNotification } = require("./notificationController");

module.exports.addProjet = async (req, res) => {
    const { secteur, titre, description, localite, dateDebut, user, budget, visibility } = req.body;
    try {
        const projet = await projetModel.create({
            titre, description, secteur, localite, dateDebut, user, budget, visibility
        });
        return res.status(201).json({ message: "Projet publié avec succès", projet });
    } catch (error) {
        console.error("Erreur lors de l'ajout du projet:", error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports.getprojets = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { secteur, localite, etat, dateDebut } = req.query;

    const filter = { visibility: "public" };
    if (secteur) filter.secteur = secteur;
    if (localite) filter.localite = { $regex: localite, $options: "i" };
    if (etat) filter.etat = etat;
    if (dateDebut) filter.dateDebut = dateDebut;

    try {
        const total = await projetModel.countDocuments(filter);
        const projets = await projetModel.find(filter)
            .populate("secteur")
            .populate("user", "-password")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json({ projets, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports.projetInfo = async (req, res) => {
    const projetId = req.params.id;
    if (!objectId.isValid(projetId)) return res.status(400).json({ message: "Id invalide" });
    try {
        const projet = await projetModel.findById(projetId)
            .populate("secteur")
            .populate("user", "-password");
        if (!projet) return res.status(404).json({ message: "Projet non trouvé" });
        res.status(200).json(projet);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports.projetBySecteur = async (req, res) => {
    const { secteurId } = req.params;
    if (!objectId.isValid(secteurId)) return res.status(400).json({ message: "Id de secteur invalide" });
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const filter = { secteur: secteurId, visibility: "public" };
        const total = await projetModel.countDocuments(filter);
        const projets = await projetModel.find(filter)
            .populate("user", "-password")
            .populate("secteur")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json({ projets, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports.projetsByUser = async (req, res) => {
    const { userId } = req.params;
    if (!objectId.isValid(userId)) return res.status(400).json({ message: "Id invalide" });
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { etat } = req.query;
    const filter = { user: userId };
    if (etat) filter.etat = etat;
    try {
        const total = await projetModel.countDocuments(filter);
        const projets = await projetModel.find(filter)
            .populate("secteur")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json({ projets, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports.updateProjet = async (req, res) => {
    const projetId = req.params.id;
    if (!objectId.isValid(projetId)) return res.status(400).json({ message: "Id invalide" });
    try {
        const projet = await projetModel.findByIdAndUpdate(
            projetId,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!projet) return res.status(404).json({ message: "Projet non trouvé" });
        res.status(200).json({ message: "Projet mis à jour avec succès", projet });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports.cloturerProjet = async (req, res) => {
    const projetId = req.params.id;
    if (!objectId.isValid(projetId)) return res.status(400).json({ message: "Id invalide" });
    try {
        const projet = await projetModel.findByIdAndUpdate(
            projetId,
            { etat: "termine" },
            { new: true }
        ).populate("user", "-password");
        if (!projet) return res.status(404).json({ message: "Projet non trouvé" });

        if (projet.userChoisi) {
            await creerNotification({
                destinataire: projet.userChoisi,
                type: "projet_cloture",
                titre: "Projet clôturé",
                message: `Le projet "${projet.titre}" a été clôturé. Laissez votre avis !`,
                lien: `/profil/missions`,
            });
        }
        res.status(200).json({ message: "Projet clôturé", projet });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports.deleteProjet = async (req, res) => {
    const projetId = req.params.id;
    if (!objectId.isValid(projetId)) return res.status(400).json({ message: "Id invalide" });
    try {
        const projet = await projetModel.findByIdAndDelete({ _id: projetId });
        if (!projet) return res.status(404).json({ message: "Projet non trouvé" });
        res.status(200).json({ message: "Projet supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
