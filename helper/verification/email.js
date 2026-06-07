const nodemailer = require("nodemailer");

// configurer ton compte email
const transporter = nodemailer.createTransport({
  service: "gmail", // si tu utilises Gmail
  auth: {
    user: process.env.EMAIL_USER,   // ton adresse Gmail
    pass: process.env.APP_PASSWORD, // ton mot de passe d'application
  },
});

// Fonction qui envoie un email
async function sendEmail(to, subject, message) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // l’expéditeur
      to: to,                       // le destinataire
      subject: subject,             // le sujet du mail
      text: message                 // le message
    });

    // console.log("Email envoyé avec succès à " + to);
  } catch (error) {
    console.error("Erreur d’envoi d’email :", error);
  }
}

module.exports = sendEmail;
