const mongoose = require("mongoose");

const signalementSchema = new mongoose.Schema({
    auteur: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    cible: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    type: {
        type: String,
        required: true,
        enum: ["spam", "arnaque", "contenu_inapproprie", "faux_profil", "autre"]
    },
    description: { type: String, maxlength: 1000 },
    statut: {
        type: String,
        enum: ["en_attente", "traite", "ignore"],
        default: "en_attente"
    },
    traitePar: { type: mongoose.Types.ObjectId, ref: "user" },
    noteAdmin: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("signalement", signalementSchema);
