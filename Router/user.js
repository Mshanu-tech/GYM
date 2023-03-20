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
module.exports=router
