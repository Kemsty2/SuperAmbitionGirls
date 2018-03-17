/**
 * Created by LeKemsty on 06/03/2018.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pubSchema = new Schema({
    nom: String,
    entreprise: String,
    photo: String,
    afficher: Boolean
});

module.exports = mongoose.model('Publicité', pubSchema);