const LeadEntry = require('../models/leads_model');             //going to need to load the mongoose model that is going to handle the logs, the schema


//controllers job is to accept incoming requests from a route & then do something with the data thats coming in, i.e CRUD



//Get All
exports.index = function(req, res) {
    LeadEntry.find({},  function(err, leadEntry){
        if(err) res.send(err)
        res.json(leadEntry);                //takes our entry from mongoDB and then into our mongoose model and then into our controller and print it out as json to the person who req it
    })
};

//Post
exports.create = function(req, res) {
    const newLeadEntry = new LeadEntry(req.body);

    newLeadEntry.save(function (err, leadEntry){        //saving to mongo db
        if(err) res.send(err)
        res.json(leadEntry);
    })
};

//Get by ID
exports.show = function (req, res) {                     // when you go to log-entries/id it will send you back the json for that one single log entry with the id 
    LeadEntry.findById(req.params.id, function (err, leadEntry){                //name of the variable in your route is what determines the key name on req.params
        if(err) res.send(err)
        res.json(leadEntry)
    })
};

//Put
exports.update = function (req, res) {
    LeadEntry.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, leadEntry) {
        if(err) res.send(err)
        res.json(leadEntry)
    })
};

//Delete
exports.destroy = function (req, res) {
    LeadEntry.deleteOne({_id: req.params.id}, function(err, leadEntry){
        if(err) res.send(err)
        res.json({message: `Lead (${req.params.id}) successfully deleted.`});
    })
}
