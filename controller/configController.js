const Config    = require("../models/configModel");
const AuditLog  = require("../models/auditLogModel");
const fs        = require("fs").promises;

// ─── Helper : enregistre un audit log ────────────────────────────────────────
const logAction = async (req, action, description = "", extras = {}) => {
  try {
    await AuditLog.create({
      utilisateur: req.user._id,
      action,
      description,
      ip: req.ip || req.headers["x-forwarded-for"] || "inconnue",
      ...extras,
    });
  } catch { /* Le log ne doit jamais faire planter la route principale */ }
};

// ─── Config publique (sans auth) — champs non-sensibles uniquement ───────────
// Utilisée par le frontend au démarrage pour charger nom, email, téléphone, etc.
module.exports.getPublicConfig = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) config = await Config.create({});

    // On n'expose que les champs non-confidentiels
    res.status(200).json({
      nomApp:          config.nomApp,
      descriptionApp:  config.descriptionApp,
      emailContact:    config.emailContact,
      telephone:       config.telephone,
      adresse:         config.adresse,
      logo:            config.logo || "",
      mentionsLegales: config.mentionsLegales,
      cgu:             config.cgu,
      politique:       config.politique,
      reseaux:         config.reseaux,  // liens réseaux sociaux (footer)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Récupérer la configuration courante ─────────────────────────────────────
module.exports.getConfig = async (req, res) => {
  try {
    // findOne retourne null si aucune config n'existe encore
    let config = await Config.findOne();

    // Initialisation automatique au premier appel
    if (!config) config = await Config.create({});

    // Masque les clés sensibles avant l'envoi (ne jamais exposer les secrets en clair)
    const safe = config.toObject();
    if (safe.smtp?.pass)                safe.smtp.pass                = safe.smtp.pass ? "••••••••" : "";
    if (safe.sms?.authToken)            safe.sms.authToken            = safe.sms.authToken ? "••••••••" : "";
    if (safe.paiement?.secretKey)       safe.paiement.secretKey       = safe.paiement.secretKey ? "••••••••" : "";
    if (safe.push?.fcm?.serverKey)      safe.push.fcm.serverKey       = safe.push.fcm.serverKey ? "••••••••" : "";
    if (safe.push?.fcm?.serviceAccount) safe.push.fcm.serviceAccount  = safe.push.fcm.serviceAccount ? "••••••••" : "";
    if (safe.push?.onesignal?.restApiKey) safe.push.onesignal.restApiKey = safe.push.onesignal.restApiKey ? "••••••••" : "";
    if (safe.push?.expo?.accessToken)   safe.push.expo.accessToken    = safe.push.expo.accessToken ? "••••••••" : "";

    res.status(200).json(safe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Mettre à jour la configuration ──────────────────────────────────────────
module.exports.updateConfig = async (req, res) => {
  try {
    const update = { ...req.body };

    // Ne pas écraser un secret avec le placeholder masqué envoyé par le frontend
    if (update.smtp?.pass               === "••••••••") delete update.smtp.pass;
    if (update.sms?.authToken           === "••••••••") delete update.sms.authToken;
    if (update.paiement?.secretKey      === "••••••••") delete update.paiement.secretKey;
    if (update.push?.fcm?.serverKey     === "••••••••") delete update.push.fcm.serverKey;
    if (update.push?.fcm?.serviceAccount === "••••••••") delete update.push.fcm.serviceAccount;
    if (update.push?.onesignal?.restApiKey === "••••••••") delete update.push.onesignal.restApiKey;
    if (update.push?.expo?.accessToken  === "••••••••") delete update.push.expo.accessToken;

    const config = await Config.findOneAndUpdate(
      {},
      { $set: update },
      { new: true, upsert: true, runValidators: true }
    );

    await logAction(req, "MODIFIER_CONFIG", "Mise à jour de la configuration de la plateforme");

    res.status(200).json({ message: "Configuration sauvegardée", config });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Upload du logo de la plateforme ─────────────────────────────────────────
module.exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Aucun fichier reçu" });

    const allowed = ["image/png", "image/jpg", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!allowed.includes(req.file.mimetype))
      return res.status(400).json({ message: "Format non autorisé (PNG, JPG, WEBP, SVG)" });

    if (req.file.size > 2_000_000)
      return res.status(400).json({ message: "Le logo ne doit pas dépasser 2 Mo" });

    const ext      = req.file.originalname.split(".").pop();
    const fileName = `logo.${ext}`;
    const filePath = `${__dirname}/../client/public/upload/logo/${fileName}`;

    await fs.writeFile(filePath, req.file.buffer);

    const logoUrl = `/upload/logo/${fileName}`;
    await Config.findOneAndUpdate({}, { $set: { logo: logoUrl } }, { upsert: true });

    await logAction(req, "MODIFIER_CONFIG", "Logo de la plateforme mis à jour");

    res.status(200).json({ message: "Logo enregistré", logo: logoUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Récupérer les audit logs (paginés) ──────────────────────────────────────
module.exports.getAuditLogs = async (req, res) => {
  const page  = parseInt(req.query.page)   || 1;
  const limit = parseInt(req.query.limit)  || 30;
  const { action } = req.query;

  const filter = action ? { action } : {};

  try {
    const total = await AuditLog.countDocuments(filter);
    const logs  = await AuditLog.find(filter)
      .populate("utilisateur", "email photo")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ logs, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
