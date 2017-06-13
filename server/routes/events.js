var express = require('express');
var admin = require("firebase-admin");
var router = express.Router();
var querybase = require('querybase');
const Joi = require('joi');


// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("events");

const eventSchema = Joi.object().keys({
    actor: Joi.string().alphanum().required(),
    oppActor: Joi.string().alphanum().allow(null),
    secondaryOppActor: Joi.string().alphanum().allow(null),
    type: Joi.string().alphanum().required(),
    match: Joi.string().alphanum().allow(null),
    team: Joi.string().alphanum().allow(null),
    oppTeam: Joi.string().alphanum().allow(null),
    time: Joi.date().required()
}).with('actor', 'type');


/* GET events. */
router.get('/', function(req, res, next) {
    ref.once("value", function(snapshot) {
    //   console.log(snapshot.val());
      res.send(snapshot.val());
    }, function (errorObject) {
      res.send(errorObject);
      console.log("The read failed: " + errorObject.code);
    });
});

// GET events by match id
router.get('/match/:uid', function(req, res, next) {
    if (req.params.uid) {
        ref.orderByChild("match").equalTo(req.params.uid).once("value", function(snapshot) {
            res.send(snapshot.val());
        }, function (errorObject) {
          res.send(errorObject);
          console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.send({ message: 'Failed to pass in a uid' });
    }
});

// GET primarySource events by actor
router.get('/actor/:uid', function (req, res, next) {
    if (req.params.uid) {
        ref.orderByChild("actor").equalTo(req.params.uid).once("value", function(snapshot) {
            res.send(snapshot.val());
        }, function (errorObject) {
          res.send(errorObject);
          console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.send({ message: 'Failed to pass in a league uid' });
    }
});

// GET primarySource events by oppActor
router.get('/oppActor/:uid', function (req, res, next) {
    if (req.params.uid) {
        ref.orderByChild("oppActor").equalTo(req.params.uid).once("value", function(snapshot) {
            res.send(snapshot.val());
        }, function (errorObject) {
          res.send(errorObject);
          console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.send({ message: 'Failed to pass in a league uid' });
    }
});

// GET primarySource events by secondaryOppActor
router.get('/secondaryOppActor/:uid', function (req, res, next) {
    if (req.params.uid) {
        ref.orderByChild("secondaryOppActor").equalTo(req.params.uid).once("value", function(snapshot) {
            res.send(snapshot.val());
        }, function (errorObject) {
          res.send(errorObject);
          console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.send({ message: 'Failed to pass in a league uid' });
    }
});

//POST new event
router.post('/test', function(req, res) {
    admin.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
        const result = Joi.validate(req.body, eventSchema);
        if (result.error === null) {
            ref.push().set(req.body, function (errorObject) {
                if (errorObject) {
                    res.send(errorObject);
                } else {
                    res.send({ message: 'success!' });
                }
            });
        } else {
            res.send({ message: 'invalid data format' });
        }
    }).catch(function(error) {
        res.send({ message: 'invalid idToken' });
    });
});

module.exports = router;
