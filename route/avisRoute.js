const router = require("express").Router();
const avisController = require("../controller/avisController");
const { requireAuth } = require("../midleware/authMidleware");

router.post("/", requireAuth, avisController.createAvis);
router.get("/user/:id", avisController.getAvisByUser);
router.put("/:id/repondre", requireAuth, avisController.repondreAvis);
router.delete("/:id", requireAuth, avisController.deleteAvis);

module.exports = router;
