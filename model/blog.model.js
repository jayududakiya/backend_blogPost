const mongoose = require('mongoose');


const blogSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'users',
        required: true
    },
    title:{
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    blogImage:  {
        thumbnail : String ,
        posterImage : String,
        additionalImage: String
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
},{
    versionKey : false,
    timestamps : true
});

module.exports = mongoose.model('blogs',blogSchema);