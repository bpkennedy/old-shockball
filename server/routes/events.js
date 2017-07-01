var express = require('express');
var admin = require("firebase-admin");
var router = express.Router();
var queue = require('../queue.js');


// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("events");


/* GET events. */
router.get('/', function(req, res, next) {
    ref.once("value", function(snapshot) {
      res.status(200);
      res.send(snapshot.val());
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
      res.status(400);
      res.send(errorObject);
    });
});

// GET events by match id
router.get('/match/:uid', function(req, res, next) {
    if (req.params.uid) {
        ref.orderByChild("match").equalTo(req.params.uid).once("value", function(snapshot) {
            res.status(200);
            res.send(snapshot.val());
        }, function (errorObject) {
          res.status(400);
          res.send(errorObject);
          console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.status(400);
        res.send({ message: 'Failed to pass in a uid' });
    }
});

// GET primarySource events by actor
router.get('/actor/:uid', function (req, res, next) {
    if (req.params.uid) {
        ref.orderByChild("actor").equalTo(req.params.uid).once("value", function(snapshot) {
            res.status(200);
            res.send(snapshot.val());
        }, function (errorObject) {
          res.send(errorObject);
          res.status(400);
          console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.status(400);
        res.send({ message: 'Failed to pass in a league uid' });
    }
});

// GET primarySource events by oppActor
router.get('/oppActor/:uid', function (req, res, next) {
    if (req.params.uid) {
        ref.orderByChild("oppActor").equalTo(req.params.uid).once("value", function(snapshot) {
            res.status(200);
            res.send(snapshot.val());
        }, function (errorObject) {
          res.status(400);
          res.send(errorObject);
          console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.status(400);
        res.send({ message: 'Failed to pass in a league uid' });
    }
});

// GET primarySource events by secondaryOppActor
router.get('/secondaryOppActor/:uid', function (req, res, next) {
    if (req.params.uid) {
        ref.orderByChild("secondaryOppActor").equalTo(req.params.uid).once("value", function(snapshot) {
            res.status(200);
            res.send(snapshot.val());
        }, function (errorObject) {
          res.status(400);
          res.send(errorObject);
          console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.status(400);
        res.send({ message: 'Failed to pass in a league uid' });
    }
});

//POST new event
router.post('/new', function(req, res) {
    if (req.body && req.body.idToken) {
        queue.sendMessage(req.body).then(function(response) {
            res.status(200);
            res.send({ message: 'success' });
        });
    } else {
        res.status(400);
        res.send({ message: 'missing params or idToken' });
    }
});

module.exports = router;
