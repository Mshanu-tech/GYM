const userschema = require("../Model/usermodel")
const { admins } = require("../Model/adminmodel")
const equipmentschema = require("../Model/equipment")
const { workout } = require("../Model/workout")
const payment = require("../Model/payment")
const Attendance = require("../Model/attendances")
const {recipes}= require("../Model/recipe")
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
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

// console.log(process.env.PASS);
console.log(mailTransporter.sendMail);

module.exports = {

    getindex: (req, res) => {
        res.render("user/index")
    },

    getsignup: (req, res) => {
        res.render("user/signup")
    },

    otpverification:(req,res)=>{
        res.render("user/otpverification")
    },

    equipment:async (req,res)=>{
        var equipment = await equipmentschema.find()
        res.render("user/equipments",{equipment})
    },

    postsignup: async (req,res) => {
    
        const { name, email, password, confirmPass, number } = req.body;
        if (!name || !email || !password || !confirmPass || !number) {
            return res.status(422).json({ error: 'plz fill the property' });
        }
        
        try {
            const userExist = await userschema.findOne({ email: email });
            // console.log(userschema.findOne({email: email}))
            if (userExist) {
                return res.status(422).json({ error: 'Email already exist' })
            } else if (password != confirmPass) {
                res.redirect('/signup')


            } else {
                var val = Math.floor(1000 + Math.random() * 9000);
                req.body.token = val
                req.session.signup = req.body

                mailTransporter.sendMail({
                    to: email,
                    from: process.env.EMAIL,
                    subject: 'Signup Verification',
                    html: `<h4>This your token for OTP Verfication </h4>:<h2>${val}</h2>`
                })
                res.redirect('/otpverification')
            }
            console.log(req.body);

        } catch (err) {
            console.log(err)
            res.redirect('/404error')
        }
    },
          
    otpverificatons: async (req, res) => {
        try {
            const { digit1, digit2, digit3, digit4 } = req.body
            const otp = digit1 + digit2 + digit3 + digit4
            const { name, email, password, confirmPass, token, number } = req.session.signup;

            if (token == otp) {
                const user = new userschema({ name, email, password, number })
                console.log(user);
                await user.save().then((doc) => {
                    req.session.logg = doc
                    res.render('user/payments', {
                        user_id: user.id,
                        username: user.name,
                        phone: user.number
                    });
                })
            } else {
                res.redirect('/otpverification')
                console.log('invalid otp');
            }
        } catch (error) {
            console.log(error);
            res.redirect('/error')
        }
    },

    error:(req,res)=>{
        res.render("user/error")
    },

    getlogin: (req, res) => {
        res.render("user/login")
    },
    
    postlogin: async (req, res) => {
        try {
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
                //console.log(days)
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
                        var admindata = await admins.find()
                        const attendance = await attendances.find()
                        const trues = "true"
                        var streak = 0

                        attendance.forEach(el => {
                            el.status.forEach(ele => {
                                if (user.name == ele.name) {
                                    if (ele.isPresent == trues) {
                                        streak += 1
                                    } else {
                                        streak *= 0
                                        
                                    }
                                }
                            });
                        });

                        res.render("user/home", { admindata, user, payment, streak })
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
        } catch (error) {
            res.redirect("/error")
        }
    },

    forgotpassword:(req,res)=>{
        res.render("user/forgotpassword")
    },
    postforgotpassword:async (req,res)=>{
       const email = req.body.email
      const reaset = await userschema.findOne({email:email})
      try {
       
      if(reaset){
        var val = Math.floor(1000 + Math.random() * 9000);
        req.body.id = reaset.id
        req.body.token = val
        req.session.forgot = req.body
        mailTransporter.sendMail({
            to:email,
            from:process.env.EMAIL,
            subject:'Reset Password',
            html:`<h4>This is your reset password OTP : <h2>${val}</h2></h4>`
        })
        console.log(reaset,val);
        res.redirect("/passwordotp")
      }else{
        res.redirect("/forgotpassword")
      }
       
    } catch (error) {
        res.redirect("/error")
    }
    },
    passwordotp:(req,res)=>{
        res.render("user/passwordotp")
    },

    passwordsotp:(req,res)=>{
        try {
            
        const { digit1, digit2, digit3, digit4 } = req.body
        const otp = digit1 + digit2 + digit3 + digit4
        const { token } = req.session.forgot;
        console.log("token",token,"otp",otp);
        if(token == otp) {
            res.redirect("/setpassword")
        }else{
            res.redirect("/passwordotp")
        }
    } catch (error) {
        console.log(error);
          res.redirect("/error")  
    }
    
    },

    setpassword:(req,res)=>{
        res.render("user/setpassword")
    },

    setpasswords:async (req,res)=>{
        try {
            const {id , token} = req.session.forgot
                console.log(id);
            const { password,confirm }=req.body

            if(password == confirm){

                const salt = await bcrypt.genSalt(10)
                const hashedpassword = await bcrypt.hash(password,salt)
               await userschema.findByIdAndUpdate(id,{
                    password:hashedpassword
                }).then(user=>{
                    console.log(user,"update your password");
                    res.redirect("/login")
                })

            }else{
                res.redirect("/setpassword")
            }
       
    } catch (error) {
        console.log(error);
           res.redirect("/error") 
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
        try {
       
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
             
    } catch (error) {
           res.redirect("/error") 
    }
    },

    getworkout: (req, res, next) => {
        let id = ('64154ecccc7e4791e22e3cec')
        workout.findById(id).then(time => {
            res.render("user/workout", { time })
        })
    },

    paypost: (req, res) => {
        
        try {
       
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
             
    } catch (error) {
          res.redirect("/error")  
    }
    },


    verifypayment: async (req, res) => {

        try {
       
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
                    const email = id.email
                    // mailTransporter.sendMail({
                    //     to:email,
                    //     from:process.env.EMAIL,
                    //     subject:'Payment Successful',
                    //     html:`<h4> Thanks For Pay The Money </h4> : <h2>${amount}</h2>`
                    // })
                })
                res.redirect('/home');
            })

        } else {
            // Payment verification failed
            res.sent("payment failed")
        }
             
    } catch (error) {
          res.redirect("/error")  
    }
    },

    Attendance: async (req, res) => {
        const username = req.params.name
        const attendance = await Attendance.find().sort({ date: -1 })
        var arr = []
        const trues = "true"

        try {
            
        attendance.forEach(el => {
            el.status.forEach(els => {
                const na = els.name
                if (els.name === username) {
                    if (els.isPresent == trues) {
                        var present = els.isPresent.replace("true", "present")
                    } else {
                        var absent = els.isPresent.replace("false", "Absent")
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
    } catch (error) {
        console.log(error);
            res.redirect("/error")
    }
    },


    home: async (req, res) => {
        if (req.session.user) {
            var payment = await Payment.find()
            var admindata = await admins.find()
            res.render("user/home", { admindata })
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
