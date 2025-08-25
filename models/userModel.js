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
        enum: ["admin", "client", "pro"]
    },
  
}, {
    timestamps: true
});

module.exports = mongoose.model("user", userSchema);
