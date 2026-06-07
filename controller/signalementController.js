const Signalement = require("../models/signalementModel");

module.exports.createSignalement = async (req, res) => {
    const { cible, type, description } = req.body;
    const auteur = req.user._id;
    try {
        const existe = await Signalement.findOne({ auteur, cible, statut: "en_attente" });
        if (existe) return res.status(400).json({ message: "Vous avez déjà signalé cet utilisateur" });
        const signalement = await Signalement.create({ auteur, cible, type, description });
        res.status(201).json({ message: "Signalement soumis", signalement });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getSignalements = async (req, res) => {
    const { statut, page = 1, limit = 20 } = req.query;
    const filter = statut ? { statut } : {};
    try {
        const total = await Signalement.countDocuments(filter);
        const signalements = await Signalement.find(filter)
            .populate({ path: "auteur", select: "email photo role", populate: { path: "profile", select: "prenom nom" } })
            .populate({ path: "cible",  select: "email photo role", populate: { path: "profile", select: "prenom nom" } })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        res.status(200).json({ signalements, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.traiterSignalement = async (req, res) => {
    const { id } = req.params;
    const { statut, noteAdmin } = req.body;
    try {
        const signalement = await Signalement.findByIdAndUpdate(
            id,
            { statut, noteAdmin, traitePar: req.user._id },
            { new: true }
        );
        if (!signalement) return res.status(404).json({ message: "Signalement non trouvé" });
        res.status(200).json({ message: "Signalement traité", signalement });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
