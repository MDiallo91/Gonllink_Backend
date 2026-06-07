const chatModel = require("../models/chatModel");

// Envoyer un message (fallback HTTP, la version temps-réel est dans socket.js)
exports.addChate = async (req, res) => {
  try {
    const { expediteur, recepteur, message } = req.body;

    const chat = new chatModel({ expediteur, recepteur, message });
    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de l'envoi du message" });
  }
};

// Récupérer la conversation entre deux utilisateurs
exports.getConversation = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    // Correction : utiliser expediteur/recepteur conformément au modèle
    const chat = await chatModel.find({
      $or: [
        { expediteur: user1, recepteur: user2 },
        { expediteur: user2, recepteur: user1 }
      ]
    })
      .populate({ path: "expediteur", select: "photo email", populate: { path: "profile", select: "prenom nom" } })
      .populate({ path: "recepteur",  select: "photo email", populate: { path: "profile", select: "prenom nom" } })
      .sort({ createdAt: 1 });

    res.json(chat);
  } catch (error) {
    console.error("Erreur lors du chargement de la conversation :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer les contacts d'un utilisateur (toutes ses conversations uniques)
exports.getContacts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Récupère tous les messages où l'utilisateur est expéditeur ou récepteur
    const messages = await chatModel.find({
      $or: [{ expediteur: userId }, { recepteur: userId }]
    })
      .populate({ path: "expediteur", select: "photo email role", populate: { path: "profile", select: "prenom nom" } })
      .populate({ path: "recepteur",  select: "photo email role", populate: { path: "profile", select: "prenom nom" } })
      .sort({ createdAt: -1 });

    // Déduplique les contacts : un seul objet par interlocuteur
    const contactsMap = new Map();
    for (const msg of messages) {
      const interlocuteur = msg.expediteur._id.toString() === userId
        ? msg.recepteur
        : msg.expediteur;

      const id = interlocuteur._id.toString();
      if (!contactsMap.has(id)) {
        contactsMap.set(id, {
          user: interlocuteur,
          dernierMessage: msg.message,
          date: msg.createdAt,
        });
      }
    }

    res.json(Array.from(contactsMap.values()));
  } catch (error) {
    console.error("Erreur lors de la récupération des contacts :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
