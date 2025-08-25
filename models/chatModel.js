const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  expediteur: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "user" 
  },
  recepteur: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "user"
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["envoye", "lu"],
    default: "envoye"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Chat", chatSchema);
