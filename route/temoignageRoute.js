const router = require("express").Router();
const ctrl = require("../controller/temoignageController");
const { requireAuth } = require("../midleware/authMidleware");
const { requireAdmin } = require("../midleware/adminMidleware");

const auth = [requireAuth, requireAdmin];

router.get("/public", ctrl.getPublicTemoignages);       // sans auth — page d'accueil
router.get("/",       auth, ctrl.getTemoignages);
router.post("/",      auth, ctrl.createTemoignage);
router.put("/:id",    auth, ctrl.updateTemoignage);
router.delete("/:id", auth, ctrl.deleteTemoignage);

module.exports = router;
