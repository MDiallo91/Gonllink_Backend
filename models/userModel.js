const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
   
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
    role: {
        type: String,
        enum: ["admin", "client", "independant", "entreprise"],
        default:"independant"
    },
     profile: { 
        type: mongoose.Schema.Types.ObjectId,
         refPath: "roleRef" 
    },
    roleRef: {
    type: String,
    required: true,
    enum: ["client","travailleur","entreprise", "admin"]
    },
     photo: {
        type: String,
        default: "/upload/profil/random_user.png"
    },
    isVerified:       { type: Boolean, default: false }, // email confirmé par code
    verificationCode: { type: String },
    isActive:         { type: Boolean, default: false }, // activé par l'admin (sauf client : true dès la création)
}, {
    timestamps: true
});

module.exports = mongoose.model("user", userSchema);
