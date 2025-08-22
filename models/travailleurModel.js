const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const travailleurSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        require:true,
        unique:true
    },
    prenom: {
        type: String,
    },
    nom:{
        type:String,
    },
  
    telephone:{
        type:String,
    },
     secteur:{
        type:mongoose.Types.ObjectId,
        ref:"secteur"
    },
     ville:{
        type:String,
        trim:true,
    },
    zoneIntervention:{
        type:String,
        trim:true,
    },
    statut:{
        type:String,
        enum:["fremium","premium"]
    },
    
    
    bio: {
        type: String,
        maxlength: 700,
    },
    profil: {
        type: String,
        default: "/uploads/profil/random_user.png"
    },
    adresse: {
        type: String,
      
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("travailleur", travailleurSchema);
