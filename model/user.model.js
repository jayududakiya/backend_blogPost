const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    isDeleted : {
        type : Boolean,
        default : false
    },
    firstName : {
        type : String,
        required: true,
    },
    lastName : {
        type : String,
        required: true,
    },
    email :{
        type : String,
        unique : true,
        required: true,
    },
    password :{
        type : String,
        required: true,
    },
    profileImage : {
        type : String,
    },
    coverImage : {
        type : String,
    }
},{
    versionKey : false,
    timestamps: true
});

module.exports = mongoose.model('users',userSchema);