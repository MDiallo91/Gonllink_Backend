const userModel = require("../models/userModel");
const objectId = require("mongoose").Types.ObjectId;

module.exports.getUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.email = { $regex: search, $options: "i" };
    try {
        const total = await userModel.countDocuments(filter);
        const users = await userModel.find(filter)
            .select("-password")
            .populate("profile")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json({ users, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports.userInfo = async (req, res) => {
    const userId = req.params.id;
    if (!objectId.isValid(userId)) return res.status(400).json({ message: "Id invalide" });
    try {
        const user = await userModel.findById(userId)
            .select("-password")
            .populate({ path: "profile", populate: { path: "secteur", model: "secteur" } });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    if (!objectId.isValid(userId)) return res.status(400).json({ message: "Id invalide" });
    try {
        const user = await userModel.findByIdAndUpdate(
            userId,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select("-password");
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.status(200).json({ message: "Profil mis à jour avec succès", user });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    if (!objectId.isValid(userId)) return res.status(400).json({ message: "Id invalide" });
    try {
        const user = await userModel.findByIdAndDelete({ _id: userId });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.status(200).json({ message: "Compte supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports.logout = async (req, res) => {
    res.cookie("jwt", "", { maxAge: 1, httpOnly: true });
    res.status(200).json({ message: "Déconnexion réussie" });
};
