const mongoose=require("mongoose")
const equipment = new mongoose.Schema({
    name:{
        type:String,
    },
    photo:{
        type:String
    }
})

module.exports=mongoose.model("equipment",equipment)
