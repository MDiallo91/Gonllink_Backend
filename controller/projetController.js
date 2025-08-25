const projetModel = require("../models/projetModel")
const objectId = require("mongoose").Types.ObjectId


module.exports.addProjet = async (req, res) => {
  const { secteur, titre,description, localite,dateDebut,user} = req.body;

  try {
    const projet = await projetModel.create({
      titre, 
      description,
      secteur,
      localite,
      dateDebut,
      user
    });

    return res.status(201).json({message:"Ajout effectuer",statut:200, projet });
  } catch (error) {
    console.error("Erreur lors de l'ajout du projet", error);
    return res.status(500).send("Erreur serveur");
  }
};
module.exports.getprojets = async (req, res) => {
  try {
    const projet = await projetModel
      .find()
      .select("-password")        
      .populate("secteur"); 
         
        

    res.status(200).json(projet);
  } catch (error) {
    console.log("Erreur lors de la récupération des projet :", error);
    res.status(500).send("Erreur serveur");
  }
};


module.exports.projetInfo = async(req,res)=>{
    const projetId = req.params.id;
    if(!objectId.isValid(projetId)){
        return res.status(400).send("Id invalide")
    }
    try {
        const projet = await projetModel.findById(projetId)
        .select("-password")

        if(!projet) res.send("utilisateur non trouvé")
        if(projet) res.status(200).json(projet)
    } catch (error) {
        console.error("Erreur leur de la recuperation de projet",error)
        res.status(500).send("Erreru serveur")
    }
}



module.exports.projetBySecteur = async (req, res) => {
    const secteurId = req.params.id;

    // Vérification de l'ID
    if (!mongoose.Types.ObjectId.isValid(secteurId)) {
        return res.status(400).send("Id de secteur invalide");
    }

    try {
        // Chercher tous les projets qui appartiennent à ce secteur
        const projets = await projetModel.find({ secteur: secteurId })
            .populate("user") 
           

        if (!projets || projets.length === 0) {
            return res.status(404).send("Aucun projet trouvé pour ce secteur");
        }

        res.status(200).json(projets);
    } catch (error) {
        console.error("Erreur lors de la récupération des projets :", error);
        res.status(500).send("Erreur serveur");
    }
};

module.exports.updateProjet = async (req,res)=>{
    const projetId = req.params.id;
    if(!objectId.isValid(projetId)){
        res.status(400).send("Id invalide")
    }
    try {
        const projet = await projetModel.findByIdAndUpdate(
            projetId,
            {$set:req.body},
            {new:true,runValidators:true}
        )
        if(!projet){
            res.status(404).json({
                message:"projet non trouvé",
                status: 404
            })
        }
        if(projet){
             res.status(200).json({
                message:"mise a jour effectuer avec succes",
                status: 200,
                projet
             })
        }
    } catch (error) {
        console.error("Erreur lors de la mise a jour",error);
        res.status(500).send("Erreur serveur")
    }
    
}

module.exports.deleteProjet = async (req,res) =>{
    const projetId = req.params.id;
    if(!objectId.isValid(projetId)){
        res.status(400).send("Id invalide")
    }
    try {
        const projet = await projetModel.findByIdAndDelete({_id:projetId})
        if(!projet){
            res.status.send("projet non trouvé")
        }
        if(projet) res.status(200).json({
            message:"suppression effectuer avec succes"
        })
    } catch (error){
        res.status(500).send("erreur serveur")
    }
   

}