const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const userschema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String
    },
    username:{
        type:String,
    },
    number: {
        type: Number
    },
    password: {
        type: String,
    },
    photo:{
        type:String
    },
    // streak:{
    //     type:Number
    // },
    weight:{
        type:String
    },
    payid:{
        type:String
    }

})

userschema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(this.password, salt)
        this.password = hashedpassword
        next()
    } catch (error) {
        next(error)
    }
})

module.exports = mongoose.model("user", userschema)