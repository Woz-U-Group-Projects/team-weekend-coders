var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://school:school1@ds139775.mlab.com:39775/custinfo', ['custs']);

//Get All Custs
router.get('/custs', function(req, res, next){
    db.custs.find(function(err, custs){
        if(err){
            res.send(err);
        }
        res.json(custs);
    });
});

// Get Single Cust
router.get('/custs/:id', function(req, res, next){
    db.custs.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, cust){
        if(err){
            res.send(err);
        }
        res.json(cust);
    });
});

// Save Cust
router.post('/cust', function(req, res, next){
    var cust = req.body;
    if(!cust.title || (cust.isDone + '')){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        db.custs.save(cust, function(err, cust){
            if(err){
                res.send(err);
            }
            res.json(custs);  
        });
    }
});

//Delete Cust
router.delete('/custs/:id', function(req, res, next){
    db.custs.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, cust){
        if(err){
            res.send(err);
        }
        res.json(cust);
    });
});

// Update Cust
router.put('/custs/:id', function(req, res, next){
    var cust = req.body;
    var updCust = {};

    if(cust.isDone){
        updCust.isDone = cust.isDone;
    }

    if(cust.title){
        updCust.title = cust.title;
    }

    if(!updTask){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    } else {
        db.custs.update({_id: mongojs.ObjectId(req.params.id)}, updTask, {}, function(err, cust){
            if(err){
                res.send(err);
            }
            res.json(cust);
        });
    }
});

module.exports = router;