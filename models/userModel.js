const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
    prenom: {
        type: String,
    },
    nom:{
        type:String,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: [isEmail, "Email invalide"],
        minlength: 5,
        maxlength: 55,
        unique: true
    },
    password: {
        type: String,
        required: true
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
}, {
    timestamps: true
});

module.exports = mongoose.model("user", userSchema);
