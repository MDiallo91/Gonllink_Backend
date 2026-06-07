const router = require("express").Router();
const enchereCtrl = require("../controller/enchereController");
const { requireAuth } = require("../midleware/authMidleware");

router.post("/register", requireAuth, enchereCtrl.addEnchere);
router.get("/getEnchere", enchereCtrl.getEnchere);
router.get("/byUser/:id", enchereCtrl.getEncheresByUser);
router.get("/byProjet/:projetId", enchereCtrl.getEncheresByProjet);
router.get("/mesOffres/:id", enchereCtrl.getMesOffres);
router.get("/byChoix/:id", enchereCtrl.getEncheresChoix);
router.put("/:id", requireAuth, enchereCtrl.updateEnchere);
router.delete("/:id", requireAuth, enchereCtrl.deleteEnchere);

module.exports = router;
