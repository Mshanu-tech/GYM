const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const adminschema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
    },
    username:{
        type: String,
        require: true,
        unique: true
    },
    number: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    photo:{
        type:String
    }
})

adminschema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(this.password, salt)
        this.password = hashedpassword
        next()
    } catch (error) {
        next(error)
    }
})

var admins =  mongoose.model("admin", adminschema)
module.exports = { admins }