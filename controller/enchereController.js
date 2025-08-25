const encherer = require("../models/enchereModel")
const objectId = require("mongoose").Types.ObjectId


module.exports.addEnchere = async (req, res) => {
  const { user,projet } = req.body;

  try {
    const enchere = await encherer.create({
      user, 
      projet
    });

    return res.status(201).json({message:"Ajout effectuer",statut:200, enchere });
  } catch (error) {
    console.error("Erreur lors de l'ajout du enchere", error);
    return res.status(500).send("Erreur serveur");
  }
};

module.exports.getEnchere = async (req, res) => {

    try {
        const enchere = await encherer.find()
            .select("-password")
            .populate("user")
            .populate("projet")
        res.status(200).json(enchere)
    } catch (error) {
        console.log("Erreur lors de la recuperaton de l'enchere")
        res.status(500).send("erreur serveur")
    }
}

module.exports.enchereById = async(req,res)=>{
    const enchereId = req.params.id;
    if(!objectId.isValid(enchereId)){
        return res.status(400).send("Id invalide")
    }
    try {
        const enchere = await encherer.findById(enchereId)
        if(!enchere) res.send("enchere non trouvé")
        if(enchere) res.status(200).json(enchere)
    } catch (error) {
        console.error("Erreur leur de la recuperation de enchere",error)
        res.status(500).send("Erreru serveur",error)
    }
}

module.exports.updateEnchere = async (req,res)=>{
    const enchereId = req.params.id;
    if(!objectId.isValid(enchereId)){
        res.status(400).send("Id invalide")
    }
    try {
        const enchere = await encherer.findByIdAndUpdate(
            enchereId,
            {$set:req.body},
            {new:true,runValidators:true}
        )
        if(!enchere){
            res.status(404).json({
                message:"enchere non trouvé",
                status: 404
            })
        }
        if(enchere){
             res.status(200).json({
                message:"mise a jour effectuer avec succes",
                status: 200,
                enchere
             })
        }
    } catch (error) {
        console.error("Erreur lors de la mise a jour",error);
        res.status(500).send("Erreur serveur")
    }
    
}

module.exports.deleteEnchere = async (req,res) =>{
    const enchereId = req.params.id;
    if(!objectId.isValid(enchereId)){
        res.status(400).send("Id invalide")
    }
    try {
        const enchere = await encherer.findByIdAndDelete({_id:enchereId})
        if(!enchere){
            res.status.send("enchere non trouvé")
        }
        if(enchere) res.status(200).json({
            message:"suppression effectuer avec succes"
        })
    } catch (error){
        res.status(500).send("erreur serveur")
    }
   

}