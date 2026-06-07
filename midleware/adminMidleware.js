module.exports.requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Accès refusé — réservé aux administrateurs" });
    }
    next();
};
