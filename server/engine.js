var admin = require("firebase-admin");
var _ = require("lodash");
var CronJob = require("cron").CronJob;
var moment = require("moment");

var db = admin.database();
var dbRoot = db.ref();
var matchesRef = db.ref("matches");
var eventsRef = db.ref("events");
var playersRef = db.ref("players");
var teamsRef = db.ref("teams");
var contractsRef = db.ref("contracts");
var presenceRef = db.ref("presence/app");
var playerSubmissionsRef = db.ref("playerSubmissions");
var matches = [];

var count = 1;

function initializeEngine() {
    setPresenceAtStartup();
    trackPresence();
    setMatchesListener();
    setContractCron();
}

function setContractCron() {
    new CronJob('0 */29 * * * *', function() {
        expireContracts();
    }, null, true, 'America/Chicago');
}

function expireContracts() {
    var today = moment(new Date());
    contractsRef.once("value", function(snapshot) {
        snapshot.forEach(function(child) {
            var itemData = child.val();
            var expirationDay = moment(itemData.endDate);
            if (today.isBefore(expirationDay)) {
                return;
            } else {
                playersRef.child(itemData.signingPlayer).update({ team: null});
                contractsRef.child(itemData.contractUid).remove();
            }
        });
    });
}

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
        playersRef.child(event.signingPlayer).update({ team: event.offerTeam });
        var playerAllContracts = contractsRef.orderByChild("signingPlayer").equalTo(event.signingPlayer);
        playerAllContracts.once("value", function(snapshot) {
            var updates = {};
            snapshot.forEach(function(child) {
                if (child.key !== contract) {
                    updates[child.key] = null;
                }
            });
            contractsRef.update(updates);
        });
        createEvent(event);
    }
}

function terminateContract(event, party) {
    var contract = event.contractUid;
    if (party === 'team' && event.status !== 'pending') {
        var teamContractDebuff = teamsRef.child(event.offerTeam).child('contractDebuff');
        teamContractDebuff.transaction(function(contractDebuff) {
            return (contractDebuff || 0) + 1;
        });
    } else if (party === 'player' && event.status !== 'pending') {
        var playerContractDebuff = playersRef.child(event.signingPlayer).child('contractDebuff');
        playerContractDebuff.transaction(function(contractDebuff) {
            return (contractDebuff || 0) + 1;
        });
    }
    playersRef.child(event.signingPlayer).update({ team: null });
    contractsRef.child(contract).remove();
    createEvent(event);
}

function updateCaptain(event) {
    teamsRef.child(event.team).update({ captainUid: event.actor });
    playersRef.child(event.actor).update({ teamCaptain: event.team });
    createEvent(event);
}

function updatePlayerPic(uid, url) {
    playersRef.child(uid).update({ picUrl: url });
}

function createEvent(populatedData) {
    eventsRef.push().set(populatedData);
}

function processEvent(event) {
    return new Promise(function(resolve, reject) {
        if (event.type === 'player submitted') {
            playerSubmissionsRef.push().set(event);
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
        if (event.type.indexOf('captain') > -1) {
            updateCaptain(event);
            return;
        }
        if (event.type.indexOf('contract:') > -1) {
            var contractType = event.type.split(':').pop();
            if (contractType === 'player') {
                processPlayerContract(event);
                return;
            } else if (contractType === 'teamTerminate') {
                terminateContract(event, 'team');
                return;
            } else if (contractType === 'playerTerminate') {
                terminateContract(event, 'player');
                return;
            } else if (contractType === 'createPlayer') {
                createNewPlayerContract(event);
                return;
            }
        }
        createEvent(event);
    });
}

initializeEngine();

module.exports = {
    processEvent: processEvent
};
