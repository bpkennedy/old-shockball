var express = require('express');
var admin = require("firebase-admin");
var router = express.Router();

// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("players");
var submitRef = db.ref("playerSubmit");


/* GET players listing. */
router.get('/', function(req, res, next) {
    ref.once("value", function(snapshot) {
    //   console.log(snapshot.val());
      res.send(snapshot.val());
    }, function (errorObject) {
      res.send(errorObject);
      console.log("The read failed: " + errorObject.code);
    });
});

router.get('/submit', function(req, res, next) {
    submitRef.once("value", function(snapshot) {
    //   console.log(snapshot.val());
      res.send(snapshot.val());
    }, function (errorObject) {
      res.send(errorObject);
      console.log("The read failed: " + errorObject.code);
    });
})

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

//POST new player submission
router.post('/submit', function(req, res) {
    if (req.body && req.body.idToken) {
        submitRef.push().set(req.body);
        res.status(200);
        res.send({ message: 'success' });
    } else {
        res.status(400);
        res.send({ message: 'missing params or idToken' });
    }
});

router.get('/submit/:uid', function(req, res, next) {
    if (req.params.uid) {
        submitRef.orderByChild("uid").equalTo(req.params.uid).once("value", function(snapshot) {
            res.send(snapshot.val());
        }, function (errorObject) {
          res.send(errorObject);
          console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.send({ message: 'Failed to pass in a uid' });
    }
});

router.get('/team/:uid', function (req, res, next) {
    if (req.params.uid) {
        ref.orderByChild("team").equalTo(req.params.uid).once("value", function(snapshot) {
            res.send(snapshot.val());
        }, function (errorObject) {
          res.send(errorObject);
          console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.send({ message: 'Failed to pass in a team uid' });
    }
});

module.exports = router;
