const Notification = require("../models/notificationModel");
const mongoose = require("mongoose");

module.exports.creerNotification = async ({ destinataire, type, titre, message, lien = "", data = {} }) => {
    try {
        await Notification.create({ destinataire, type, titre, message, lien, data });
    } catch (error) {
        console.error("Erreur création notification:", error.message);
    }
};

module.exports.getMesNotifications = async (req, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    try {
        const total = await Notification.countDocuments({ destinataire: userId });
        const nonLues = await Notification.countDocuments({ destinataire: userId, lu: false });
        const notifications = await Notification.find({ destinataire: userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json({ notifications, total, nonLues, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.marquerLue = async (req, res) => {
    const { id } = req.params;
    try {
        await Notification.findByIdAndUpdate(id, { lu: true });
        res.status(200).json({ message: "Notification marquée comme lue" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.marquerToutesLues = async (req, res) => {
    const userId = req.user._id;
    try {
        await Notification.updateMany({ destinataire: userId, lu: false }, { lu: true });
        res.status(200).json({ message: "Toutes les notifications marquées comme lues" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.deleteNotification = async (req, res) => {
    const { id } = req.params;
    try {
        await Notification.findByIdAndDelete(id);
        res.status(200).json({ message: "Notification supprimée" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
