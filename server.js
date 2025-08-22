const express = require("express");
const app = express();
const dotenv = require("dotenv").config({ path: "./config/.env" });
const DBconnect = require("./config/db");
const cookieParser = require("cookie-parser");
const {checkUser,requireAuth} = require("./midleware/authMidleware")

// Routes
const userRoute = require("./route/userRoute");
const secteurRoute = require("./route/secteurRoute")
const travailleurRoute = require("./route/travailleurRoute")
const entrepriseRoute = require("./route/entrepriseRoute")
// Connexion à la base de données
DBconnect();
  
// Middlewares
app.use(express.json());
app.use(cookieParser()); // nécessaire pour lire les cookies

app.use(checkUser)
app.get("/jwtid",requireAuth,(req,res)=>{
  res.status(200).send(res.locals.user._id)
})
// Routes
app.use("/api/user", userRoute);
app.use("/api/secteur", secteurRoute);
app.use("/api/travailleur", travailleurRoute);
app.use("/api/entreprise", entrepriseRoute)

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
