const chatModel = require("../models/chatModel");

exports.addChate = async (req, res) => {
  try {
    const { expediteur, recepteur, message } = req.body;

    const chat = new chatModel({
      expediteur,
      recepteur,
      message
    });

    await chat.save();

    //On renvoie le chatModel sauvegardé
    res.status(201).json(chat);

  } catch (error) {
    console.error("erreur server",error)
    res.status(500).json({ error: error.chatModel });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const chat = await chatModel.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ createdAt: 1 });

    res.json(chat);

  } catch (error) {
    res.status(500).json({ error: error.chatModel });
  }
};
