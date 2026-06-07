const router = require("express").Router();
const projetController = require("../controller/projetController");
const { requireAuth } = require("../midleware/authMidleware");

router.post("/register", requireAuth, projetController.addProjet);
router.get("/getProjets", projetController.getprojets);
router.get("/getProjetBySecteur/:secteurId", projetController.projetBySecteur);
router.get("/user/:userId", projetController.projetsByUser);
router.get("/:id", projetController.projetInfo);
router.put("/:id/cloturer", requireAuth, projetController.cloturerProjet);
router.put("/:id", requireAuth, projetController.updateProjet);
router.delete("/:id", requireAuth, projetController.deleteProjet);

module.exports = router;
