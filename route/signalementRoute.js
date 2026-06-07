const router = require("express").Router();
const signalementController = require("../controller/signalementController");
const { requireAuth } = require("../midleware/authMidleware");

router.post("/", requireAuth, signalementController.createSignalement);
router.get("/", requireAuth, signalementController.getSignalements);
router.put("/:id/traiter", requireAuth, signalementController.traiterSignalement);

module.exports = router;
