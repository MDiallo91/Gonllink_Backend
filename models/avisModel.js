const mongoose = require("mongoose");

const avisSchema = new mongoose.Schema({
    auteur: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    destinataire: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    projet: { type: mongoose.Types.ObjectId, required: true, ref: "projet" },
    noteGlobale: { type: Number, required: true, min: 1, max: 5 },
    criteres: {
        qualite: { type: Number, min: 1, max: 5 },
        delai: { type: Number, min: 1, max: 5 },
        communication: { type: Number, min: 1, max: 5 },
        rapport_qualite_prix: { type: Number, min: 1, max: 5 }
    },
    commentaire: { type: String, maxlength: 1000 },
    reponse: { type: String, maxlength: 500 },
    isVisible: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("avis", avisSchema);
