const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const LeadsSchema = new Schema({
    LeadOwner: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    leadSource: {
        type: String,
        required: true
    },
    leadStatus: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    leadNotes: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Leads', LeadsSchema);          //the first parameter is what the name of the collection in mongo db will be