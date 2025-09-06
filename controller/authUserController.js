const mongoose = require("mongoose");
const UserModel = require("../models/userModel");
const travailleurModel = require("../models/travailleurModel")
const entrepriseModel = require("../models/entrepriseModel")
const clientModal = require("../models/clientModal")
const adminModel = require("../models/adminModel")

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

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            email,
            password: hashedPassword,
            role
        });
        
        //creation de profil lier a user en fonction du role

         let profile;

        if (role === "client") {
        profile = await clientModal.create({ user: user._id});
        } else if (role === "independant") {
        profile = await travailleurModel.create({ user: user._id});
        } else if (role === "entreprise") {
        profile = await entrepriseModel.create({ user: user._id});
        } else if (role === "admin") {
        profile = await adminModel.create({ user: user._id});
        }


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
         await UserModel.findByIdAndDelete(user._id);
        res.status(400).json({ error: error.message });
    }
}

// Connexion
module.exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

        // Créer le token
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge
        });

        res.status(200).json({ user: user,status:200,message:"Connexion effectuer avec succes"});
    } catch (error) {
        console.error(`Erreur lors du login: ${error}`);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
