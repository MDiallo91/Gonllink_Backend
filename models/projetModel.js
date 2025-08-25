const mongoose = require("mongoose");

const projetSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        required:true,
        ref:"user"
    },
    secteur:{
        type:mongoose.Types.ObjectId,
        require:true,
        ref:"secteur"
    },
    titre: {
        type: String,
    },
    description:{
        type:String,
    },
  
    localite: {
        type: String,
    },
    dateDebut:{
        type:String,
    
    },
    etat: {
        type: String,
        enum: ["attente", "anCours", "terminé"],
        trim: true,
        default:"attente"
    },
  
}, {
    timestamps: true
});

module.exports = mongoose.model("projet", projetSchema);
