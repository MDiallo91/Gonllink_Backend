const mongoose = require("mongoose");

const realisationSchema = new mongoose.Schema({
    realisateur: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    titre: { type: String, trim: true },
    description: { type: String },
    secteur: { type: mongoose.Types.ObjectId, ref: "secteur" },
    images: [{ type: String }],
    lienVideo: { type: String },
    dateRealisation: { type: Date },
    avantPhoto: { type: String },
    apresPhoto: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("realisation", realisationSchema);
