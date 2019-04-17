const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');


const TaskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

TaskSchema.plugin(timestamps);

module.exports = mongoose.model('Tasks', TaskSchema);