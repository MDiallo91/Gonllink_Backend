const fs = require("fs/promises");
const RealisationModel = require("../models/realisationModel");

const path = require("path");

module.exports.createRealisation = async (req, res) => {
  try {
    let imagePaths = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        // Vérifier type
        if (!["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
          throw new Error("Format d'image non accepté");
        }

        // Vérifier taille (5Mo max)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("La taille maximale est 5Mo");
        }

        // Créer nom unique
        const fileName = `${req.body.realisateur}-${Date.now()}-${file.originalname}`;

        // Chemin absolu de sauvegarde
        const uploadPath = path.join(__dirname, "../client/public/upload/realisation", fileName);

        // Sauvegarder l'image
        await fs.writeFile(uploadPath, file.buffer);

        // Stocker chemin relatif (pour frontend)
        imagePaths.push(`upload/realisation/${fileName}`);
      }
    }

    // Créer la réalisation
    const newRealisation = new RealisationModel({
      realisateur: req.body.realisateur,
      description: req.body.description,
      images: imagePaths,
    });

    const savedRealisation = await newRealisation.save();

    res.status(201).json({
      status: 200,
      message: "Enregistrement effectué avec succès",
      savedRealisation,
    });
  } catch (error) {
    console.error("Erreur lors de la création d'une réalisation :", error);
    res.status(500).json({ message: error.message });
  }
};


//afficher les post
module.exports.getRealisation = async (req, res) => {
  try {
    const post = await RealisationModel.find().sort({ createdAt: -1 });//afficher les post par date publication decroissant
    res.status(200).json(post);
  } catch (error) {
    console.log("Erreur lors de la recuperation de post");
    res.status(500).json(`Erreur serveur ${error}`)
  }
}

//repuerer les post par realisateur
module.exports.getRealisationById = async (req, res) => {
  const realisateurId = req.params.id;
  try {
    const posts = await RealisationModel.find({ realisateur: realisateurId }).sort({ createdAt: -1 })
      .populate({
        path: "realisateur",
        populate: { path: "profile" }
      })
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

