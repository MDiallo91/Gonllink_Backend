const travailleurModel = require("../models/travailleurModel")
const objectId = require("mongoose").Types.ObjectId


module.exports.addTravailleur = async (req, res) => {
  const { secteur, prenom,nom, user} = req.body;

  try {
    const travailleur = await travailleurModel.create({
      nom, 
      prenom,
      secteur,
      user
    });

    return res.status(201).json({message:"Ajout effectuer",statut:200, travailleur });
  } catch (error) {
    console.error("Erreur lors de l'ajout du travailleur", error);
    return res.status(500).send("Erreur serveur");
  }
};
module.exports.getTravailleurs = async (req, res) => {
  try {
    const travailleur = await travailleurModel
      .find()
      .select("-password")        
      .populate("user")
      .populate("secteur"); 
         
        

    res.status(200).json(travailleur);
  } catch (error) {
    console.log("Erreur lors de la récupération des travailleur :", error);
    res.status(500).send("Erreur serveur");
  }
};


module.exports.travailleurInfo = async(req,res)=>{
    const travailleurId = req.params.id;
    if(!objectId.isValid(travailleurId)){
        return res.status(400).send("Id invalide")
    }
    try {
        const travailleur = await travailleurModel.findById(travailleurId)
        .select("-password")

        if(!travailleur) res.send("utilisateur non trouvé")
        if(travailleur) res.status(200).json(travailleur)
    } catch (error) {
        console.error("Erreur leur de la recuperation de travailleur",error)
        res.status(500).send("Erreru serveur")
    }
}

module.exports.updateTravailleur = async (req,res)=>{
    const travailleurId = req.params.id;
    if(!objectId.isValid(travailleurId)){
        res.status(400).send("Id invalide")
    }
    try {
        const travailleur = await travailleurModel.findByIdAndUpdate(
            travailleurId,
            {$set:req.body},
            {new:true,runValidators:true}
        )
        if(!travailleur){
            res.status(404).json({
                message:"travailleur non trouvé",
                status: 404
            })
        }
        if(travailleur){
             res.status(200).json({
                message:"mise a jour effectuer avec succes",
                status: 200,
                travailleur
             })
        }
    } catch (error) {
        console.error("Erreur lors de la mise a jour",error);
        res.status(500).send("Erreur serveur")
    }
    
}

module.exports.deleteTravailleur = async (req,res) =>{
    const travailleurId = req.params.id;
    if(!objectId.isValid(travailleurId)){
        res.status(400).send("Id invalide")
    }
    try {
        const travailleur = await travailleurModel.findByIdAndDelete({_id:travailleurId})
        if(!travailleur){
            res.status.send("travailleur non trouvé")
        }
        if(travailleur) res.status(200).json({
            message:"suppression effectuer avec succes"
        })
    } catch (error){
        res.status(500).send("erreur serveur")
    }
   

}