const userschema = require("../Model/usermodel")
const { admins } = require("../Model/adminmodel")
const equipmentschema = require("../Model/equipment")
const { workout } = require("../Model/workout")
const bcrypt = require("bcrypt")
const multer = require("multer")
const { render } = require("ejs")

module.exports = {
    getindex: (req, res) => {
        res.render("user/index")
    },

    getsignup: (req, res) => {
        res.render("user/signup")
    },

    postsignup: async (req, res) => {
        const usermodel = new userschema({
            name: req.body.name,
            email: req.body.email,
            number: req.body.number,
            password: req.body.password,
            photo: req.file.filename,
            username: req.body.username
        })
        await usermodel.save().then(user => {
            res.redirect("/login")
            console.log(user);
        })
    },

    getlogin: (req, res) => {
        res.render("user/login")
    },
    postlogin: async (req, res) => {
        try {
            const user = await userschema.findOne({ username: req.body.username })
            if (user) {
                console.log(user);
                let data = await bcrypt.compare(req.body.password, user.password)
                if (data) {
                    res.redirect('/home')
                }
            } else {
                res.render('user/login')
            }
        }
        catch {
            res.render('user/login')
        }
    },

    getuserprofile: (req, res) => {
        let id = req.params.id
        userschema.findById(id).then(user => {
            res.render("user/profile", { user })
        })
    },

    getupdate: (req, res) => {
        let id = req.params.id
        userschema.findById(id).then(user => {
            console.log(user);
            res.render("user/update", { user })
        })
    },

    postupdate: (req, res) => {
        let userid = req.params.id
        userschema.findByIdAndUpdate(userid, {
            // photo:req.file.filename,
            name: req.body.name,
            email: req.body.email,
            number: req.body.number,
            weight: req.body.weight
        }).then(user => {
            console.log(user)
            res.render("user/profile", { user })
        })
    },

    getworkout:(req, res) => {
        let id=('64154ecccc7e4791e22e3cec')
        workout.findById(id).then(time=>{
            console.log(time);
            res.render("user/workout",{time})
        })
    },

    home: async (req, res) => {
        var equipment = await equipmentschema.find()
         var admindata = await admins.find()
        res.render("user/home", { equipment , admindata})
    },
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/")
            }
        })
    }
}
