/**
 * Created by LeKemsty on 06/03/2018.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commsSchema = new Schema({
    article_id: String,
    user_FullName: String,
    reponses: [],
    contenu: String,
    date_publication: {type: Date, default: Date.now}
});


module.exports = mongoose.model('Commentaires', commsSchema);