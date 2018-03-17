/**
 * Created by LeKemsty on 14/03/2018.
 */


var Admin = require('../models/admin');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/SAG');
mongoose.Promise = global.Promise;

var admin = new Admin({
    email: 'admin@admin.com',
    password: 'test',
    noms: 'Kemgne Moyo',
    prenoms: 'Steeve Aymard',
    tel: '698901563',
    poste: 'Redacteur',
    superAdmin: true
});

admin.password = admin.encryptPassword(admin.password);

admin.save(function(err){
    if(err){
        console.log('Erreur Lors de La création');
    }
    console.log(admin);
    exit();
});

function exit(){
    mongoose.disconnect();
}