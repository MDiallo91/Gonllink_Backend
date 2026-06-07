const router  = require("express").Router();
const configCtrl = require("../controller/configController");
const { requireAuth } = require("../midleware/authMidleware");
const { requireAdmin } = require("../midleware/adminMidleware");
const multer  = require("multer");

const auth   = [requireAuth, requireAdmin];
const upload = multer({ storage: multer.memoryStorage() });

// ── Route publique (sans auth) — nom, email, téléphone du service client ──────
router.get("/public", configCtrl.getPublicConfig);

// ── Routes admin uniquement ───────────────────────────────────────────────────
router.get("/",           auth, configCtrl.getConfig);
router.put("/",           auth, configCtrl.updateConfig);
router.put("/logo",       auth, upload.single("logo"), configCtrl.uploadLogo);
router.get("/audit-logs", auth, configCtrl.getAuditLogs);

module.exports = router;
