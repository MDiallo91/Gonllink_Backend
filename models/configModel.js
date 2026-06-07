const mongoose = require("mongoose");

// Document unique de configuration de la plateforme (singleton via upsert)
const configSchema = new mongoose.Schema({

  // ─── Configuration générale de l'app ──────────────────────────
  nomApp:          { type: String, default: "Gollink" },
  descriptionApp:  { type: String, default: "Plateforme freelance africaine" },
  emailContact:    { type: String, default: "contact@gollink.com" },
  telephone:       { type: String },
  adresse:         { type: String },
  logo:            { type: String },

  // ─── Textes légaux (Markdown supporté) ────────────────────────
  mentionsLegales: { type: String, default: "" },
  cgu:             { type: String, default: "" }, // Conditions Générales d'Utilisation
  politique:       { type: String, default: "" }, // Politique de confidentialité

  // ─── Réseaux sociaux ──────────────────────────────────────────
  reseaux: {
    facebook:  { type: String, default: "" },
    discord:   { type: String, default: "" },
    twitter:   { type: String, default: "" },
    instagram: { type: String, default: "" },
  },

  // ─── Paramètres système ────────────────────────────────────────
  maintenanceMode:      { type: Boolean, default: false }, // Si true → bloque l'accès public
  inscriptionsOuvertes: { type: Boolean, default: true  }, // Permet ou non de nouveaux comptes
  freemiumActif:        { type: Boolean, default: true  }, // Activer le plan gratuit

  // ─── Configuration email (SMTP) ───────────────────────────────
  smtp: {
    host:   { type: String, default: "" },
    port:   { type: Number, default: 587 },
    user:   { type: String, default: "" },
    pass:   { type: String, default: "" }, // Stocké chiffré en prod
    from:   { type: String, default: "noreply@gollink.com" },
    actif:  { type: Boolean, default: false },
  },

  // ─── Configuration SMS (Twilio ou équivalent) ─────────────────
  sms: {
    provider:    { type: String, default: "twilio" },
    accountSid:  { type: String, default: "" },
    authToken:   { type: String, default: "" },
    numero:      { type: String, default: "" }, // Numéro expéditeur
    actif:       { type: Boolean, default: false },
  },

  // ─── Configuration paiement (Stripe) ──────────────────────────
  paiement: {
    provider:        { type: String, default: "stripe" },
    publicKey:       { type: String, default: "" },
    secretKey:       { type: String, default: "" }, // Stocké chiffré en prod
    devise:          { type: String, default: "EUR" },
    commissionPct:   { type: Number, default: 5 }, // % prélevé sur chaque transaction
    actif:           { type: Boolean, default: false },
  },

  // ─── Configuration Push Notifications (mobile) ────────────────
  // Prépare l'intégration future d'une app mobile (Android / iOS)
  push: {
    provider: { type: String, default: "fcm", enum: ["fcm", "onesignal", "expo"] },
    actif:    { type: Boolean, default: false },

    // ── Firebase Cloud Messaging (FCM) ──
    // Utilisé pour Android (et iOS via APNs relay)
    fcm: {
      projectId:       { type: String, default: "" }, // ID du projet Firebase
      serverKey:       { type: String, default: "" }, // Legacy server key (FCM v1 → service account)
      serviceAccount:  { type: String, default: "" }, // JSON du compte de service (FCM HTTP v1)
    },

    // ── OneSignal ──
    // Solution clé-en-main multi-plateforme (Android + iOS + Web)
    onesignal: {
      appId:      { type: String, default: "" }, // App ID OneSignal
      restApiKey: { type: String, default: "" }, // REST API key (envoi serveur → OneSignal)
    },

    // ── Expo Push Notifications ──
    // Si l'app mobile est développée avec Expo / React Native
    expo: {
      accessToken: { type: String, default: "" }, // Expo access token (priorité delivery)
      experienceId: { type: String, default: "" }, // Ex: @username/app-name
    },

    // ── Sujets des notifications (templates) ──────────────────────
    // Permet d'activer/désactiver certains types de push en production
    canaux: {
      nouvelleOffre:   { type: Boolean, default: true  }, // Nouvelle offre sur un projet
      offreAcceptee:   { type: Boolean, default: true  }, // Offre acceptée → travailleur
      nouveauMessage:  { type: Boolean, default: true  }, // Nouveau message reçu
      projetCloture:   { type: Boolean, default: true  }, // Projet clôturé
      avisRecu:        { type: Boolean, default: true  }, // Avis laissé sur son profil
      compteVerifie:   { type: Boolean, default: true  }, // Compte vérifié par admin
      promotion:       { type: Boolean, default: false }, // Notifications marketing (opt-in)
    },
  },

}, { timestamps: true });

module.exports = mongoose.model("Config", configSchema);
