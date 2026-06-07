const router = require("express").Router();
const adminCtrl = require("../controller/adminController");
const { requireAuth } = require("../midleware/authMidleware");
const { requireAdmin } = require("../midleware/adminMidleware");

const auth = [requireAuth, requireAdmin];

// Stats publiques (page d'accueil — sans auth)
router.get("/stats/public", adminCtrl.getPublicStats);
// Stats admin (avec auth)
router.get("/stats", auth, adminCtrl.getStats);

// Utilisateurs
router.get("/users", auth, adminCtrl.getAllUsers);
router.put("/users/:id/activer",  auth, adminCtrl.toggleActiverUser); // activer / désactiver
router.put("/users/:id/verifier", auth, adminCtrl.verifierUser);
router.put("/users/:id/premium", auth, adminCtrl.activerPremium);
router.put("/users/:id/suspendre", auth, adminCtrl.suspendreUser);
router.delete("/users/:id", auth, adminCtrl.deleteUserAdmin);

// Projets
router.get("/projets", auth, adminCtrl.getAllProjets);
router.delete("/projets/:id", auth, adminCtrl.deleteProjetAdmin);

// Secteurs
router.post("/secteurs", auth, adminCtrl.createSecteur);
router.put("/secteurs/:id", auth, adminCtrl.updateSecteur);
router.delete("/secteurs/:id", auth, adminCtrl.deleteSecteur);

// Avis
router.get("/avis", auth, adminCtrl.getAllAvis);
router.put("/avis/:id/masquer", auth, adminCtrl.masquerAvis);

module.exports = router;
