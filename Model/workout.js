const mongoose=require("mongoose")
const workoutschema = new mongoose.Schema({
    date:{
        type:String,
    },
    powerlifting:{
        type:String,
    },
    bodybuilding:{
        type:String,
    },
    cardioprogram:{
        type:String,
    },
    weightloose:{
        type:String,
    },
    fitnessprogram:{
        type:String,
    },
    crossfitclass:{
        type:String,
    },
    musclebuilding:{
        type:String,
    },
    yogaclass:{
        type:String,
    },
})
var workout = mongoose.model("workout",workoutschema)

module.exports = { workout }
