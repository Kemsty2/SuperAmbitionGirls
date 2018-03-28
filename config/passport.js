/**
 * Created by LeKemsty on 07/03/2018.
 */
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var passport = require('passport');
var configAuth = require('./auth');

var User = require('../models/user');

passport.serializeUser(function(user, cb){
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb){
    User.findById(id, function(err, user){
        cb(err, user);
    });
});

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    User.findOne({'local.email': email}, function(err, user){
        if(err)
            return done(err);
        if(!user)
            return done(null, false, req.flash('LoginFailureMessage', 'Utilisateur Inexistant'));
        if(!user.validPassword(password))
            return done(null, false, req.flash('LoginFailureMessage', 'Mot de Passe Incorect'))


        req.flash('LoginSuccessMessage', 'Bienvenue Sur SAG , ' + user.local.prenoms + '!!');
        return done(null, user);
    });
}));

passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    User.findOne({'local.email': email}, function(err, user){
        if(err)
            return done(err);
        if(user){
            return done(null, false, req.flash('RegisterFailureMessage', 'Utilisateur Existant'))
        }
        else{
            var newUser = new User();
            newUser.local.email = email;
            newUser.local.password = newUser.encryptPassword(password);
            newUser.local.tel = req.body.tel;
            newUser.local.noms = req.body.noms;
            newUser.local.prenoms = req.body.prenoms;
            newUser.local.pseudo = req.body.pseudo;
            newUser.local.pays = req.body.pays;

            newUser.save(function(err){
                if(err)
                    throw err;
                req.flash('RegisterSuccessMessage', 'Vous avez été enregistré');
                return done(null, newUser)
            });
        }
    });
}));

/*TODO */
//FaceBook Authentification
passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'displayName', 'name', 'photos', 'email']
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({'facebook_login' : profile.id}, function (err, user) {
                if(err)
                    return done(err);
                if(user){
                    req.flash('LoginSuccessMessage', 'Bienvenue Sur SAG , ' + user.facebook_login.name + '!!');
                    return done(null, user);
                }
                else {
                    var newUser = new User();
                    newUser.facebook_login.id = profile.id;
                    newUser.facebook_login.token = accessToken;
                    newUser.facebook_login.name = profile.displayName;
                    newUser.facebook_login.email = profile.emails[0].value;

                    newUser.save(function(err){
                        if(err)
                            throw err;
                        req.flash('LoginSuccessMessage', 'Bienvenue Sur SAG , ' + newUser.facebook_login.name + '!!');
                        return done(null, newUser);
                    });
                }
            })
        })
    }));

//Twitter Authentification
passport.use(new TwitterStrategy({
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL: configAuth.twitterAuth.callbackURL
}, function (token, tokenSecret, profile, done) {
    process.nextTick(function () {
        User.findOne({'twitter_login' : profile.id}, function (err, user) {
            if(err)
                return done(err);
            if(user){
                req.flash('LoginSuccessMessage', 'Bienvenue Sur SAG , ' + user.twitter.name + '!!');
                return done(null, user);
            }
            else {
                var newUser = new User();
                newUser.twitter_login.id = profile.id;
                newUser.twitter_login.token = accessToken;
                newUser.twitter_login.username = profile.username;
                newUser.twitter_login.displayName = profile.displayName;

                newUser.save(function(err){
                    if(err)
                        throw err;
                    req.flash('LoginSuccessMessage', 'Bienvenue Sur SAG , ' + newUser.twitter_login.name + '!!');
                    return done(null, newUser);
                });
            }
        })
    })
}));

//Google Authentification

passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
}, function(token, refreshToken, profile, done){
    process.nextTick(function () {
        User.findOne({'google_login' : profile.id}, function (err, user) {
            if(err)
                return done(err);
            if(user){
                req.flash('LoginSuccessMessage', 'Bienvenue Sur SAG , ' + user.google_login.name + '!!');
                return done(null, user);
            }
            else {
                var newUser = new User();
                newUser.google_login.id = profile.id;
                newUser.google_login.token = accessToken;
                newUser.google_login.name = profile.displayName;
                newUser.google_login.email = profile.emails[0].value;

                newUser.save(function(err){
                    if(err)
                        throw err;
                    req.flash('LoginSuccessMessage', 'Bienvenue Sur SAG , ' + newUser.google_login.name + '!!');
                    return done(null, newUser);
                });
            }
        })
    })
}));














