const express = require("express");
const mongoose = require("mongoose");
const bodyParser=require("body-parser")
const passport=require('passport')



//routes
const users=require("./routes/api/users")
const posts=require("./routes/api/posts")
const profile=require("./routes/api/profile")
const adminbro=require('./routes/api/admin-bro')

const app = express();

//body-parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//db config
const db = require("./config/keys").mongoURI;

//connect to mongodb
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


  //use Routes
app.use('/routes/api/users',users);
app.use('/routes/api/posts',posts);
app.use('/routes/api/profile',profile);
app.use('/admin',adminbro);




//passportmiddleware
app.use(passport.initialize())

//passport config
require('./config/passport')(passport)


//run server
app.listen(7000, err =>
  !err ? console.log("server is running on port 7000") : console.log("error")
);







