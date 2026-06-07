const userModel = require("../models/userModel");
const fs = require("fs").promises;


module.exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Aucun fichier chargé" });
        }

        // Vérifier le type de l'image
        if (!['image/png', 'image/jpg', 'image/jpeg'].includes(req.file.mimetype)) {
            return res.status(400).json({ error: "Ce format d'image n'est pas autorisé" });
        }
        console.log("mimetype",req.file)
        // Vérifier la taille de l'image (max 500 Ko)
        if (req.file.size > 500000) {
            return res.status(400).json({ error: "L'image ne doit pas dépasser 5Mo" });
        }

        const fileName = req.body.id + ".jpg";

        // Sauvegarder l'image
        await fs.writeFile(
            `${__dirname}/../client/public/upload/profil/${fileName}`,
            req.file.buffer
        );

        // Mettre à jour le user
        const user = await userModel.findOneAndUpdate(
            { _id: req.body.id },
            { $set: { photo: `/upload/profil/${fileName}` } },
            { new: true }
        );

        res.status(200).json({
            message: "Image enregistrée avec succès",
            user
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'image", error);
        res.status(500).json({ error: "Erreur serveur : " + error.message });
    }
};
