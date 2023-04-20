const express=require("express")
const router=express.Router();
const {
    getlogin,
    getsignup,
    postsignup,
    postlogin,
    adminhome,
    getequipment,
    postequipment,
    logout,
    workout,
   remove,
   workoutedit,
   postworkout,
   removeequipment,
   editequipment,
   posteditequipment,
   attendance,
   postattendance,
   attendancedetails,
   userdetails,
   profile,
   error,
   forgotpassword,
   postforgotpassword,
   passwordotp,
   otpverificaton,
   setpassword,
   postsetpassword,
   profileedit,
   updateprofile
}=require("../controller/admincontroller")

//Routing

router.get("/",getlogin)
router.get("/adminsignup",getsignup)
router.post("/signup",postsignup)
router.post("/home",postlogin)
router.get("/home",adminhome)
router.get("/equipment",getequipment)
router.post("/equipment",postequipment)
router.get("/workout",workout)
router.get("/logout",logout)
router.get("/delete/:id",remove)
router.get("/edit",workoutedit)
router.post("/postworkout",postworkout)
router.get("/removeequipment/:id",removeequipment)
router.get("/editequipment/:id",editequipment)
router.post("/editequipment/:id",posteditequipment)
router.get("/attendance",attendance)
router.post("/attendance",postattendance)
router.get("/attendancedetails",attendancedetails)
router.get("/userdetails/:id",userdetails)
router.get("/profile",profile)
router.get("/error",error)
router.get("/forgotpassword",forgotpassword)
router.post("/forgotpassword",postforgotpassword)
router.get("/passwordotp",passwordotp)
router.post("/verificaton",otpverificaton)
router.get('/setpassword',setpassword)
router.post("/setpassword",postsetpassword)
router.get("/profileedit/:id",profileedit)
router.post("/update/:id",updateprofile)

module.exports=router