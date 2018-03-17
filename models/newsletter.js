/**
 * Created by LeKemsty on 06/03/2018.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newsletterSchema = new Schema({
    email: {type: String, required: true}
});

module.exports = mongoose.model('NewsLetter', newsletterSchema);
