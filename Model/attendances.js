const mongoose=require("mongoose")
const attendanceschema = new mongoose.Schema({
    name:{
        type:Array,
    },
    status:{
        type:Array,
    },
    date:{
        type:String,
    }
})

module.exports=mongoose.model("attendance",attendanceschema)
