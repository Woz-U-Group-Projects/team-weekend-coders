'use strict';

module.exports = function(app){
    const leadEntries = require('./leads');    //defines all of the routes for the log entries and passes it back into our express app in line 5
    leadEntries(app);
}