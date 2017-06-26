var admin = require("firebase-admin");
var _ = require("lodash");
var CronJob = require("cron").CronJob;

var db = admin.database();
var dbRoot = db.ref();
var matchesRef = db.ref("matches");
var eventsRef = db.ref("events");
var playersRef = db.ref("players");
var contractsRef = db.ref("contracts");
var presenceRef = db.ref("presence/app");
var playerSubmissions = db.ref("playerSubmissions");
var matches = [];

var count = 1;

function initializeEngine() {
    setPresenceAtStartup();
    trackPresence();
    setMatchesListener();
}

new CronJob('*/5 * * * * *', function() {

}, null, true, 'America/Chicago');

function setMatchesListener() {
    // This listens to the matches document in firebase for any changes/adds/deletes and returns the whole document
    matchesRef.on("value", function(snapshot) {
        matches = _.values(snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function setPresenceAtStartup() {
    presenceRef.set(true);
}

function trackPresence() {
    dbRoot.on('value', function(snapshot) {
      if (snapshot.val()) {
        presenceRef.onDisconnect().set(false);
        presenceRef.set(true);
    } else {
        presenceRef.set(false);
    }
    });
}

function trainSkill(event) {
    var skill = event.type.split(':').pop();
    var player = event.actor;
    var intensity = event.intensity;
    playersRef.child(player).update({
        training: skill,
        trainingIntensity: intensity
    });
}

function createNewPlayerContract(event) {
    contractsRef.push(event).then(function(snapshot) {
        contractsRef.child(snapshot.key).update({ contractUid: snapshot.key });
    });
    createEvent(event);
}

function processPlayerContract(event) {
    var contract = event.contractUid;
    contractsRef.child(contract).set(event);
    if (event.teamLockIn && event.playerLockIn) {
        createEvent(event);
    }
}

function terminateContract(event) {
    var contract = event.contractUid;
    contractsRef.child(contract).remove();
    createEvent(event);
}

function updatePlayerPic(uid, url) {
    playersRef.child(uid).update({ picUrl: url });
}

function createEvent(populatedData) {
    eventsRef.push().set(populatedData);
}

function processEvent(event) {
    if (event.type === 'player submitted') {
        playerSubmissions.push().set(event);
        return;
    }
    if (event.type.indexOf('train:') > -1) {
        trainSkill(event);
        return;
    }
    if (event.type.indexOf('picUpdate:') > -1) {
        var profilePic = event.type.split(':').pop();
        updatePlayerPic(event.actor, profilePic);
        return;
    }
    if (event.type.indexOf('contract:') > -1) {
        var contractType = event.type.split(':').pop();
        if (contractType === 'player') {
            processPlayerContract(event);
            return;
        } else if (contractType === 'terminate') {
            terminateContract(event);
            return;
        } else if (contractType === 'createPlayer') {
            createNewPlayerContract(event);
        }
    }
    createEvent(event);
}

initializeEngine();

module.exports = {
    processEvent: processEvent
};
