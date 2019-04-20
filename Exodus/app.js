const express = require('express');
const app = express();
const port = process.env.PORT;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const hbs = require('hbs');
const Task = require('./models/tasks_model');
const path = require('path');
const chalk = require('chalk');

const publicDir = path.join(__dirname, '/public/');
//const partials = path.join(__dirname, '../views/partials');

const routes = require('./routes/leads');
const rIndex = require('./routes/routesIndex');

mongoose.Promise = global.Promise;
const server = 'ds015995.mlab.com:15995';
const database = 'exodus';
const user = 'exod';
const password = 'password1';

mongoose.connect(`mongodb://${user}:${password}@${server}/${database}`, { useNewUrlParser: true })
.then(()=> {
    console.log(chalk.green.underline("Connected to database successfully!"))
}).catch(() => {
    console.log(chalk.red.underline("Failed to connect to database!"));
});
mongoose.set('useFindAndModify', false);

 //CORS Code added by Greg
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 
    'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//app.set('view engine', 'hbs');  // Setting handlebars engine
app.use(express.static(publicDir));

//hbs.registerPartials(partials);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


routes(app);
rIndex(app);

//app.use((req, res, next) => {
//    res.setHeader('Access-Control-Allow-Origin', "*");          // defines which domains can access our server resources
//    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept")               // restricts req to domains with a certain set of headers besides default headers
//    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")       // controls which http verbs may be used to send requests
//    next();
//})




app.get('/', (req, res) => {
    res.render('index', {
        title: 'Exodus CRM'
    });
})





app.post('/tasks', (req, res, next) => {
    const task = new Task({
        title: req.body.title,
        content: req.body.content
    });
    console.log(task.createdAt);
    task.save().then(result => {
        res.status(201).json({
            message: 'Task saved successfully!',
            taskId: result._id
        });
    });
})


app.get('/tasks', (req, res, next) => {
    Task.find()
    .then(documents => {
        console.log(documents);
        //res.status(200).json({
        //    message: 'Tasks fetched successfully!',
        //    tasks: documents
        res.status(200).json(documents);
    });
});



app.delete('/tasks/:id', (req, res, next) => {
   Task.deleteOne({ _id: req.params.id }).then(result => {
       console.log(result);
       res.status(200).json({message: "Delete successful!"});
   })
});


app.put('/tasks/:id', (req, res, next) => {
    const task = new Task({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    })
    Task.updateOne({_id: req.params.id}, task).then(result => {
        console.log(result);
        res.status(200).json({message: "Updated!"});
    });
});

app.get('/tasks/:id', (req, res, next) => {
    Task.findById(req.params.id).then(task => {
        if (task) {
            res.status(200).json(task);
        } else {
            res.status(404).json({message: 'Task not found!'});
        }
    })
})


app.get('*', (req, res, next) => {
    res.render('404');
});



app.listen(`${port}`);
console.log(chalk.bgBlack.bold.green(`The server is running on port ${port}...`));


module.exports = app;





