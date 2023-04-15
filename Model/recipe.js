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

var recipe =  mongoose.model("recipe", recipeschem)
module.exports = { recipe }