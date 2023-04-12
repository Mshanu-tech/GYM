const userschema = require("../Model/usermodel")
const { admins } = require("../Model/adminmodel")
const equipmentschema = require("../Model/equipment")
const { workout } = require("../Model/workout")
const payment = require("../Model/payment")
const Attendance = require("../Model/attendances")
const bcrypt = require("bcrypt")
const multer = require("multer")
const nodemailer = require("nodemailer")
const { render, name } = require("ejs")
const Razorpay = require("razorpay")
const crypto = require("crypto")
const Payment = require("../Model/payment")
const attendances = require("../Model/attendances")


let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mygym72@gmail.com',
        pass: 'jtjlzhbwscwyxszq'
    }
})

module.exports = {

    getindex: (req, res) => {
        res.render("user/index")
    },

    getsignup: (req, res) => {
        res.render("user/signup")
    },

    postsignup: async (req, res) => {
        try {
            const useremail = await userschema.findOne({ email: req.body.email })
            const username = await userschema.findOne({ username: req.body.username })
            const email = req.body.email
            const val = Math.floor(1000 + Math.random() * 9000);
            console.log(val,email);
            await mailTransporter.sendMail({
                to: email,
                from: 'mygym72@gmail.com',
                subject: 'OTP',
                html: `<h4> Your OTP is </h4>:<h2>${val}</h2>`
            });
            if (useremail && username) {
                res.redirect("/signup")
            } else {
                const usermodel = new userschema({
                    name: req.body.name,
                    email: req.body.email,
                    number: req.body.number,
                    password: req.body.password,
                    //photo: req.file.filename,
                    username: req.body.username,

                })
                /// console.log(amount,"Payment successful")
                await usermodel.save().then(user => {
                    console.log(user);
                    res.render('user/payments', {
                        user_id: user.id,
                        username: user.name,
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
        // try {
        const payments = await Payment.find()
        payments.forEach(el => {
            var id = el._id
            const date = el.date
            const today = new Date()
            const storedDate = new Date(date);
            const diffMs = storedDate - today;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
            const days = el.day
            const num = parseInt(days)
            const day = num + diffDays
            Payment.findByIdAndUpdate(id, {
                pendingday: day
            }).then(days => {
                //console.log(days);
            })
        })
        const user = await userschema.findOne({ email: req.body.email })
        if (user) {
            //console.log(user);
            let data = await bcrypt.compare(req.body.password, user.password)
            if (data) {
                const id = user.payid
                console.log(id);
                const username = user.name
                const user_id = user.id
                const phone = user.number

                if (id) {
                    const paymentvalidation = await Payment.findById(id)
                    const pendingday = paymentvalidation.pendingday
                    console.log(pendingday, "pending day");

                    if (pendingday > 0) {
                        req.session.user = data
                        var payment = await Payment.findById(id)
                        var equipment = await equipmentschema.find()
                        var admindata = await admins.find()
                        const attendance = await attendances.find()
                        const trues = "true"
                        var streak = 0

                        attendance.forEach(el => {
                            el.status.forEach(ele => {
                                if (user.name == ele.name) {
                                    if (ele.isPresent == trues) {
                                        streak += 1
                                        // console.log(streak);
                                        // console.log("its");
                                        // console.log(ele.isPresent);
                                    } else {
                                        streak *= 0
                                        // console.log(streak);
                                        // console.log(ele.isPresent,"not");
                                    }
                                }
                            });
                        });

                        res.render("user/home", { equipment, admindata, user, payment, streak })
                    } else {
                        res.render('user/payments', { username, user_id, phone })
                        console.log("please pay");
                    }
                } else {
                    res.render('user/payments', { username, user_id, phone })
                    console.log("please pay");
                }
            } else {
                res.redirect("/login")
                console.log("password wrong");
            }

        } else {
            res.redirect("/login")
            console.log("email worng");
        }
        // } catch (error) {
        //     console.log(error);
        // }
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

    Attendance: async (req, res) => {
        const username = req.params.name
        const attendance = await Attendance.find().sort({date:-1})
        //console.log(attendance);
        var arr = []
        const trues = "true"
        attendance.forEach(el => {
            el.status.forEach(els => {
                const na = els.name
                if (els.name === username) {
                    if (els.isPresent == trues) {
                       var present =  els.isPresent.replace("true","present")
                    }else{
                        var absent =  els.isPresent.replace("false","Absent")
                    }
                    var obj = {
                        present: present || absent,
                        date: el.date
                    }

                    arr.push(obj);
                }
            });
        })
         console.log(arr);
        res.render("user/attendance", { arr });
    },


    home: async (req, res) => {
        if (req.session.user) {
            var payment = await Payment.find()
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
