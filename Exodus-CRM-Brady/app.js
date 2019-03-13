const express = require('express');
const bodyParseer = require('body-parser');

const contact = require('./routes/contact.route');
const app = express();

app.use('/contacts', contact);

var port = 8080;

app.listen(port, ()=> {
    console.log('Server is running on port ' + port);
})
;