/**
 * Created by LeKemsty on 07/03/2018.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reponseSchema = new Schema({
    user_FullName: String,
    contenu: String,
    date_publication: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Reponses', reponseSchema);