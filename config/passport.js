/**
 * Created by LeKemsty on 07/03/2018.
 */
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var passport = require('passport');
var configAuth = require('auth');

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
        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebook_login.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook_login.id    = profile.id; // set the users facebook id
                    newUser.facebook_login.token = token; // we will save the token that facebook provides to the user
                    newUser.facebook_login.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook_login.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        console.log(newUser);
                        return done(null, newUser);
                    });
                }
            });
        });

    }));

//Twitter Authentification
//Google Authentification
















