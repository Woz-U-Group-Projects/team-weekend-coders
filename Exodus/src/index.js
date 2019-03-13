const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes/leads');
const rIndex = require('./routes/routesIndex');

mongoose.Promise = global.Promise;
const server = 'ds015995.mlab.com:15995';
const database = 'exodus';
const user = 'exod';
const password = 'password1';

mongoose.connect(`mongodb://${user}:${password}@${server}/${database}`, { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

routes(app);
rIndex(app);

app.listen(`${port}`);
console.log(`The server is running on port ${port}...`);







