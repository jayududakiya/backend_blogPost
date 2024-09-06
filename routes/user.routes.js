const express = require('express');
const userRoute = express.Router();

const {showLoginBox , showRegisterBox, LoginUser, RegisterUser, userLogOut  } = require('../controller/user.controller');
const {verifyToken} = require('../helpers/verifyToken');
const { upload } = require('../helpers/uploadImage');
// /api/user/
userRoute.get('/login',showLoginBox);
userRoute.get('/register',showRegisterBox);
userRoute.get('/logout',userLogOut);
const cpUpload = upload.fields([{ name: 'profileImage'}, { name: 'coverImage'}])
userRoute.post('/registerUser',cpUpload,RegisterUser);
userRoute.post('/loginUser',LoginUser);
module.exports = userRoute;