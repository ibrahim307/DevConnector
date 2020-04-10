const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");


//Load User model
const User = require("../../models/User");

//load Inpt Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");




//@route   POST routes/api/users/register
//@Desc    register User
//@acces   Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    //mongose
    if (user) {
      errors.email = "email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm" //default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});


//@route   Get routes/api/users/register
//@Desc     Login User / Returning jwt token
//@acces    public
router.post("/login", (req, res) => {
  const {errors,isValid}=validateLoginInput(req.body)

  // check validation
  if(!isValid){
    return res.status(400).json(errors)
  }
  const email = req.body.email;
  const password = req.body.password;
  //find user by email
  User.findOne({ email }).then(user => {
    //check for user
    if (!user) {
      errors.email="user email is not found"
      return res.status(404).json(errors);
    }
    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //user Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; //create jwt payload
        //Sign token
        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
          res.json({ succes: true, token: `Bearer ${token}` });
        });
      } else {
        errors.password="password incorrect"
        return res.status(400).json(errors);
      }
    });
  });
});

//@Get users   routes/api/users/current
//@desc        return current user
//@acces       private

router.get(
  "/current", passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({
      id:req.user.id,
      name:req.user.name,
      email:req.user.email

    })
  }

);


module.exports = router;
