/**
 * Created by LeKemsty on 06/03/2018.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    local: {
        email: {type: String},
        password: {type: String},
        tel: {type: String},
        noms: {type: String},
        prenoms: {type: String},
        pseudo: String,
        pays: {type: String}
    },

    facebook_login: {
        id: String,
        token: String,
        name: String,
        email: String
    },

    twitter_login: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },

    google_login: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.virtual('FullName').get(function () {
    return this.local.noms + ' ' + this.local.prenoms;
});

module.exports = mongoose.model('User', userSchema);