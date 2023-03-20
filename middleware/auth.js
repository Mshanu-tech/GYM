

const login = async(req,res,next)=>{
    try{
        if(req.session.userid){}
        else{
            res.redirect("/")
        }
        next()
    }catch(error){
        console.log(error);
    }
}

const logout = async(req,res,next)=>{
    try{
        if(req.session.userid){
            res.redirect("/home")
        }
        next()
    }catch(error){
        console.log(error);
    }
}

module.exports={
    login,
    logout
}