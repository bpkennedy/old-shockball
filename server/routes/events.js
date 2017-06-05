var express = require('express');
var admin = require("firebase-admin");
var router = express.Router();
var querybase = require('querybase');

// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("events");


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

// GET primarySource events by playerId
router.get('/primarySource/:uid', function (req, res, next) {
    if (req.params.uid) {
        ref.orderByChild("primarySource").equalTo(req.params.uid).once("value", function(snapshot) {
            res.send(snapshot.val());
        }, function (errorObject) {
          res.send(errorObject);
          console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.send({ message: 'Failed to pass in a league uid' });
    }
});

// GET primarySource events by playerId
router.get('/secondarySource/:uid', function (req, res, next) {
    if (req.params.uid) {
        ref.orderByChild("secondarySource").equalTo(req.params.uid).once("value", function(snapshot) {
            res.send(snapshot.val());
        }, function (errorObject) {
          res.send(errorObject);
          console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.send({ message: 'Failed to pass in a league uid' });
    }
});

module.exports = router;
