const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    prenom: { type: String, trim: true },
    nom: { type: String, trim: true },
    telephone: { type: String },
    adresse: { type: String },
    ville: { type: String },
    secteur: { type: mongoose.Types.ObjectId, ref: "secteur" },
    isVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("client", clientSchema);
