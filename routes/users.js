var express = require('express');
var router = express.Router();
var passport = require('passport');
const title = "SAG, Ambition & Distinction";
var flash = require('connect-flash');
var NewsLetter = require('../models/newsletter');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login',function(req, res, next){
    console.log(req.user);
    var message = req.flash('RegisterSuccessMessage');
    var message2 = req.flash('RegisterFailureMessage');
    var message3 = req.flash('LoginFailureMessage');
    var EnrollSuccessNewsletter = req.flash('EnrollSuccessNewsletter');
    var EnrollFailureNewsletter = req.flash('EnrollFailureNewsletter');
    res.render('Index/login', {title, layout: 'Index/layout.hbs', RegisterSuccessMessage: message, RegisterFailureMessage: message2.slice(0,1), LoginFailureMessage: message3.slice(0,1), EnrollFailureNewsletter: EnrollFailureNewsletter, EnrollSuccessNewsletter: EnrollSuccessNewsletter});
});

router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}));

router.post('/register',passport.authenticate('register', {
    successRedirect: '/users/login',
    failureRedirect: '/users/login',
    failureFlash: true
}));

router.post('/enroll_newsletter', function (req, res, next) {
    NewsLetter.findOne({'email': req.body.email}, function (err, newsletter) {
        if(newsletter){
            req.flash('EnrollFailureNewsletter', 'Vous êtes déjà enregistré a notre newsletter');
            res.redirect(req.body.href);
        }
        else{
            var newsletter = new NewsLetter({
                email: req.body.email
            });
            newsletter.save(function (err) {
                if(err)
                    throw err;
                req.flash('EnrollSuccessNewsletter', 'Bravo, Vous faites parti de notre newsletter!!');
                res.redirect(req.body.href);
            });
        }
    });
});

router.post('/post_commentaire', isLoggedIn, function (req, res, next) {

});

router.post('/post_reply', isLoggedIn, function (req, res, next) {

});

router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/');
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
}

module.exports = router;
