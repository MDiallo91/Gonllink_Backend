const mongoose = require("mongoose");

const secteurSchema = new mongoose.Schema({
    nom:{
        type:String,
        required:true,
    },
    picture:{
        type:String,
         default: "/uploads/profil/random_user.png"
    }
},{
    timestamps:true,
})
module.exports = mongoose.model("secteur", secteurSchema);
