const express=require("express")
const userschema = require("../Model/usermodel")
const router=express.Router();

const {
    getindex,
    getsignup,
    postsignup,
    getlogin,
    postlogin,
    logout,
     getuserprofile,
     getworkout,
     home,
     getupdate,
     postupdate,
     verifypayment,
     paypost,
     Attendance,
     otpverificatons,
     forgotpassword,
     postforgotpassword,
     setpassword,
     passwordotp,
     otpverification,
}=require("../controller/usercontroller")


router.get('/',getindex)
router.get("/signup",getsignup)
router.post("/postsignup",postsignup)
router.get("/login",getlogin)
router.post("/home",postlogin)
router.get("/logout",logout)
router.get("/profile/:id",getuserprofile)
router.get("/workout",getworkout)
router.get("/home",home)
router.get("/update/:id",getupdate)
router.post("/update/:id",postupdate)
router.post("/verifypayment",verifypayment)
router.post("/paypost",paypost)
router.get("/attendance/:name",Attendance)
router.post("/verificaton",otpverificatons)
router.get("/forgotpassword",forgotpassword)
router.post("/forgotpassword",postforgotpassword)
router.post("/setpassword",setpassword)
router.post("/passwordotp",passwordotp)
router.get("/otpverification",otpverification)

module.exports=router
