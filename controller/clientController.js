const clientModal = require("../models/clientModal")
const objectId = require("mongoose").Types.ObjectId


module.exports.addClient = async (req, res) => {
  const { prenom,nom} = req.body;

  try {
    const client = await clientModal.create({
      nom, 
      prenom,

    });

    return res.status(201).json({message:"Ajout effectuer",statut:200, client });
  } catch (error) {
    console.error("Erreur lors de l'ajout du client", error);
    return res.status(500).send("Erreur serveur");
  }
};

module.exports.getClient = async (req, res) => {
  try {
    const client = await clientModal
      .find()
      .select("-password")        
         
        

    res.status(200).json(client);
  } catch (error) {
    console.log("Erreur lors de la récupération des client :", error);
    res.status(500).send("Erreur serveur");
  }
};


module.exports.clientInfo = async(req,res)=>{
    const clientId = req.params.id;
    if(!objectId.isValid(clientId)){
        return res.status(400).send("Id invalide")
    }
    try {
        const client = await clientModal.findById(clientId)
        .select("-password")

        if(!client) res.send("utilisateur non trouvé")
        if(client) res.status(200).json(client)
    } catch (error) {
        console.error("Erreur leur de la recuperation de client",error)
        res.status(500).send("Erreru serveur")
    }
}

module.exports.aupdateclient = async (req,res)=>{
    const clientId = req.params.id;
    if(!objectId.isValid(clientId)){
        res.status(400).send("Id invalide")
    }
    try {
        const client = await clientModal.findByIdAndUpdate(
            clientId,
            {$set:req.body},
            {new:true,runValidators:true}
        )
        if(!client){
            res.status(404).json({
                message:"client non trouvé",
                status: 404
            })
        }
        if(client){
             res.status(200).json({
                message:"mise a jour effectuer avec succes",
                status: 200,
                client
             })
        }
    } catch (error) {
        console.error("Erreur lors de la mise a jour",error);
        res.status(500).send("Erreur serveur")
    }
    
}

module.exports.deleteClient = async (req,res) =>{
    const clientId = req.params.id;
    if(!objectId.isValid(clientId)){
        res.status(400).send("Id invalide")
    }
    try {
        const travailleur = await clientModal.findByIdAndDelete({_id:clientId})
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