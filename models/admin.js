/**
 * Created by LeKemsty on 06/03/2018.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var adminSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    noms: String,
    prenoms: String,
    tel: {type: String},
    adresse: String,
    poste: String,
    age: Number,
    photo: String,
    superAdmin: Boolean,
    facebook_link: String,
    twitter_link: String,
    linkedin_link: String
});

adminSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

adminSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Administrateur', adminSchema);