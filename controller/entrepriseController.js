const entrepriseModel = require("../models/entrepriseModel")
const objectId = require("mongoose").Types.ObjectId


module.exports.addEntreprise = async (req, res) => {
  const { secteur, nom} = req.body;

  try {
    const entreprise = await entrepriseModel.create({
      nom, 
      secteur,
    
    });

    return res.status(201).json({message:"Ajout effectuer",statut:200, entreprise });
  } catch (error) {
    console.error("Erreur lors de l'ajout de entreprise", error);
    return res.status(500).send("Erreur serveur");
  }
};

module.exports.getEntreprise= async (req,res)=>{

    try {
        const entreprise = await entrepriseModel.find()
        .populate("secteur")
        res.status(200).json(entreprise)
    } catch (error) {
        console.log("Erreur lors de la recuperaton de user",error)
        res.status(500).send("erreur serveur")
    }
}

module.exports.entrepriseById = async(req,res)=>{
    const entrepriseId = req.params.id;
    if(!objectId.isValid(entrepriseId)){
        return res.status(400).send("Id invalide")
    }
    try {
        const entreprise = await entrepriseModel.findById(entrepriseId)
            .populate("secteur","_id email")
            .populate("user")
        if(!entreprise) res.send("entreprise non trouvé")
        if(entreprise) res.status(200).json(entreprise)
    } catch (error) {
        console.error("Erreur leur de la recuperation de entreprise",error)
        res.status(500).send("Erreru serveur",error)
    }
}

module.exports.updateEntreprise = async (req,res)=>{
    const entrepriseId = req.params.id;
    if(!objectId.isValid(entrepriseId)){
        res.status(400).send("Id invalide")
    }
    try {
        const entreprise = await entrepriseModel.findByIdAndUpdate(
            entrepriseId,
            {$set:req.body},
            {new:true,runValidators:true}
        )
        if(!entreprise){
            res.status(404).json({
                message:"entreprise non trouvé",
                status: 404
            })
        }
        if(entreprise){
             res.status(200).json({
                message:"mise a jour effectuer avec succes",
                status: 200,
                entreprise
             })
        }
    } catch (error) {
        console.error("Erreur lors de la mise a jour",error);
        res.status(500).send("Erreur serveur")
    }
    
}

module.exports.deleteEntreprise = async (req,res) =>{
    const entrepriseId = req.params.id;
    if(!objectId.isValid(entrepriseId)){
        res.status(400).send("Id invalide")
    }
    try {
        const entreprise = await entrepriseModel.findByIdAndDelete({_id:entrepriseId})
        if(!entreprise){
            res.status.send("entreprise non trouvé")
        }
        if(entreprise) res.status(200).json({
            message:"suppression effectuer avec succes"
        })
    } catch (error){
        res.status(500).send("erreur serveur")
    }
   

}