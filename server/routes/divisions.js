var express = require('express');
var _ = require("lodash");
var admin = require("firebase-admin");
var router = express.Router();

// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("divisions");


/* GET divisions listing. */
router.get('/', function(req, res, next) {
    ref.once("value", function(snapshot) {
    //   console.log(snapshot.val());
      res.send(snapshot.val());
    }, function (errorObject) {
      res.send(errorObject);
      console.log("The read failed: " + errorObject.code);
    });
});

// get division by id
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

// get divisions by conference (by conference id)
router.get('/conference/:uid', function (req, res, next) {
    if (req.params.uid) {
        ref.orderByChild("conference").equalTo(req.params.uid).once("value", function(snapshot) {
            res.send(snapshot.val());
        }, function(errorObject) {
            res.send(errorObject);
            console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.send({ message: 'Failed to pass in a league uid' });
    }
});

module.exports = router;
