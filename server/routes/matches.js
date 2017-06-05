var express = require('express');
var admin = require("firebase-admin");
var router = express.Router();
var querybase = require('querybase');

// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("matches");


/* GET matches. */
router.get('/', function(req, res, next) {
    ref.once("value", function(snapshot) {
    //   console.log(snapshot.val());
      res.send(snapshot.val());
    }, function (errorObject) {
      res.send(errorObject);
      console.log("The read failed: " + errorObject.code);
    });
});

// GET match by id
router.get('/:uid', function(req, res, next) {
    if (req.params.uid) {
        ref.orderByKey().equalTo(req.params.uid).once("value", function(snapshot) {
            res.send(snapshot.val());
        }, function (errorObject) {
          res.send(errorObject);
          console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.send({ message: 'Failed to pass in a uid' });
    }
});

// GET hometeam matches by team id
router.get('/homeTeam/:uid', function (req, res, next) {
    if (req.params.uid) {
        ref.orderByChild("homeTeam").equalTo(req.params.uid).once("value", function(snapshot) {
            res.send(snapshot.val());
        }, function (errorObject) {
          res.send(errorObject);
          console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.send({ message: 'Failed to pass in a league uid' });
    }
});

// GET awayteam matches by team id
router.get('/awayTeam/:uid', function (req, res, next) {
    if (req.params.uid) {
        ref.orderByChild("awayTeam").equalTo(req.params.uid).once("value", function(snapshot) {
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
