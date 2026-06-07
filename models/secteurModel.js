const mongoose = require("mongoose");

const secteurSchema = new mongoose.Schema({
    nom: { type: String, required: true, trim: true },
    picture: { type: String, default: "/upload/profil/random_user.png" },
    icone: { type: String, default: "" },
    couleur: { type: String, default: "#6366f1" },
    description: { type: String },
    isActive:        { type: Boolean, default: true },
    afficherAccueil: { type: Boolean, default: false }, // affichage sur la page d'accueil
    ordre:           { type: Number,  default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("secteur", secteurSchema);
