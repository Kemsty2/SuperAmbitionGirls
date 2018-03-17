/**
 * Created by LeKemsty on 07/03/2018.
 */
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var passport = require('passport');

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
            return done(null, false, req.flash('LoginMessage', 'Utilisateur Inexistant'));
        if(!client.validPassword(password))
            return done(null, false, req.flash('LoginMessage', 'Mot de Passe Incorect'))

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
            return done(null, false, req.flash('RegisterMessage', 'Utilisateur Existant'))
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
                req.flash('RegisterMessage', 'Vous avez été enregistré');
                return done(null, newUser)
            });
        }
    });
}));

/*TODO */
//FaceBook Authentification
//Twitter Authentification
//Google Authentification
















