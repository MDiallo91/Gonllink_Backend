const userModel = require("../models/userModel")
const objectId = require("mongoose").Types.ObjectId


module.exports.getUsers = async (req, res) => {
  try {
    const users = await userModel
      .find()
      .select("-password")        
      .populate("secteur");       

    res.status(200).json(users);
  } catch (error) {
    console.log("Erreur lors de la récupération des users :", error);
    res.status(500).send("Erreur serveur");
  }
};


module.exports.userInfo = async(req,res)=>{
    const userId = req.params.id;
    if(!objectId.isValid(userId)){
        return res.status(400).send("Id invalide")
    }
    try {
        const user = await userModel.findById(userId).select("-password")
        if(!user) res.send("utilisateur non trouvé")
        if(user) res.status(200).json(user)
    } catch (error) {
        console.error("Erreur leur de la recuperation de user",error)
        res.status(500).send("Erreru serveur")
    }
}

module.exports.updateUser = async (req,res)=>{
    const userId = req.params.id;
    if(!objectId.isValid(userId)){
        res.status(400).send("Id invalide")
    }
    try {
        const user = await userModel.findByIdAndUpdate(
            userId,
            {$set:req.body},
            {new:true,runValidators:true}
        )
        if(!user){
            res.status(404).json({
                message:"user non trouvé",
                status: 404
            })
        }
        if(user){
             res.status(200).json({
                message:"mise a jour effectuer avec succes",
                status: 200,
                user
             })
        }
    } catch (error) {
        console.error("Erreur lors de la mise a jour",error);
        res.status(500).send("Erreur serveur")
    }
    
}

module.exports.deleteUser = async (req,res) =>{
    const userId = req.params.id;
    if(!objectId.isValid(userId)){
        res.status(400).send("Id invalide")
    }
    try {
        const user = await userModel.findByIdAndDelete({_id:userId})
        if(!user){
            res.status.send("User non trouvé")
        }
        if(user) res.status(200).json({
            message:"suppression effectuer avec succes"
        })
    } catch (error){
        res.status(500).send("erreur serveur")
    }
   

}