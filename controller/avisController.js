const Avis = require("../models/avisModel");
const UserModel = require("../models/userModel");
const mongoose = require("mongoose");

const recalculerNote = async (destinataireId) => {
    const avis = await Avis.find({ destinataire: destinataireId, isVisible: true });
    if (!avis.length) return;
    const moyenne = avis.reduce((sum, a) => sum + a.noteGlobale, 0) / avis.length;

    const user = await UserModel.findById(destinataireId);
    if (!user || !user.profile) return;

    const Model = require("mongoose").model(user.roleRef);
    await Model.findByIdAndUpdate(user.profile, {
        noteGlobale: Math.round(moyenne * 10) / 10,
        nbAvis: avis.length
    });
};

module.exports.createAvis = async (req, res) => {
    const { auteur, destinataire, projet, noteGlobale, criteres, commentaire } = req.body;
    try {
        const existe = await Avis.findOne({ auteur, projet });
        if (existe) return res.status(400).json({ message: "Vous avez déjà noté ce projet" });

        const avis = await Avis.create({ auteur, destinataire, projet, noteGlobale, criteres, commentaire });
        await recalculerNote(destinataire);
        res.status(201).json({ message: "Avis ajouté avec succès", avis });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getAvisByUser = async (req, res) => {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const total = await Avis.countDocuments({ destinataire: id, isVisible: true });
        const avis = await Avis.find({ destinataire: id, isVisible: true })
            .populate("auteur", "email photo role")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json({ avis, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.repondreAvis = async (req, res) => {
    const { id } = req.params;
    const { reponse } = req.body;
    try {
        const avis = await Avis.findByIdAndUpdate(id, { reponse }, { new: true });
        if (!avis) return res.status(404).json({ message: "Avis non trouvé" });
        res.status(200).json({ message: "Réponse ajoutée", avis });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.deleteAvis = async (req, res) => {
    const { id } = req.params;
    try {
        const avis = await Avis.findByIdAndUpdate(id, { isVisible: false }, { new: true });
        if (!avis) return res.status(404).json({ message: "Avis non trouvé" });
        await recalculerNote(avis.destinataire);
        res.status(200).json({ message: "Avis supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
