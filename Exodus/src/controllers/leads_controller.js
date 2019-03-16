
const LeadEntry = require('../models/leads_model');

//Get All
exports.index = function(req, res) {
    LeadEntry.find({},  function(err, leadEntry){
        if(err) res.send(err)
        res.json(leadEntry);
    })
};

//Post
exports.create = function(req, res) {
    const newLeadEntry = new LeadEntry(req.body);

    newLeadEntry.save(function (err, leadEntry){
        if(err) res.send(err)
        res.json(leadEntry);
    })
};

//Get by ID
exports.show = function (req, res) {
    LeadEntry.findById(req.params.id, function (err, leadEntry){
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

//🦄