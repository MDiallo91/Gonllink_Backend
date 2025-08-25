const realisationModel = require("../models/realisationModel")
const objectId = require("mongoose").Types.ObjectId


module.exports.addRealisation = async (req, res) => {
  const { enchere, } = req.body;

  try {
    const realisation = await realisationModel.create({
        enchere
    });

    return res.status(201).json({message:"Ajout effectuer",statut:200, realisation });
  } catch (error) {
    console.error("Erreur lors de l'ajout du realisation", error);
    return res.status(500).send("Erreur serveur");
  }
};

module.exports.getRealisation = async (req,res)=>{

    try {
        const realisation = await realisationModel.find()
            .populate({
                path: "enchere",            
                populate: {
                    path: "projet",           
                    model: "projet"
                }
            });
        res.status(200).json(realisation)
    } catch (error) {
        console.log("Erreur lors de la recuperaton de user",error)
        res.status(500).send("erreur serveur",error)
    }
}

module.exports.realisationById = async(req,res)=>{
    const realisationId = req.params.id;
    if(!objectId.isValid(realisationId)){
        return res.status(400).send("Id invalide")
    }
    try {
        const realisation = await realisationModel
        .findById(realisationId)
        .populate({
                path: "projet",            
                populate: {
                    path: "user",           
                    model: "user"
                }
        });
        if(!realisation) res.send("realisation non trouvé")
        if(realisation) res.status(200).json(realisation)
    } catch (error) {
        console.error("Erreur leur de la recuperation de realisation",error)
        res.status(500).send("Erreru serveur",error)
    }
}

module.exports.updateRealisation = async (req,res)=>{
    const realisationId = req.params.id;
    if(!objectId.isValid(realisationId)){
        res.status(400).send("Id invalide")
    }
    try {
        const realisation = await realisationModel.findByIdAndUpdate(
            realisationId,
            {$set:req.body},
            {new:true,runValidators:true}
        )
        if(!realisation){
            res.status(404).json({
                message:"realisation non trouvé",
                status: 404
            })
        }
        if(realisation){
             res.status(200).json({
                message:"mise a jour effectuer avec succes",
                status: 200,
                realisation
             })
        }
    } catch (error) {
        console.error("Erreur lors de la mise a jour",error);
        res.status(500).send("Erreur serveur")
    }
    
}

module.exports.deleteRealisation = async (req,res) =>{
    const realisationId = req.params.id;
    if(!objectId.isValid(realisationId)){
        res.status(400).send("Id invalide")
    }
    try {
        const secteur = await realisationModel.findByIdAndDelete({_id:realisationId})
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