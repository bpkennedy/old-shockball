var admin = require("firebase-admin");
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();

// view engine setup


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/**
* Development Settings
*/
if (app.get('env') === 'development') {
    var serviceAccount = require("./swc-shockball-firebase.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://swc-shockball.firebaseio.com"
    });
    // This will change in production since we'll be using the dist folder
    app.use(express.static(path.join(__dirname, '../client')));
    // This covers serving up the index page
    app.use(express.static(path.join(__dirname, '../client/.tmp')));
    app.use(express.static(path.join(__dirname, '../client/app')));

    // Error Handling
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

/**
* Production Settings
*/
if (app.get('env') === 'production') {
    admin.initializeApp({
        credential: admin.credential.cert({
            "private_key": process.env.FIREBASE_PRIVATE_KEY,
            "client_email": process.env.FIREBASE_CLIENT_EMAIL,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    // changes it to use the optimized version for production
    app.use(express.static(path.join(__dirname, '/dist')));

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

var routes = require('./routes/index');
var users = require('./routes/users');
var teams = require('./routes/teams');
var players = require('./routes/players');
var leagues = require('./routes/leagues');
var contracts = require('./routes/contracts');
var matches = require('./routes/matches');
var events = require('./routes/events');
var divisions = require('./routes/divisions');
var conferences = require('./routes/conferences');


var engine = require('./engine.js');
var queue = require('./queue.js');
var mailer = require('./mailer.js');


app.use('/teams', teams);
app.use('/players', players);
app.use('/leagues', leagues);
app.use('/contracts', contracts);
app.use('/matches', matches);
app.use('/events', events);
app.use('/divisions', divisions);
app.use('/conferences', conferences);

module.exports = app;
