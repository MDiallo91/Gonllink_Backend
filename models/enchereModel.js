const mongoose = require("mongoose");

const enchereSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        required:true,
        ref:"user"
    },
    projet:{
        type:mongoose.Types.ObjectId,
        require:true,
        ref:"projet"
    },
   description:{
    type:String,
    
   }
  
}, {
    timestamps: true
});

module.exports = mongoose.model("enchere", enchereSchema);
