const mongoose = require("mongoose");

const temoignageSchema = new mongoose.Schema({
  nom:   { type: String, required: true, trim: true },
  role:  { type: String, default: "" },        // ex: "Propriétaire", "Artisan indépendant"
  texte: { type: String, required: true },
  note:  { type: Number, default: 5, min: 1, max: 5 },
  photo: { type: String, default: "" },        // URL ou chemin upload
  actif: { type: Boolean, default: true },     // false = masqué sur l'accueil
  ordre: { type: Number, default: 0 },         // tri d'affichage
}, { timestamps: true });

module.exports = mongoose.model("temoignage", temoignageSchema);
