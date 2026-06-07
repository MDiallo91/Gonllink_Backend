const mongoose = require("mongoose");

const enchereSchema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    projet: { type: mongoose.Types.ObjectId, required: true, ref: "projet" },
    userChoisi: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    montant: { type: Number, default: 0 },
    delaiEstime: { type: Number, default: 0 }, // en jours
    description: { type: String },
    documents: [{ type: String }],
    statut: {
        type: String,
        enum: ["en_attente", "accepte", "refuse", "retire"],
        default: "en_attente"
    },
}, { timestamps: true });

module.exports = mongoose.model("enchere", enchereSchema);
