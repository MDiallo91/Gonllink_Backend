const mongoose= require("mongoose")

const DBconnect= async ()=>{

    mongoose.set("strictQuery",false)
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongo connecter")
    } catch (error) {
        console.error("Erreur lors de la connection a Mongo",error)
        process.exit(1)
    }
    
}

module.exports = DBconnect