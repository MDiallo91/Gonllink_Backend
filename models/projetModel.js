const mongoose = require("mongoose");

const projetSchema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    secteur: { type: mongoose.Types.ObjectId, ref: "secteur" },
    titre: { type: String, trim: true },
    description: { type: String },
    localite: { type: String },
    dateDebut: {
        type: String,
        enum: ["urgent", "semaine", "mois", "flexible"]
    },
    budget: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 }
    },
    photos: [{ type: String }],
    etat: {
        type: String,
        enum: ["attente", "anCours", "termine", "annule"],
        trim: true,
        default: "attente"
    },
    userChoisi: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    nombreOffresMax: { type: Number, default: 10 },
    visibility: {
        type: String,
        enum: ["public", "prive"],
        default: "public"
    },
}, { timestamps: true });

module.exports = mongoose.model("projet", projetSchema);
