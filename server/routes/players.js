var express = require('express');
var admin = require("firebase-admin");
var router = express.Router();
var mailer = require('../mailer.js');

// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("players");
var submitRef = db.ref("playerSubmit");

db.ref("playerSubmit").on("child_added", function(snapshot) {
    var newPlayerApplication = snapshot.val();
    newPlayerApplication.emailAddress = 'realgamer69@yahoo.com, swctholmeso@gmail.com, bhersey36@gmail.com';
    newPlayerApplication.emailSubject = 'Shockball player application';
    newPlayerApplication.userFirstName = newPlayerApplication.firstName;
    newPlayerApplication.userLastName = newPlayerApplication.lastName;
    if (!newPlayerApplication.sentEmail) {
        submitRef.child(newPlayerApplication.uid).update({ sentEmail: true });
        mailer.constructEmail(newPlayerApplication);
    }
}, function(error) {
    console.log('could not email for new player');
    console.log(error);
});


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
    if (req.body && req.body.uid && req.body.idToken) {
        submitRef.child(req.body.uid).set(req.body);
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

//POST approve and create new player
router.post('/new', function(req, res) {
    if (req.body && req.body.uid && req.body.idToken) {
        req.body.idToken = null;
        ref.child(req.body.uid).set(req.body);
        submitRef.child(req.body.uid).remove();
        ref.child(req.body.uid).once("value", function(snapshot) {
            res.status(200);
            res.send(snapshot.val());
        });
    } else {
        res.status(400);
        res.send({ message: 'missing params or idToken' });
    }
});

//POST reject player submission
router.post('/reject', function(req, res) {
    if (req.body && req.body.idToken) {
        submitRef.child(req.body.key).remove();
        res.status(200);
        res.send({ message: 'success' });
    } else {
        res.status(400);
        res.send({ message: 'missing params or idToken' });
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
