var express = require('express');
var router = express.Router();
var passport = require('passport');
const title = "SAG, Ambition & Distinction";


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login',function(req, res, next){
  console.log(req.user)
  res.render('Index/login', {title, layout: 'Index/layout.hbs'});
})

router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}));

router.post('/register', notLoggedIn, passport.authenticate('register', {
    successRedirect: '/users/login',
    failureRedirect: '/',
    failureFlash: true
}));

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
