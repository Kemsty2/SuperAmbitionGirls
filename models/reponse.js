/**
 * Created by LeKemsty on 07/03/2018.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reponseSchema = new Schema({
    type: String,
    register: {
        user_id: String
    },
    non_register: {
        nom: String,
        prenom: String
    },
    contenu: String,
    date_publication: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Reponses', reponseSchema);