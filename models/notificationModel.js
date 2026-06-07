const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    destinataire: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    type: {
        type: String,
        required: true,
        enum: [
            "nouvelle_offre",
            "offre_acceptee",
            "offre_refusee",
            "nouveau_message",
            "projet_cloture",
            "demande_notation",
            "avis_recu",
            "compte_verifie",
            "compte_premium",
            "projet_publie",
            "signalement"
        ]
    },
    titre: { type: String, required: true },
    message: { type: String, required: true },
    lien: { type: String, default: "" },
    lu: { type: Boolean, default: false },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model("notification", notificationSchema);
