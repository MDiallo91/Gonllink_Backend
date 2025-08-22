const userModel = require("../models/userModel")
const secteurModel = require("../models/secteurModel")
const objectId = require("mongoose").Types.ObjectId


module.exports.addSecteur = async (req, res) => {
  const { nom, picture} = req.body;

  try {
    const secteur = await secteurModel.create({
      nom, 
      picture
    });

    return res.status(201).json({message:"Ajout effectuer",statut:200, secteur });
  } catch (error) {
    console.error("Erreur lors de l'ajout du secteur", error);
    return res.status(500).send("Erreur serveur");
  }
};

module.exports.getSecteur = async (req,res)=>{

    try {
        const secteur = await secteurModel.find().select("-password")
        res.status(200).json(secteur)
    } catch (error) {
        console.log("Erreur lors de la recuperaton de user")
        res.status(500).send("erreur serveur")
    }
}

module.exports.secteurById = async(req,res)=>{
    const secteurId = req.params.id;
    if(!objectId.isValid(secteurId)){
        return res.status(400).send("Id invalide")
    }
    try {
        const secteur = await secteurModel.findById(secteurId)
        if(!secteur) res.send("secteur non trouvé")
        if(secteur) res.status(200).json(secteur)
    } catch (error) {
        console.error("Erreur leur de la recuperation de secteur",error)
        res.status(500).send("Erreru serveur",error)
    }
}

module.exports.updateSecteur = async (req,res)=>{
    const secteurId = req.params.id;
    if(!objectId.isValid(secteurId)){
        res.status(400).send("Id invalide")
    }
    try {
        const secteur = await secteurModel.findByIdAndUpdate(
            secteurId,
            {$set:req.body},
            {new:true,runValidators:true}
        )
        if(!secteur){
            res.status(404).json({
                message:"secteur non trouvé",
                status: 404
            })
        }
        if(secteur){
             res.status(200).json({
                message:"mise a jour effectuer avec succes",
                status: 200,
                secteur
             })
        }
    } catch (error) {
        console.error("Erreur lors de la mise a jour",error);
        res.status(500).send("Erreur serveur")
    }
    
}

module.exports.deleteSecteur = async (req,res) =>{
    const secteurId = req.params.id;
    if(!objectId.isValid(secteurId)){
        res.status(400).send("Id invalide")
    }
    try {
        const secteur = await secteurModel.findByIdAndDelete({_id:secteurId})
        if(!secteur){
            res.status.send("secteur non trouvé")
        }
        if(secteur) res.status(200).json({
            message:"suppression effectuer avec succes"
        })
    } catch (error){
        res.status(500).send("erreur serveur")
    }
   

}