var admin = require("firebase-admin");
var Queue = require('firebase-queue');
var engine = require('./engine.js');

var _ = require("lodash");

var db = admin.database();
var dbRoot = db.ref('queue');
var queueRef = db.ref('queue/tasks');
var eventsRef = db.ref('events');

// data schema for queue message
var Joi = require('joi');
var teams = [];
var players = [];

var eventSchema = Joi.object().keys({
    actor: Joi.string().required(),
    oppActor: Joi.string().allow(null),
    secondaryOppActor: Joi.string().allow(null),
    type: Joi.string().required(),
    intensity: Joi.string().allow(null),
    match: Joi.string().allow(null),
    team: Joi.string().allow(null),
    oppTeam: Joi.string().allow(null),
    time: Joi.date().required(),
    //contract fields
    endDate: Joi.date().allow(null),
    startDate: Joi.date().allow(null),
    goalBonus1: Joi.string().allow(null),
    goalBonus2: Joi.string().allow(null),
    goalBonus3: Joi.string().allow(null),
    offerTeam: Joi.string().allow(null),
    signingPlayer: Joi.string().allow(null),
    salary: Joi.string().allow(null),
    status: Joi.string().allow(null),
    teamLockIn: Joi.boolean().allow(null),
    playerLockIn: Joi.boolean().allow(null),
    contractUid: Joi.string().allow(null),
    //captain field
    captainUid: Joi.string().allow(null)
}).with('actor', 'type');

var options = {
  'suppressStack': false
};

//create the queue
var queue = new Queue(dbRoot, options, function(data, progress, resolve, reject) {
    admin.auth().verifyIdToken(data.idToken).then(function(decodedToken) {
        if (decodedToken.uid.toString().toLowerCase() === data.actor.toString().toLowerCase() || decodedToken.email.toString().toLowerCase() === 'bpkennedy@gmail.com' || decodedToken.email.toString().toLowerCase() === 'realgamer69@yahoo.com' || decodedToken.email.toString().toLowerCase() === 'bhersey36@gmail.com') {
            delete data.idToken;
            const result = Joi.validate(data, eventSchema);
            if (result.error === null) {
                populateEvent(data).then(function(response) {
                    var populatedData = response;
                    engine.processEvent(populatedData);
                    resolve(populatedData);
                }).catch(function(error) {
                    console.log(error);
                    reject(error);
                });

            } else {
                console.log(result.error);
                reject({ message: 'invalid data format', data: data, idToken: data.idToken });
            }
        } else {
            reject({ message: 'they see me rollin, they hatin.', data: data, idToken: data.idToken });
        }
    }).catch(function(error) {
        reject({ message: 'invalid idToken', data: data, idToken: data.idToken });
    });
});

function listenToCollections() {
    db.ref('teams').on('value', function(snapshot) {
        teams = snapshot.val();
        db.ref('players').on('value', function(snapshot) {
            players = snapshot.val();
        }, function(error) {
            console.log(error);
        });
    }, function(error) {
        console.log(error);
    });
}

function populateEvent(data) {
    return new Promise(function(resolve, reject) {
        var populatedData = data;
        _.map(data, function(eventProp, index) {
            if (index === 'actor') {
                populatedData.actorFirstName = players[eventProp]['firstName'];
                populatedData.actorLastName = players[eventProp]['lastName'];
                populatedData.actorPicUrl = players[eventProp]['picUrl'];
                return;
            }
            if (index === 'oppActor') {
                populatedData.oppActorFirstName = players[eventProp]['firstName'];
                populatedData.oppActorLastName = players[eventProp]['lastName'];
                populatedData.oppActorPicUrl = players[eventProp]['picUrl'];
                return;
            }
            if (index === 'team') {
                populatedData.teamName = teams[eventProp]['name'];
                populatedData.teamPicUrl = teams[eventProp]['picUrl'];
                return;
            }
            if (index === 'oppTeam') {
                populatedData.oppTeamName = teams[eventProp]['name'];
                populatedData.oppTeamPicUrl = teams[eventProp]['picUrl'];
                return;
            }
        });
        if (populatedData.intensity && populatedData.type.indexOf('train:') < 0) {
            populatedData = populateVerbPhrase(populatedData);
        }
        if (populatedData) {
            resolve(populatedData);
        } else {
            reject('bad data');
        }
    });
}

function populateVerbPhrase(data) {
    return new Promise(function(resolve, reject) {
        var populatedData = data;
        var verbsByType = [];
        var verbsPerIntensity = [];
        db.ref('verbphrase').orderByChild('type').equalTo(data.type).once('value').then(function(snapshot) {
            verbsByType = snapshot.val();
            verbsPerIntensity = _.filter(verbsByType, function(verbItem) {
                return verbItem.intensity === data.intensity;
            });
            var randomVerb = verbsPerIntensity[Math.floor(Math.random()*verbsPerIntensity.length)];
            populatedData.verbPhrase = randomVerb.verb;
            resolve(populatedData);
        }).catch(function(error) {
            reject(error);
        });
    });
}

//write to events after finished with the message handling
function createEvent(populatedData) {
    eventsRef.push().set(populatedData);
}

//write to the queue collection
function sendMessage(message) {
    return new Promise(function(resolve, reject) {
        queueRef.push(message);
        setTimeout(function() {
            resolve(message);
        }, 1000);
    });
}

function init() {
    listenToCollections();
}

init()

module.exports = {
    sendMessage: sendMessage,
    populateEvent: populateEvent
};
