const chatModel = require("../models/chatModel");

function initSocket(io) {
    io.on("connection", (socket) => {
        console.log("Un utilisateur est connecté :", socket.id);

        // Joindre une "room" spécifique à une conversation
        socket.on("joinRoom", async ({ expediteur, recepteur }) => {
            const roomId = [expediteur, recepteur].sort().join("_");
            socket.join(roomId);

            console.log(`Utilisateur ${socket.id} a rejoint la room ${roomId}`);

            try {
                // Charger les anciens messages
                const messages = await chatModel.find({
                    $or: [
                        { expediteur, recepteur },
                        { expediteur: recepteur, recepteur: expediteur }
                    ]
                }).sort({ createdAt: 1 });

                // Envoyer l’historique uniquement à l’utilisateur qui rejoint
                socket.emit("loadMessages", messages);
            } catch (err) {
                console.error(" Erreur lors du chargement des messages :", err);
            }
        });

        // Réception et envoi d’un message en temps réel
        socket.on("sendMessage", async (data) => {
            const { expediteur, recepteur, message: contenu } = data;

            try {
                // Sauvegarde en DB
                const msg = new chatModel({ expediteur, recepteur, message: contenu });
                await msg.save();

                const roomId = [expediteur, recepteur].sort().join("_");

                // Envoyer le message à tous dans la room
                io.to(roomId).emit("receiveMessage", msg);
            } catch (err) {
                console.error(" Erreur lors de l’envoi du message :", err);
                socket.emit("errorMessage", { error: "Impossible d’envoyer le message" });
            }
        });

        // Déconnexion
        socket.on("disconnect", () => {
            console.log(" Utilisateur déconnecté :", socket.id);
        });
    });
}

module.exports = initSocket;
