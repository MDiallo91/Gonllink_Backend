const router = require("express").Router();
const chatController = require("../controller/chatController");

router.post("/addChat", chatController.addChate);
router.get("/:user1Id/:user2Id", chatController.getConversation);

module.exports = router;
