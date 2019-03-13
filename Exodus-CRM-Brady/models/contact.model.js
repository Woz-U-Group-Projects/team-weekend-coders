const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ContactSchema = new Schema({
    name: {type: String, required: true, max: 50},
});

module.exports = mongoose.model('Contact', ContactSchema);