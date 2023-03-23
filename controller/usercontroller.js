const userschema = require("../Model/usermodel")
const { admins } = require("../Model/adminmodel")
const equipmentschema = require("../Model/equipment")
const { workout } = require("../Model/workout")
const bcrypt = require("bcrypt")
const multer = require("multer")
const { render } = require("ejs")
const Razorpay = require("razorpay")

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
            res.render("user/payment")
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
                    req.session.user=data
                //     var equipment = await equipmentschema.find()
                //  var admindata = await admins.find()
                   res.redirect("/home")
                    
                }
            } else {
                res.redirect('/login')
            }
        }
        catch {
            res.redirect('/user/login')
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
            res.render("user/workout",{time})
        })
    },
 
    payment:async (req,res)=>{
        let {amount} = req.body
        var instance = new Razorpay({ key_id: 'rzp_test_obFeIuhvv6VqPb', key_secret: 'XgVJjFXSsmNwCdnMOMK2bZPV' })

const order = await instance.orders.create({
  amount: amount * 100,
  currency: "INR",
  receipt: "receipt#1",
})
res.status(201).json({
    success:true,
    order,
    amount
})

    },
 
    
    home: async (req, res) => {
        if(req.session.user){
            var equipment = await equipmentschema.find()
         var admindata = await admins.find()
        res.render("user/home", { equipment , admindata})
        }else{
            res.redirect("/login")
        }
        
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
