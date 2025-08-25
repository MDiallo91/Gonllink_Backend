const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
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
    
}, {
    timestamps: true
});

module.exports = mongoose.model("client", clientSchema);
