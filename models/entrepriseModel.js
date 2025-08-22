const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const { isEmail } = require("validator");

const entrepriseSchema = new mongoose.Schema({
    
    user:{
        type: mongoose.Types.ObjectId,
        required:true,
        unique:true,
        ref:"user"
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
    
    role: {
        type: String,
        enum: ["admin", "client", "pro"]
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
    responsable:{
        prenom:{
            type:String,
            trim : true
        },
        nom:{
            type:String,
            trim : true
        }
    },
    
}, {
    timestamps: true
});

module.exports = mongoose.model("entreprise", entrepriseSchema);
