const express = require('express');
const blogRoute = express.Router();

const { createBlog, updateBlog, deleteBlog ,showBlog} = require('../controller/blog.controller');
const { upload} = require('../helpers/uploadBlogImage');
// const {verifyToken}  = require('../helpers/verifyToken');
// api/blog continue....

const cpUpload = upload.fields([{ name: 'thumbnail', maxCount: 1 },{name : 'posterImage' , maxCount : 1} , {name : 'additionalImage', maxCount : 1}]);
blogRoute.post('/',cpUpload,createBlog);
blogRoute.post('/updateBlog',updateBlog);
blogRoute.post('/deleteBlog',deleteBlog);
blogRoute.get('/blogView/:id',showBlog)

module.exports = blogRoute;