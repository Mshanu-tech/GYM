const { admins } = require("../Model/adminmodel")
const userschema = require("../Model/usermodel")
const equipment = require("../Model/equipment")
const { workout } = require("../Model/workout")
const attendance = require("../Model/attendances")
const multer = require("multer")
const bcrypt = require("bcrypt")
const equipmentschema = require("../Model/equipment")
const attendances = require("../Model/attendances")
module.exports = {
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
        const admin = new admins({
            name: req.body.name,
            email: req.body.email,
            number: req.body.number,
            password: req.body.password,
            username: req.body.usernam
        })
        await admin.save().then(admin => {
            res.redirect('/admin')
            console.log(admin);
        })
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
            res.send("details")
        }
    },

    getequipment: (req, res) => {
        res.render("admin/addequipment")
    },
    postequipment: async (req, res) => {
        const equipments = new equipmentschema({
            name: req.body.name,
            photo: req.file.filename
        })
        await equipments.save().then(equipment => {
            console.log(equipment)
            res.redirect("/admin/home")
        })
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
        let id = req.params.id
        equipmentschema.findByIdAndUpdate(id, {
            name: req.body.name,
            photo: req.file.filename
        }).then(updateequip => {
            console.log(updateequip);
            res.redirect("/admin/home")
        })
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
    },
    remove: async (req, res) => {
        const id = req.params.id
        const del = await userschema.deleteOne({ _id: id })
        console.log(del, "deleted");
        res.redirect("/admin/home")
    },
    adminhome: async (req, res) => {
        if (req.session.user) {
            var userdata = await userschema.find()
            var equipment = await equipmentschema.find()
            const totaluser = await userdata.length
            const totalequipment = await equipmentschema.length
            console.log(totaluser);
            res.render('admin/home', { userdata, equipment, totaluser, totalequipment })
        } else {
            res.redirect("/admin")
        }

    },
    attendance: async (req, res) => {
        const user = await userschema.find()
        res.render('admin/attendances', { user })
    },
    postattendance: async (req, res) => {
        const obj = req.body
        console.log(obj);
        let arr = obj.name.map((element, index) => {
            return {name: element, isPresent: obj.status[index] === 'present' ? true : false}
          })
          
          
        const attendance = new attendances({
            date:req.body.date,
            status:arr,
            // name: req.body.name,
            // status: {status}
        })
        console.log(arr)
        await attendance.save().then(atten => {
            console.log(atten);
            res.redirect("/admin/home")
        }) 
    },

    attendancedetails: async (req, res) => {
        const details = await attendance.find()
        res.render("admin/attendancedetails", { details })
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/")
            }
        })
    },
}