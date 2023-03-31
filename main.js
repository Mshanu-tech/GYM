require("dotenv").config();
const express = require("express")
const layoutexpress = require("express-ejs-layouts")
const mongoose = require("mongoose");
const cors = require("cors")
const app = express();
const session = require("express-session")
const multer = require('multer');
const path = require("path")
const bodyparse = require("body-parser")
const auth = require("./middleware/auth")

//Database connection
mongoose.set('strictQuery', true)
const client = mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

//middleware
app.use(express.json());
app.use(bodyparse.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { maxAge: 60000 },
  resave: false 
}));
// app.use((req,res,next)=>{
//   res.locals.message = req.session.message
//   delete req.session.message
//   next();
// })

//image upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/upload');
  },
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+'_'+Date.now()+
    path.extname(file.originalname));
}
});

const fileFilter = function(req, file, cb) {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({ storage: storage, fileFilter: fileFilter }).single('photo'));

//view engine
app.set("view engine", "ejs")

//access css and js file in public
app.use(layoutexpress);
app.use(express.static('public'));
app.use(express.static('public/upload'));
app.set('layout', 'layouts/layout')


//router prefix
app.use("/", require("./Router/user"))
app.use("/admin", require("./Router/admin"))

const port = process.env.PORT || 4000

app.listen(port, () => { console.log(`server started ${port}`)})