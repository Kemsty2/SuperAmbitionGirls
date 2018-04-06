var express = require('express');
var router = express.Router();
var passport = require('passport');
const title = "SAG, Ambition & Distinction";
var flash = require('connect-flash');
var NewsLetter = require('../models/newsletter');
var Commentaire = require('../models/commentaires');
var Article = require('../models/article');
var Reponse = require('../models/reponse');
var csurf = require('csurf');
var csrfProtection = csurf({cookie: true});

/*TODO
- Securiser mes routes
- Validations de mes forms
- Modifications de Chimène
 */



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', csrfProtection, function(req, res, next){
    Article.find({}).sort({'date_publication': -1}).limit(3).exec(function(err, recent_post){
        var message = req.flash('RegisterSuccessMessage');
        var message2 = req.flash('RegisterFailureMessage');
        var message3 = req.flash('LoginFailureMessage');
        var EnrollSuccessNewsletter = req.flash('EnrollSuccessNewsletter');
        var EnrollFailureNewsletter = req.flash('EnrollFailureNewsletter');
        res.render('Index/login', {title, layout: 'Index/layout.hbs', RegisterSuccessMessage: message, RegisterFailureMessage: message2.slice(0,1), LoginFailureMessage: message3.slice(0,1), EnrollFailureNewsletter: EnrollFailureNewsletter, EnrollSuccessNewsletter: EnrollSuccessNewsletter, csrfToken: req.csrfToken(), recent_post: recent_post, recent_post2:recent_post.slice(0,1)});
    });
});

router.post('/login', csrfProtection,  passport.authenticate('login', {
    successRedirect: 'back',
    failureRedirect: 'back',
    failureFlash: true
}));

router.post('/register', csrfProtection, passport.authenticate('register', {
    successRedirect: 'back',
    failureRedirect: 'back',
    failureFlash: true
}));

router.post('/enroll_newsletter', csrfProtection, function (req, res, next) {
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

router.post('/post_commentaire', csrfProtection,  function (req, res, next) {
    Article.findById(req.body.article_id, function (err, article) {
        var newComms = new Commentaire({
            article_id: req.body.article_id,
            contenu: req.body.message
        });
        newComms.user_email = !(isEmpty(req.body.email)) ? req.body.email : req.user.local.email;
        newComms.user_FullName = !(isEmpty(req.body.name)) ? req.body.name : req.user.FullName;
        newComms.save(function (err) {
            if(err)
                throw err;
            console.log(newComms);
        });
        article.nombre_comms += 1;
        article.save(function(err){
            if(err)
                throw err;
            res.redirect('/articles/lecture/'+req.body.article_id);
        });
    });

});

router.post('/post_reply',  function (req, res, next) {
    Article.findById(req.body.article_id, function(err, article){
        Commentaire.findById(req.body.comms_id, function (err, commentaire) {
            var new_reply = new Reponse({
                contenu: req.body.message
            });
            new_reply.user_email = !(isEmpty(req.body.email)) ? req.body.email : req.user.local.email;
            new_reply.user_FullName = !(isEmpty(req.body.name)) ? req.body.name : req.user.FullName;
            new_reply.save(function (err) {
                if(err)
                    throw err;
                commentaire.reponses.push(new_reply);
                commentaire.save(function (err) {
                    if(err)
                        throw err;
                });
                article.nombre_comms += 1;
                article.save(function(err){
                    if(err)
                        throw err;
                    res.redirect('/articles/lecture/'+req.body.article_id);
                });
            });
        });
    });
});

router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/');
});

router.get('/auth/facebook', passport.authorize('facebook', { scope : ['email'] }));

router.get('/auth/facebook', passport.authenticate('facebook', {
    scope : ['email']
}));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: 'back',
    failureRedirect: 'back',
    failureFlash: true
}));

router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: 'back',
    failureRedirect: 'back',
    failureFlash: true
}));

router.get('/auth/google', passport.authenticate('google', { scope : 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/plus.profile.emails.read https://www.googleapis.com/auth/userinfo.profile'}));
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: 'back',
    failureRedirect: 'back',
    failureFlash: true
}));

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

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

module.exports = router;
