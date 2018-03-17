/**
 * Created by LeKemsty on 06/03/2018.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    titre: {type: String, required: true},
    type: {type: String},
    auteur_id: {type: String, required:true},
    auteur_nom: {type: String, required: true},
    nombre_vue: {type: Number, default: 0},
    nombre_comms: {type: Number, default: 0},
    commentaires: {type: Array, default: []},
    date_publication: {type: Date, default: Date.now},
    photo: {type: String, required: true},
    contenu: {type: String, required:true},
    tags:{type: [String]},
    special: {type: Boolean, default: false}
});

articleSchema.virtual('duree').get(function(){
    var distance = new Date().getTime() - this.date_publication.getTime();
    return Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + "h" + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
});


module.exports = mongoose.model('Articles', articleSchema);