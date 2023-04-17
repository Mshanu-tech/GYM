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
     setpasswords,
     passwordsotp,
     otpverification,
     error,
     passwordotp,
     setpassword,
     equipment
    //  recipe,
    //  addrecipe,
    //  postaddrecipe

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
router.post("/setpassword",setpasswords)
router.post("/passwordotp",passwordsotp)
router.get("/otpverification",otpverification)
router.get("/passwordotp",passwordotp)
router.get("/setpassword",setpassword)
router.get("/error",error)
router.get("/equipment",equipment)
// router.get("/recipe",recipe)
// router.get("/addrecipe",addrecipe)
// router.post("/postaddrecipe",postaddrecipe)

module.exports=router
