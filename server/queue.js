var admin = require("firebase-admin");
var Queue = require('firebase-queue');
var _ = require("lodash");

var db = admin.database();
var dbRoot = db.ref('queue');
var queueRef = db.ref('queue/tasks');
var eventsRef = db.ref('events');

// data schema for queue message
var Joi = require('joi');

var eventSchema = Joi.object().keys({
    actor: Joi.string().alphanum().required(),
    oppActor: Joi.string().alphanum().allow(null),
    secondaryOppActor: Joi.string().alphanum().allow(null),
    type: Joi.string().alphanum().required(),
    match: Joi.string().alphanum().allow(null),
    team: Joi.string().alphanum().allow(null),
    oppTeam: Joi.string().alphanum().allow(null),
    time: Joi.date().required()
}).with('actor', 'type');

//create the queue
var queue = new Queue(dbRoot, function(data, progress, resolve, reject) {
    admin.auth().verifyIdToken(data.idToken).then(function(decodedToken) {
        if (decodedToken.uid.toString().toLowerCase() === data.actor.toString().toLowerCase()) {
            delete data.idToken;
            const result = Joi.validate(data, eventSchema);
            if (result.error === null) {
                createEvent(data);
                resolve(data);
            } else {
                reject({ message: 'invalid data format', data: data, idToken: data.idToken });
            }
        } else {
            reject({ message: 'they see me rollin, they hatin.', data: data, idToken: data.idToken });
        }
    }).catch(function(error) {
        reject({ message: 'invalid idToken', data: data, idToken: data.idToken });
    });
});

//write to events after finished with the message handling
function createEvent(data) {
    eventsRef.push().set(data);
}

//write to the queue collection
function sendMessage(message) {
    queueRef.push(message);
}

module.exports = {
    sendMessage: sendMessage
};
