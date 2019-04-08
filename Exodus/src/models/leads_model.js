const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const LeadsSchema = new Schema({
    LeadOwner: {
        type: String,
        required: false
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    leadSource: {
        type: String,
        required: false
    },
    leadStatus: {
        type: String,
        required: false
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