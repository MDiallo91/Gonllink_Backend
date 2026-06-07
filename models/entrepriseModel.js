const mongoose = require("mongoose");
const { isEmail } = require("validator");

const entrepriseSchema = new mongoose.Schema({
    nom: { type: String, trim: true },
    telephone: { type: String },
    secteur: { type: mongoose.Types.ObjectId, ref: "secteur" },
    secteurs: [{ type: mongoose.Types.ObjectId, ref: "secteur" }],
    zoneIntervention: { type: String, trim: true },
    statut: {
        type: String,
        enum: ["freemium", "premium"],
        default: "freemium"
    },
    bio: { type: String, maxlength: 1000 },
    profil: { type: String, default: "/upload/profil/random_user.png" },
    banniere: { type: String, default: "" },
    logo: { type: String, default: "" },
    adresse: { type: String },
    siteWeb: { type: String },
    nombreEmployes: {
        type: String,
        enum: ["1-5", "6-20", "21-100", "+100"]
    },
    dateCreation: { type: Date },
    responsable: {
        prenom: { type: String },
        nom: { type: String },
        titre: { type: String }
    },
    noteGlobale: { type: Number, default: 0 },
    nbMissions: { type: Number, default: 0 },
    nbAvis: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("entreprise", entrepriseSchema);
