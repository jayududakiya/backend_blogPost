const User = require('../model/user.model');
const jwt = require('jsonwebtoken');

exports.verifyToken = async (req,res,next) => {
    try {
        const uid = req.cookies.uid;
        // console.log('uid',uid);
        if(uid){
            const payload = await jwt.verify(uid,process.env.JWT_SECRET_KEY);
            // console.log('payload',payload);
            const verifyUser = await User.findOne({_id:payload.Id,isDeleted:false});
            // console.log('verifyUser0=0=0=0=0==0',verifyUser);
            // if(req.user)
            req.user = verifyUser;
            return next();        
        }else{
            return res.redirect('/api/user/login')
        }
    } catch (error) {
        console.log('Error==>',error);
        res.status(500).json({message : 'Server Error'})
    }
}