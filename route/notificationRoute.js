const router = require("express").Router();
const notifCtrl = require("../controller/notificationController");
const { requireAuth } = require("../midleware/authMidleware");

router.get("/", requireAuth, notifCtrl.getMesNotifications);
router.put("/:id/lue", requireAuth, notifCtrl.marquerLue);
router.put("/toutes/lues", requireAuth, notifCtrl.marquerToutesLues);
router.delete("/:id", requireAuth, notifCtrl.deleteNotification);

module.exports = router;
