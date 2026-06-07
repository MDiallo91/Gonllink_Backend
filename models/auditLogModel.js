const mongoose = require("mongoose");

// Journal immuable des actions sensibles effectuées par les admins
const auditLogSchema = new mongoose.Schema({

  // Qui a effectué l'action
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  // Type d'action (ex: "SUPPRIMER_USER", "MODIFIER_CONFIG", "SUSPENDRE_USER")
  action: {
    type: String,
    required: true,
    enum: [
      "CREER_SECTEUR",    "MODIFIER_SECTEUR",   "SUPPRIMER_SECTEUR",
      "VERIFIER_USER",    "PREMIUM_USER",        "SUSPENDRE_USER",    "SUPPRIMER_USER",
      "MASQUER_AVIS",     "TRAITER_SIGNALEMENT",
      "SUPPRIMER_PROJET",
      "MODIFIER_CONFIG",
    ],
  },

  // Description lisible de l'action pour l'UI
  description: { type: String },

  // Objet ciblé (optionnel)
  cibleType: { type: String }, // ex: "user", "projet", "secteur"
  cibleId:   { type: String }, // _id de l'objet ciblé

  // Données supplémentaires (avant/après)
  details: { type: mongoose.Schema.Types.Mixed },

  // IP de l'auteur au moment de l'action
  ip: { type: String },

}, {
  timestamps: true,
  // Empêche les modifications : les logs ne doivent jamais être édités
  strict: true,
});

// Index pour accélérer le tri chronologique et le filtrage par action
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
