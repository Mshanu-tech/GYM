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
   posteditequipment
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

module.exports=router