const mongoose = require("mongoose")
const recipeschem = new mongoose.Schema({
    iteam: {
        type: String,
    },
    description:{
        type:String
    },
    photo:{
        type:String
    }
})

var recipes =  mongoose.model("recipe", recipeschem)
module.exports = { recipes }