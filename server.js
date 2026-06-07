const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv").config({ path: "./config/.env" });
const DBconnect = require("./config/db");
const cookieParser = require("cookie-parser");
const { checkUser, requireAuth } = require("./midleware/authMidleware");
const path = require("path");

// Routes
const userRoute = require("./route/userRoute");
const secteurRoute = require("./route/secteurRoute");
const travailleurRoute = require("./route/travailleurRoute");
const entrepriseRoute = require("./route/entrepriseRoute");
const projetRoute = require("./route/projetRoute");
const enchereRoute = require("./route/enchererRoute");
const realisationRoute = require("./route/realisationRoute");
const chatRoute = require("./route/chatRoute");
const clientRoute = require("./route/clientRoute");
const avisRoute = require("./route/avisRoute");
const notificationRoute = require("./route/notificationRoute");
const signalementRoute = require("./route/signalementRoute");
const adminRoute = require("./route/adminRoute");
const configRoute = require("./route/configRoute");
const temoignageRoute = require("./route/temoignageRoute");

const initSocket = require("./helper/soket");

DBconnect();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());
app.use(checkUser);

app.use("/upload", express.static(path.join(__dirname, "client/public/upload")));

app.get("/jwtid", checkUser, (req, res) => {
    res.json({ user: res.locals.user || null });
});

// Routes API
app.use("/api/user", userRoute);
app.use("/api/secteur", secteurRoute);
app.use("/api/travailleur", travailleurRoute);
app.use("/api/entreprise", entrepriseRoute);
app.use("/api/projet", projetRoute);
app.use("/api/enchere", enchereRoute);
app.use("/api/realisation", realisationRoute);
app.use("/api/chat", chatRoute);
app.use("/api/client", clientRoute);
app.use("/api/avis", avisRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/signalement", signalementRoute);
app.use("/api/admin", adminRoute);
app.use("/api/config", configRoute);
app.use("/api/temoignage", temoignageRoute);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    },
});

initSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
