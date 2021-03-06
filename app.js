// "C:\Program Files\MongoDB\Server\4.4\bin\mongo.exe"

//////////////////chaeck use of async and await used in update of profile
//////////delet se phle confirm krne ka

//for keeping the cloud api secret
//https://www.npmjs.com/package/dotenv

require('dotenv').config();
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
var passport   = require("passport");
const session = require('express-session');
const cookieParser = require('cookie-parser');
var LocalStrategy= require("passport-local");
var path= require("path");
var passportLocalMongoose = require('passport-local-mongoose'); 
var methodOverride = require("method-override");
var flash = require('connect-flash');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

var Company = require("./models/company");
var Seeker = require("./models/seeker");
var Job = require("./models/job");
var User = require("./models/user");
var Posts =require("./models/posts");
var FeedBack =require("./models/feedback");
var Quiz = require("./models/quiz");
var Question = require("./models/question");
// var Quiz2 = require("./models/quiz1");
// var Quiz3 = require("./models/quiz1");
var Submission = require("./models/submission");
// var Submission2 = require("./models/submission");
// var Submission3 = require("./models/submission");


var middleware = require("./middleware/index.js");

var Companyroutes = require("./routes/company");
var Seekerroutes = require("./routes/seeker");
var Jobroutes = require("./routes/job");
var Postsroutes = require("./routes/posts");
var Indexroutes = require("./routes/index");
var quizroutes = require("./routes/quiz");
var adminroutes = require("./routes/admin");
var job_part2 = require("./routes/job_part2");
var pass_reset = require("./routes/pass_reset");
var profile = require("./routes/profile");
var project = require("./routes/project");
var imagesroute = require("./routes/images");



mongoose.connect("mongodb://localhost:27017/"+process.env.DATABASE_NAME, { useNewUrlParser: true ,useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname+"/public")));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment= require("moment");

app.use(cookieParser('secret'));
// ////////passport-authenticate
app.use(session({
     secret: 'secret',
     maxAge:3600000,
     resave: true,
     saveUninitialized: true,
    //  resave :false,
    //  saveUninitialized: false	
 }));
//  const checkAuthenticated = function (req, res, next) {
//     if (req.isAuthenticated()) {
//         res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
//         return next();
//     } else {
//         res.redirect('/');
//     }
//  }

 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
        //------------ User Matching ------------//
        User.findOne({
            username: username
        }).then(user => {
            if (!user) {
                return done(null, false, { message: 'This email ID is not registered' });
            }

            //------------ Password Matching ------------//
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect! Please try again.' });
                }
            });
        });
        })); 
passport.serializeUser(function (user, done) {
        done(null, user.id);
        });

 passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
 //so that current user data is avialable to every route
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(Indexroutes);
app.use(Companyroutes);
app.use(Seekerroutes);
app.use(Jobroutes);
app.use(Postsroutes);
app.use(quizroutes);
app.use(adminroutes);
app.use(job_part2);
app.use(pass_reset);
app.use(profile);
app.use(imagesroute);
app.use(project);

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server has started");
});