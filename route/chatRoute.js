const router = require("express").Router();
const chatController = require("../controller/chatController");

// Envoyer un message (fallback HTTP)
router.post("/addChat", chatController.addChate);

// Récupérer la liste des contacts (conversations distinctes) d'un utilisateur
router.get("/contacts/:userId", chatController.getContacts);

// Récupérer l'historique d'une conversation entre deux utilisateurs
router.get("/:user1Id/:user2Id", chatController.getConversation);

module.exports = router;
