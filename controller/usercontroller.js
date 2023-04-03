const userschema = require("../Model/usermodel")
const { admins } = require("../Model/adminmodel")
const equipmentschema = require("../Model/equipment")
const { workout } = require("../Model/workout")
const payment = require("../Model/payment")
const bcrypt = require("bcrypt")
const multer = require("multer")
const { render } = require("ejs")
const Razorpay = require("razorpay")
const crypto = require("crypto")

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
           // email: req.body.email,
            number: req.body.number,
            password: req.body.password,
           // photo: req.file.filename,
            username: req.body.username
        })
        /// console.log(amount,"Payment successful")
        await usermodel.save().then(user => {
            console.log(user);
            var instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_API_SECRET })
            const options = {
                amount: 100,// amount in paise (1 INR = 100 paise)
                currency: 'INR',
                receipt: 'order_rcptid_11',
                payment_capture: 1,
            };
            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Error in creating order');
                } else {
                    res.render('user/payment', {
                        order_id: order.id,
                        key_id: process.env.RAZORPAY_API_KEY,
                        user_id: user.id,
                        user: user.name,
                        phone: user.number,
                        amount:options.amount
                    });
                }
            })
        })
    },

    verifypayment: async (req, res) => {
        const secret = process.env.RAZORPAY_API_SECRET; // Your Razorpay webhook secret
        const body = req.body.razorpay_order_id + '|' + req.body.razorpay_payment_id;
        const signature = req.body.razorpay_signature;
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(body.toString());
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature === signature) {
            // Payment is successful
            const now = new Date();
            const isoDateStr = now.toISOString();
            console.log(isoDateStr); // output: "2023-04-03T12:30:00.000Z"
            
            const userpaymentdetails = new payment({
                userId:req.body.userId,
                username:req.body.username,
                number:req.body.number,
                amount:req.body.amount,
                order_id:req.body.order_id,
                date:isoDateStr,
                day:req.body.day
            })
            await userpaymentdetails.save().then(paymentdetails=>{
                console.log(paymentdetails);
                res.redirect('/home');
            })
            
        } else {
            // Payment verification failed
            res.sent("payment failed")
        }
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
                    req.session.user = data
                    var equipment = await equipmentschema.find()
                    var admindata = await admins.find()
                    res.render("user/home", { equipment, admindata, user })
                }
            } else {
                res.redirect('/login')
            }
        }
        catch {
            res.redirect('/login')
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
            photo: req.file.filename,
            name: req.body.name,
            email: req.body.email,
            number: req.body.number,
            weight: req.body.weight,
            username: req.body.username
        }).then(user => {
            console.log(user)
            res.redirect("/home")
        })
    },

    getworkout: (req, res, next) => {
        let id = ('64154ecccc7e4791e22e3cec')
        workout.findById(id).then(time => {
            res.render("user/workout", { time })
        })
    },

    // payment:async (req,res)=>{
    //     let {amount} = req.body
    //     var instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_API_SECRET })
    //     var order = await instance.orders.create({
    //     amount: amount * 100,
    //     currency: "INR",
    //     receipt: "receipt#1",
    //     })
    //     res.status(201).json({
    //     success:true,
    //     order,
    //     amount
    //     }) 
    //     },



    pay: (req, res) => {
        var instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_API_SECRET })

        const options = {
            amount: 1000, // amount in paise (1 INR = 100 paise)
            currency: 'INR',
            receipt: 'order_rcptid_11',
            payment_capture: 1,
        };
        instance.orders.create(options, function (err, order) {
            if (err) {
                console.log(err);
                res.status(500).send('Error in creating order');
            } else {
                res.render('user/pay', {
                    order_id: order.id,
                    key_id: process.env.RAZORPAY_API_KEY,
                });
            }
        })
    },

    home: async (req, res) => {
        if (req.session.user) {
            var equipment = await equipmentschema.find()
            var admindata = await admins.find()
            res.render("user/home", { equipment, admindata })
        } else {
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
