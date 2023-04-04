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
        try {
            const user = await userschema.findOne({ email: req.body.email })
            if (user) {
                // res.status(422).json({ error: 'Email already exist' })
                res.redirect("/signup")
            } else {
                const usermodel = new userschema({
                    name: req.body.name,
                    email: req.body.email,
                    number: req.body.number,
                    password: req.body.password,
                    //photo: req.file.filename,
                    username: req.body.username,
                    day: req.body.day
                })
                /// console.log(amount,"Payment successful")
                await usermodel.save().then(user => {
                    console.log(user);
                    res.render('user/payments', {
                        user_id: user.id,
                        user: user.name,
                        phone: user.number
                    });
                })
            }
        } catch (error) {
            res.redirect("/signup")
        }

    },

    getlogin: (req, res) => {
        res.render("user/login")
    },
    postlogin: async (req, res) => {
        try {
            const user = await userschema.findOne({ email: req.body.email })
            if (user) {
                console.log(user);
                const id = await user.payid
                const payid = await payment.findById(id)
                console.log(pending, id, payid);
                if (payid) {
                    let data = await bcrypt.compare(req.body.password, user.password)
                    if (data) {
                        req.session.user = data
                        var equipment = await equipmentschema.find()
                        var admindata = await admins.find()
                        res.render("user/home", { equipment, admindata, user })

                    } else {
                        res.redirect('/login')
                        console.log("password not equal");
                    }
                } else {
                    res.render("user/payment")
                }
            }
        } catch {
            res.redirect('/signup')
        }
    },

    payment: async (req, res) => {
        const id = req.params.id
        const user = await userschema.findById(id)
        res.render("user/payments")
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

    paypost: (req, res) => {
        var instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_API_SECRET })
        const amount = req.body.amount
        const username = req.body.username
        const number = req.body.number
        const userid = req.body.userId
        const day = req.body.day
        const options = {
            amount: amount * 100,// amount in paise (1 INR = 100 paise)
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
                    user_id: userid,
                    user: username,
                    phone: number,
                    amount: options.amount,
                    day: day
                });
            }
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
            const amount = req.body.amount / 100
            const userpaymentdetails = new payment({
                userId: req.body.userId,
                username: req.body.username,
                number: req.body.number,
                amount: amount,
                order_id: req.body.order_id,
                date: isoDateStr,
                day: req.body.day
            })

            await userpaymentdetails.save().then(userpaymentdetails => {
                console.log(userpaymentdetails);
                const userid = userpaymentdetails.userId
                const paymentid = userpaymentdetails.id
                console.log(userid, paymentid, "dfhgjkdshgjghjhdsfgkjhgjshgk");
                userschema.findByIdAndUpdate(userid, {
                    payid: paymentid
                }).then(id => {
                    console.log(id);
                })
                res.redirect('/home');
            })

        } else {
            // Payment verification failed
            res.sent("payment failed")
        }
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
