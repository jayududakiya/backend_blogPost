const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const ejs = require('ejs');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session');
const path = require('path');
// const helmet = require('helmet');
// const compression = require('compression');
const {verifyToken} = require('./helpers/verifyToken');
// Ensure necessary environment variables are present
if (!process.env.mongo_url || !process.env.PORT) {
    console.error('Error: Missing environment variables.');
    process.exit(1); // Exit the application
}

const User = require('./model/user.model');
const Blog = require('./model/blog.model');

// Connect to MongoDB
mongoose.connect(process.env.mongo_url)
    .then(() => console.log('Mongoose is connected successfully....'))
    .catch((error) => console.log('Database connection error:', error));

const app = express();



// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(cookieParser());


app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
// app.use(helmet());        // Security middleware
// app.use(compression());   // Compression middleware


// Routes
app.get('/show-flash-message', (req, res) => {
    const redirectUrl = req.headers.referer; 
    const dataUrl = redirectUrl.replace(/\/{1,2}/g, "_")
    const urlIndex = dataUrl.split("_").findIndex(key => key === 'api');
    const backUrl = dataUrl.split('_').splice(urlIndex).join('/');
    res.render('flashBox.ejs', { messages: req.flash('info') , backUrl });
});



app.get('/',verifyToken,async (req, res) => {
    try {
        const {user} = req;
        const logInUser = await User.findOne({_id : user._id , isDeleted : false});
        // console.log('logInUser',logInUser);
        const blogs = await Blog.find({isDeleted : false , author : logInUser._id});
        // console.log('Blog',blogs);
        res.render('index.ejs',{user:logInUser,blogs});
    } catch (error) {
        
    }
});

app.use('/asset/images/userImg/',express.static(path.join(__dirname,'asset/images/userImg')))
app.use('/asset/images/blogImg',express.static(path.join(__dirname,'asset/images/blogImg')))


const userRoute = require('./routes/user.routes');
const blogRoute = require('./routes/blog.routes');

app.use('/api/user',userRoute);
app.use('/api/blog',verifyToken,blogRoute);


// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Global error handler:', err.stack);
//     res.status(500).send('Something went wrong!');
// });

// Start server
app.listen(process.env.PORT, () =>
    console.log(`Server is running at http://localhost:${process.env.PORT}`)
);
