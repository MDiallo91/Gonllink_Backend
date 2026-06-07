const Temoignage = require("../models/temoignageModel");

// ─── Public : témoignages actifs (page d'accueil) ────────────────────────────
module.exports.getPublicTemoignages = async (req, res) => {
  try {
    const temoignages = await Temoignage
      .find({ actif: true })
      .sort({ ordre: 1, createdAt: -1 })
      .limit(10);
    res.status(200).json(temoignages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Admin : tous les témoignages ────────────────────────────────────────────
module.exports.getTemoignages = async (req, res) => {
  try {
    const temoignages = await Temoignage.find().sort({ ordre: 1, createdAt: -1 });
    res.status(200).json(temoignages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Admin : créer un témoignage ─────────────────────────────────────────────
module.exports.createTemoignage = async (req, res) => {
  try {
    const { nom, role, texte, note, photo, actif, ordre } = req.body;
    const t = await Temoignage.create({ nom, role, texte, note, photo, actif, ordre });
    res.status(201).json({ message: "Témoignage créé", temoignage: t });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Admin : modifier un témoignage ──────────────────────────────────────────
module.exports.updateTemoignage = async (req, res) => {
  try {
    const t = await Temoignage.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!t) return res.status(404).json({ message: "Témoignage introuvable" });
    res.status(200).json({ message: "Témoignage mis à jour", temoignage: t });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Admin : supprimer un témoignage ─────────────────────────────────────────
module.exports.deleteTemoignage = async (req, res) => {
  try {
    const t = await Temoignage.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ message: "Témoignage introuvable" });
    res.status(200).json({ message: "Témoignage supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
