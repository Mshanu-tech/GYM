const { admins } = require("../Model/adminmodel")
const userschema = require("../Model/usermodel")
const equipment = require("../Model/equipment")
const { workout } = require("../Model/workout")
const attendance = require("../Model/attendances")
const multer = require("multer")
const bcrypt = require("bcrypt")
const equipmentschema = require("../Model/equipment")
const attendances = require("../Model/attendances")
const Payment = require("../Model/payment")
const nodemailer = require("nodemailer")

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mygym72@gmail.com',
        pass: 'jtjlzhbwscwyxszq'
    }
})

module.exports = {

    error:(req,res)=>{
        res.render("admin/error")
    },

    getlogin: (req, res) => {
        if (req.session.admin) {
            redirect('/admin/home')
        }
        else {
            res.render("admin/login")

        }

    },
    getsignup: (req, res) => {
        res.render("admin/adminsignup")
    },
    postsignup: async (req, res) => {

        try {
      
        const admin = new admins({
            name: req.body.name,
            email: req.body.email,
            number: req.body.number,
            password: req.body.password,
            username: req.body.username,
            photo: req.file.filename,
            confirm:req.body.confirmPass
        })
        await admin.save().then(admin => {
            res.redirect('/admin')
            console.log(admin);
        })
              
    } catch (error) {
            res.redirect("/admin/error")
    }
    },

    postlogin: async (req, res) => {
        try {
            const user = await admins.findOne({ username: req.body.username })
            if (user) {
                console.log(user);
                let data = await bcrypt.compare(req.body.password, user.password)
                if (data) {
                    req.session.user = data
                    res.redirect("/admin/home")
                }
            } else {
                res.send("wrong Password")
            }
        }
        catch {
            res.redirect("/admin/error")
        }
    },

    getequipment: (req, res) => {
        res.render("admin/addequipment")
    },
    postequipment: async (req, res) => {
        try {
       
        const equipments = new equipmentschema({
            name: req.body.name,
            photo: req.file.filename
        })
        await equipments.save().then(equipment => {
            console.log(equipment)
            res.redirect("/admin/home")
        })
             
    } catch (error) {
            res.redirect("/admin/error")
    }
    },
    removeequipment: async (req, res) => {
        const id = req.params.id
        const del = await equipmentschema.deleteOne({ _id: id })
        console.log(del, "deleted");
        res.redirect("/admin/home")
    },
    editequipment: (req, res) => {
        const id = req.params.id
        equipmentschema.findById(id).then(equip => {
            res.render("admin/equipment", { equip })
        })

    },
    posteditequipment: async (req, res) => {
        try {
    
        let id = req.params.id
        equipmentschema.findByIdAndUpdate(id, {
            name: req.body.name,
            photo: req.file.filename
        }).then(updateequip => {
            console.log(updateequip);
            res.redirect("/admin/home")
        })
                
    } catch (error) {
            res.redirect("/admin/error")
    }
    },
    workout: async (req, res) => {
        let id = ('64154ecccc7e4791e22e3cec')
        await workout.findById(id).then(time => {
            res.render("admin/workout", { time })
        })
    },
    workoutedit: (req, res) => {
        let id = ('64154ecccc7e4791e22e3cec')
        res.render("admin/workoutedit")
    },
    postworkout: (req, res) => {
        let id = ('64154ecccc7e4791e22e3cec')
        try {
      
        workout.findByIdAndUpdate(id, {
            date: req.body.date,
            powerlifting: req.body.powerlifting,
            bodybuilding: req.body.bodybuilding,
            cardioprogram: req.body.cardioprogram,
            weightloose: req.body.weightloose,
            fitnessprogram: req.body.fitnessprogram,
            crossfitclass: req.body.crossfitclass,
            musclebuilding: req.body.musclebuilding,
            yogaclass: req.body.yogaclass
        }).then(times => {
            console.log(times);
            res.redirect("/admin/workout")
        })
              
    } catch (error) {
           res.redirect("/admin/error") 
    }
    },
    remove: async (req, res) => {
        const id = req.params.id
        const del = await userschema.deleteOne({ _id: id })
        console.log(del, "deleted");
        res.redirect("/admin/home")
    },
    adminhome: async (req, res) => {
        try {
       
        if (req.session.user) {
            const admin = await admins.findById('643118041917040110bf0519')
            var userdata = await userschema.find()
            var equipment = await equipmentschema.find()
            const payment = await Payment.find().sort({ pendingday: 0 })
            const amounts = await Payment.find()
            const totaluser = await userdata.length
            const totalequipment = await equipmentschema.length
            const currentyear = new Date().getFullYear();
            const currentmonth = new Date().getMonth();
            let year = 0
            let month = 0
            var da =
                amounts.forEach(el => {
                    const date = new Date(el.date);
                    const isoString = date.toISOString();
                    const paymentYear = date.getFullYear();
                    const paymentmonth = date.getMonth();
                    if(paymentYear === currentyear){
                        year += el.amount
                    }
                    if(paymentmonth === currentmonth){
                        month += el.amount
                    }
                })
            console.log(year,month);
            res.render('admin/home', { userdata, equipment, totaluser, totalequipment, payment, year, month,admin })

        } else {
            res.redirect("/admin")
        }
             
    } catch (error) {
          res.redirect("/admin/error")  
    }

    },
    attendance: async (req, res) => {
        const user = await userschema.find()
        res.render('admin/attendances', { user })
    },
    postattendance: async (req, res) => {
        try {
     
        const obj = req.body
        console.log(obj);
        let arr = obj.name.map((element, index) => {
            return { name: element, isPresent: obj.status[index] === 'present' ? true : false }
        })
        

        const attendance = new attendances({
            date: req.body.date,
            status: arr,
        })
        console.log(arr)
        await attendance.save().then(atten => {
            console.log(atten);
            res.redirect("/admin/home")
        })
               
    } catch (error) {
        res.redirect("/admin/error")    
    }
    },
 
    attendancedetails: async (req, res) => {
         const details = await attendance.find()
        res.render("admin/attendancedetails", { details })
    },

    userdetails: async (req, res) => {
        const id = req.params.id
        userschema.findById(id).then(userdata => {
            console.log(userdata);
            res.render("admin/userdetails", { userdata })
        })
    },

    profile:async(req,res)=>{
        const id = ('643118041917040110bf0519')
        const admin = await admins.findById(id)
        console.log(admin);
        res.render("admin/profile",{admin})
    },

    logout: (req, res) => {
        try {
     
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/admin")
            }
        })
               
    } catch (error) {
         res.redirect("/admin/error")   
    }
    },

    forgotpassword:(req,res)=>{
        res.render("admin/forgotpassword")
    },
    passwordotp:(req,res)=>{
        res.render("admin/passwordotp")
    },

    postforgotpassword:async(req,res)=>{
        const email = req.body.email
      const reaset = await admins.findOne({email:email})
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
        res.redirect("/admin/passwordotp")
      }else{
        res.redirect("/admin/forgotpassword")
      }
       
    } catch (error) {
        res.redirect("/admin/error")
    }
    },

    setpassword:(req,res)=>{
        res.render("admin/setpassword")
    },

    otpverificaton:async (req,res)=>{
        try {
        
            const { digit1, digit2, digit3, digit4 } = req.body
            const otp = digit1 + digit2 + digit3 + digit4
            const { token } = req.session.forgot;
            console.log(token,otp ,req.session.forgot);

            if(token == otp) {
                res.redirect("/admin/setpassword")
            }else{
                res.redirect("/admin/passwordotp")
            }
        } catch (error) {
              res.redirect("/admin/error")  
        }
    },

    postsetpassword:async(req,res)=>{
        try {
            console.log(req.session.forgot);
            const {id , token} = req.session.forgot
                console.log(id);
            const { password,confirm }=req.body

            if(password == confirm){

                const salt = await bcrypt.genSalt(10)
                const hashedpassword = await bcrypt.hash(password,salt)
               await admins.findByIdAndUpdate(id,{
                    password:hashedpassword
                }).then(user=>{
                    console.log(user,"update your password");
                    res.redirect("/admin")
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
       
        let adminid = req.params.id
        userschema.findByIdAndUpdate(adminid, {
            photo: req.file.filename,
            name: req.body.name,
            email: req.body.email,
            number: req.body.number,
            weight: req.body.weight,
            username: req.body.username
        }).then(admin => {
            console.log(admin)
            res.redirect("/admin/home")
        })
             
    } catch (error) {
           res.redirect("/admin/error") 
    }
}
}