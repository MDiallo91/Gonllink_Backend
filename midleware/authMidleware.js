const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                req.user = null; 
                res.cookie("jwt", "", { maxAge: 1 });
                next();
            } else {
                try {
                    const user = await UserModel.findById(decodedToken.id).select("-password");
                    res.locals.user = user;
                    req.user = user; // clé pour que req.user soit défini
                    next();
                } catch (error) {
                    console.log("Erreur de récupération de l'utilisateur :", error.message);
                    res.locals.user = null;
                    req.user = null;
                    next();
                }
            }
        });
    } else {
        res.locals.user = null;
        req.user = null; // clé pour req.user
        next();
    }
};

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log("Token invalide", err);
                return res.status(401).json({ message: "Token invalide" });
            } else {
                const user = await UserModel.findById(decodedToken.id);
                if (!user) return res.status(401).json({ message: "Utilisateur non trouvé" });
                
                req.user = user; // définit req.user pour le controller
                next();
            }
        });
    } else {
        console.log("No token");
        return res.status(401).json({ message: "Token manquant" });
    }
};
