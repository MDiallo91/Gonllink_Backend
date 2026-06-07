const crypto = require("crypto");
const sendEmail = require("./email"); //  fichier nodemailer

const sendVerificationEmail = async (user) => {
  try {
    if (!user.email) throw new Error("Utilisateur sans email");

    // Générer un code aléatoire à 6 chiffres
    const code = crypto.randomInt(100000, 999999).toString();
    user.verificationCode = code;
    await user.save();

    const message = `Bienvenue 🎉 ! Voici ton code de confirmation : ${code}`;
    await sendEmail(user.email, "Code de confirmation", message);

    // console.log("Email de vérification envoyé à :", user.email);
  } catch (error) {
    console.error("Erreur lors de l'envoi du code de vérification :", error.message);
  }
};

module.exports = sendVerificationEmail;
