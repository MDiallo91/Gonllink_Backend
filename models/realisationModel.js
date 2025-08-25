const mongoose = require("mongoose");

const realisationSchema = new mongoose.Schema({
    enchere:{
        type: mongoose.Types.ObjectId,
        required:true,
        ref:"enchere"
    },
    description:{
        type:String
    },
   
  
}, {
    timestamps: true
});

module.exports = mongoose.model("realisation", realisationSchema);
