var express = require('express');
var _ = require("lodash");
var admin = require("firebase-admin");
var router = express.Router();

// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("teams");


/* GET teams listing. */
router.get('/', function(req, res, next) {
    ref.once("value", function(snapshot) {
    //   console.log(snapshot.val());
      res.send(snapshot.val());
    }, function (errorObject) {
      res.send(errorObject);
      console.log("The read failed: " + errorObject.code);
    });
});

// get team by id
router.get('/:uid', function(req, res, next) {
    if (req.params.uid) {
        ref.child(req.params.uid).once("value", function(snapshot) {
            res.send(snapshot.val());
        }, function (errorObject) {
          res.send(errorObject);
          console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.send({ message: 'Failed to pass in a uid' });
    }
});

// get all teams in a division (by division id)
router.get('/division/:uid', function (req, res, next) {
    if (req.params.uid) {
        ref.orderByChild("division").equalTo(req.params.uid).once("value", function(snapshot) {
            res.send(snapshot.val());
        }, function (errorObject) {
          res.send(errorObject);
          console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.send({ message: 'Failed to pass in a division uid' });
    }
});

//POST create new team
router.post('/new', function(req, res) {
    if (req.body && req.body.uid && req.body.idToken) {
        req.body.idToken = null;
        ref.push(req.body).then(function(snapshot) {
            ref.child(snapshot.key).update({ uid: snapshot.key });
            ref.child(snapshot.key).once("value", function(newTeamSnap) {
                res.status(200);
                res.send(newTeamSnap.val());
            });
        })
    } else {
        res.status(400);
        res.send({ message: 'missing params or idToken' });
    }
});

module.exports = router;
