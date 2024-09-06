const Blog = require('../model/blog.model');
const User = require('../model/user.model');

exports.createBlog = async (req,res) => {
    try {
        // console.log('req.user',req.user);     
        // console.log('blog',req.body);
        // console.log('files',req.files);
        let thumbnailImagePath = "";
        let posterImagePath = "";
        let additionalImagePath = "";
        const postImage = req.files || {};
        let blog = await Blog.findOne({title : req.body.title , content:req.body.content });        
        if(blog) return res.status(400).json({message : 'This Blog Is Already Eexist'});
        if (postImage["thumbnail"] && postImage["thumbnail"][0]) {
            thumbnailImagePath = postImage["thumbnail"][0].path.replace(/\\/g, "/");
        };
        if (postImage["posterImage"] && postImage["posterImage"][0]) {
            posterImagePath = postImage["posterImage"][0].path.replace(/\\/g, "/");
        };
        if (postImage["additionalImage"] && postImage["additionalImage"][0]) {
            additionalImagePath = postImage["additionalImage"][0].path.replace(/\\/g, "/");
        };

        const postBlog = {...req.body,author : req.user._id , blogImage : {thumbnail : thumbnailImagePath , posterImage : posterImagePath ,additionalImage : additionalImagePath }};
        console.log('postBlog',postBlog);
        blog = await Blog.create(postBlog);
        // res.status(201).json({message : 'blog was Created....',blog});
        res.status(201)
        return res.redirect('/');
    } catch (error) {
        console.log('Error',error);
        res.status(500).json({message : 'Internal Server Error'});
    }
};


exports.showBlog = async (req,res) => {
    try {
        const {user} = req;
        const logInUser = await User.findOne({_id : user._id , isDeleted : false});
        // console.log('logInUser',logInUser);
        const blogs = await Blog.find({isDeleted : false , author : logInUser._id});
        return res.render('blogView.ejs',{user : logInUser , blogs })
    } catch (error) {
        
    }    
}

exports.updateBlog = async (req,res) => {
    try {
        console.log('blog',req.body);
        let blog = await Blog.findById(req.query.id);
        if(!blog) return res.status(404).json({message : 'This Blog Is Not Found'});
        blog = await Blog.findByIdAndUpdate(blog._id,{...req.body},{new:true});
        res.status(201).json({message : 'blog was updated....',blog});
    } catch (error) {
        console.log('Error',error);
        res.status(500).json({message : 'Internal Server Error'});
    }
}

exports.deleteBlog = async (req,res) => {
    try {
        console.log('blog',req.body);
        let blog = await Blog.findById(req.query.id);
        if(!blog) return res.status(404).json({message : 'This Blog Is Not Found'});
        blog = await Blog.findByIdAndUpdate(blog._id,{$set : {isDeleted:true}},{new:true});
        res.status(201).json({message : 'blog was Deleted....',blog});
    } catch (error) {
        console.log('Error',error);
        res.status(500).json({message : 'Internal Server Error'});
    }
}