const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const saltOrRounds = 10;
const jwt = require("jsonwebtoken");
// const flash = require('express-flash');
exports.showLoginBox = async (req, res) => {
  try {
    res.render("login.ejs");
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.showRegisterBox = async (req, res) => {
  try {
    res.render("register.ejs");
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.RegisterUser = async (req, res) => {
  try {
    console.log("req.body.user", req.body);
    let coverImagePath = "";
    let profileImagePath = "";
    const userImages = req.files || {};
    // console.log(userImages);
    let user = await User.findOne({ email: req.body.email, isDeleted: false });
    if (user){
      req.flash('info', `user is Already Eexist`);
      res.status(400)
      return res.redirect('/show-flash-message');
    }
    const hasPassword = bcrypt.hashSync(req.body.password, saltOrRounds);
    // Check and set paths for profile and cover images
    if (userImages["profileImage"] && userImages["profileImage"][0]) {
      profileImagePath = userImages["profileImage"][0].path.replace(/\\/g, "/");
    }
    if (userImages["coverImage"] && userImages["coverImage"][0]) {
      coverImagePath = userImages["coverImage"][0].path.replace(/\\/g, "/");
    }
    user = await User.create({
      ...req.body,
      password: hasPassword,
      profileImage: profileImagePath,
      coverImage: coverImagePath
    });
    res.status(201)
    return res.redirect('/api/user/login')
  } catch (error) {
    console.log("Error", error);
    // res.status(500).json({ message: "Internal Server Error" });
    req.flash('info', `Internal Server Error`);
    res.status(500)
    return res.redirect('/show-flash-message');
  }
};

exports.LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isDeleted: false });
    if (!user){
      // return res.status(404).json({ message: "Enter Valid Email Or Password" });
      req.flash('info', `Enter Valid Email Or Password`);
      return  res.redirect('/show-flash-message');
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      //  res.status(400).json({ message: "Enter Valid Email Or Password" });
      req.flash('info', 'Enter Valid Email Or Password');
      return  res.redirect('/show-flash-message')
    }
    
    const token = jwt.sign({ Id: user._id }, process.env.JWT_SECRET_KEY);
    // res.status(200).json({message : 'login is sussesFull',token});
    // res.cookie('authCookie',token,{maxAge:900000,httpOnly:true})
    res.cookie("uid", token);
    return res.redirect("/");
  } catch (error) {
    console.log("Error", error);
    // res.status(500).json({ message: "Internal Server Error" });
    req.flash('info', `Internal Server Error`);
    res.status(500)
    return res.redirect('/show-flash-message');
  }
};

exports.userLogOut  = async (req, res) => {
try {
  res.cookie('uid', '');
res.status(200)
return res.redirect('/api/user/login');
} catch (error) {
  console.log("Error", error);
  // res.status(500).json({ message: "Internal Server Error" });
  req.flash('info', `Internal Server Error`);
  res.status(500)
  return res.redirect('/show-flash-message');
}
};
