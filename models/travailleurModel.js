const mongoose = require("mongoose");

const travailleurSchema = new mongoose.Schema({
    prenom: { type: String, trim: true },
    nom: { type: String, trim: true },
    titre: { type: String, trim: true }, // ex: "Électricien certifié"
    telephone: { type: String },
    secteur: { type: mongoose.Types.ObjectId, ref: "secteur" },
    secteurs: [{ type: mongoose.Types.ObjectId, ref: "secteur" }], // multi-secteurs
    competences: [{ type: String }], // tags: ["Plomberie", "Soudure"]
    langues: [{ type: String }],
    zoneIntervention: { type: String, trim: true },
    disponibilite: {
        type: String,
        enum: ["disponible", "occupe", "conge"],
        default: "disponible"
    },
    statut: {
        type: String,
        enum: ["freemium", "premium"],
        default: "freemium"
    },
    bio: { type: String, maxlength: 1000 },
    profil: { type: String, default: "/upload/profil/random_user.png" },
    banniere: { type: String, default: "" },
    adresse: { type: String },
    siteWeb: { type: String },
    tauxHoraire: { type: Number },
    noteGlobale: { type: Number, default: 0 },
    nbMissions: { type: Number, default: 0 },
    nbAvis: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("travailleur", travailleurSchema);
