const mongoose=require("mongoose")
const attendanceschema = new mongoose.Schema({
    status:[{
        name: String,
        isPresent: String
    }],
    date:{
        type:String
    }
})

module.exports=mongoose.model("attendance",attendanceschema)
