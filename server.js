const express = require("express");
const app = express();
const http = require("http"); // nécessaire pour socket.io
const { Server } = require("socket.io");
const dotenv = require("dotenv").config({ path: "./config/.env" });
const DBconnect = require("./config/db");
const cookieParser = require("cookie-parser");
const { checkUser, requireAuth } = require("./midleware/authMidleware");

// Routes
const userRoute = require("./route/userRoute");
const secteurRoute = require("./route/secteurRoute");
const travailleurRoute = require("./route/travailleurRoute");
const entrepriseRoute = require("./route/entrepriseRoute");
const projetRoute = require("./route/projetRoute");
const enchereRoute = require("./route/enchererRoute");
const realisationRoute = require("./route/realisationRoute");
const chatRoute = require("./route/chatRoute")
const clientRoute = require("./route/clientRoute")

// Import socket
const initSocket = require("./helper/soket");

// Connexion à la base de données
DBconnect();

// Middlewares
app.use(express.json());
app.use(cookieParser()); // nécessaire pour lire les cookies

app.use(checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

// Routes
app.use("/api/user", userRoute);
app.use("/api/secteur", secteurRoute);
app.use("/api/travailleur", travailleurRoute);
app.use("/api/entreprise", entrepriseRoute);
app.use("/api/projet", projetRoute);
app.use("/api/enchere", enchereRoute);
app.use("/api/realisation", realisationRoute);
app.use("/api/chat", chatRoute);
app.use("/api/client", clientRoute);

// Création du serveur HTTP + socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // autorise toutes les origines, à sécuriser en prod
    methods: ["GET", "POST"],
  },
});

// Initialiser socket
initSocket(io);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
