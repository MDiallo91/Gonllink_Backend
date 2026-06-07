const mongoose = require("mongoose");
const UserModel = require("../models/userModel");
const travailleurModel = require("../models/travailleurModel")
const entrepriseModel = require("../models/entrepriseModel")
const clientModal = require("../models/clientModal")
const adminModel = require("../models/adminModel")
 const sendVerificationEmail = require("../helper/verification/confirmCode");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Durée de vie du token (3 jours)
const maxAge = 3 * 24 * 60 * 60 * 1000;

// Création d’un token JWT
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: maxAge / 1000 + "s" });
}

// Inscription
module.exports.signUp = async (req, res) => {
    const {  email, password,role } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const existUser = await UserModel.findOne({ email });
        if (existUser) return res.status(400).json({ message: "Email déjà utilisé" });
        //Cree un profil avant de le mettre dans user en fn du rol
        let profile;
        let roleRef;

        if(role === "client") {
        profile = await clientModal.create({ });
        roleRef = "client";
        } else if(role === "independant") {
        profile = await travailleurModel.create({ });
        roleRef = "travailleur";
        } else if(role === "entreprise") {
        profile = await entrepriseModel.create({ });
        roleRef = "entreprise";
        } else if(role === "admin") {
        profile = await adminModel.create({ });
        roleRef = "admin";
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Les clients sont actifs immédiatement — les autres rôles attendent l'activation admin
        const isActive = role === "client";

        const user = await UserModel.create({
            email,
            password: hashedPassword,
            role,
            profile: profile._id,
            roleRef,
            isActive,
        });
        
       

        // Quand un utilisateur s’inscrit envoyer un code de confirmation
        await sendVerificationEmail(user);

        // Créer le token
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge
        });
   
        res.status(201).json({  
            message: "Utilisateur enregistré avec succès",
            user,
            profile
         });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Connexion

module.exports.signIn = async (req, res) => {
    const { email, password, code } = req.body;

    try {
        let user;

        if (code) {
            // Chercher l'utilisateur par code de confirmation
           const trimmedCode = code.toString().trim(); // enlever espaces
            user = await UserModel.findOne({ verificationCode: trimmedCode });
            if (!user) return res.status(400).json({ message: "Code de confirmation incorrect" });

            // Code correct → on vérifie l'utilisateur et on supprime le code
            user.isVerified = true;
            user.confirmationCode = null;
            await user.save();

            const token = createToken(user._id);
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'strict',
                maxAge
            });

            return res.status(200).json({
                user,
                status: 200,
                message: "Connecté avec succès via code de confirmation"
            });
        }

        // Connexion classique par email/password
        if (!email || !password) return res.status(400).json({ message: "Email et mot de passe requis" });

        user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

        if (!user.isVerified) {
            return res.status(401).json({ message: "Email non vérifié. Utilisez le code de confirmation." });
        }

        // Compte désactivé par l'admin
        if (!user.isActive) {
            return res.status(403).json({ message: "Votre compte est en attente d'activation. Contactez l'administrateur." });
        }

        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge
        });

        res.status(200).json({ user, status: 200, message: "Connexion effectuée avec succès" });

    } catch (error) {
        console.error(`Erreur lors du login: ${error}`);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


