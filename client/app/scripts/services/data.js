'use strict';

/**
 * @ngdoc service
 * @name shockballApp.Data
 * @description
 * # Data
 * Factory in the shockballApp.
 */
angular.module('shockballApp')
  .factory('Data', function ($window, $http, utils) {
      var allTeams = {
          data: []
      };
      var allPlayers = {
          data: []
      };

      function fetchPlayer(id) {
          return $http.get('/players/' + id);
      }

      function fetchPlayerSubmission(id) {
          return $http.get('/players/submit/' + id);
      }

      function fetchAllPlayers() {
          return $http.get('/players').then(function(response) {
             allPlayers.data = utils.unpackObjectKeys(response.data);
             return allPlayers;
          });
      }

      function fetchAllUsers() {
          return $http.get('/users');
      }

      function fetchUser(uid) {
          return $http.get('/users/' + uid);
      }

      function fetchAllPlayerSubmissions() {
          return $http.get('/players/submit/').then(function(response) {
              return utils.unpackObjectKeys(response.data);
          });
      }

      function fetchTeam(teamId) {
          return $http.get('/teams/' + teamId);
      }

      function fetchTeamPlayers(teamId) {
          return $http.get('/players/team/' + teamId);
      }

      function fetchAllTeams() {
          return $http.get('/teams').then(function(response) {
              allTeams.data = utils.unpackObjectKeys(response.data);
              return allTeams;
          });
      }

      function fetchAllMatches() {
          return $http.get('/matches');
      }

      function fetchDivisions() {
          return $http.get('/divisions');
      }

      function fetchDivision(uid) {
          return $http.get('/divisions/' + uid);
      }

      function fetchConferences() {
          return $http.get('/conferences');
      }

      function fetchDivisionTeams(divisionId) {
          return $http.get('/teams/division/' + divisionId);
      }

      function fetchConferenceDivisions(conferenceId) {
          return $http.get('/divisions/conference/' + conferenceId, { cache: true});
      }

      function fetchPlayerContract(id) {
          return $http.get('/contracts/' + id.toString());
      }

      function fetchTeamContracts(uid) {
          return $http.get('/contracts/team/' + uid.toString());
      }

      function fetchPrimaryEvents(playerId) {
          return $http.get('/events/actor/' + playerId.toString()).then(function(response) {
              if (response.data) {
                  var primarySourceEvents = utils.unpackObjectKeys(response.data);

                  _.forEach(primarySourceEvents, function(value) {
                      var primarySourcePlayer = findPlayer(allPlayers.data, value, 'actor');
                      var secondarySourcePlayer = findPlayer(allPlayers.data, value, 'oppActor');
                      value.primarySourceName = primarySourcePlayer.firstName;
                      value.secondarySourceName = secondarySourcePlayer.firstName;
                  });
                  return primarySourceEvents;
              }
          });
      }

      function fetchSecondaryEvents(playerId) {
          return $http.get('/events/oppActor/' + playerId.toString()).then(function(response) {
              if (response.data) {
                  var secondarySourceEvents = utils.unpackObjectKeys(response.data);

                  _.forEach(secondarySourceEvents, function(value) {
                      var primarySourcePlayer = findPlayer(allPlayers.data, value, 'actor');
                      var secondarySourcePlayer = findPlayer(allPlayers.data, value, 'oppActor');
                      value.primarySourceName = primarySourcePlayer.firstName;
                      value.secondarySourceName = secondarySourcePlayer.firstName;
                  });
                  return secondarySourceEvents;
              }
          });
      }

      function fetchHomeMatches(teamId) {
          return $http.get('/matches/homeTeam/' + teamId.toString()).then(function(response) {
              if (response.data) {
                  var homeMatches = utils.unpackObjectKeys(response.data);

                  _.forEach(homeMatches, function(value) {
                      var homeTeam = findTeam(allTeams.data, value, 'homeTeam');
                      var awayTeam = findTeam(allTeams.data, value, 'awayTeam');
                      value.homeTeamName = homeTeam.name;
                      value.awayTeamName = awayTeam.name;

                  });
                  return homeMatches;
              }
          });
      }

      function fetchAwayMatches(teamId) {
          return $http.get('/matches/awayTeam/' + teamId.toString()).then(function(response) {
              if (response.data) {
                  var awayMatches = utils.unpackObjectKeys(response.data);
                  _.forEach(awayMatches, function(value) {
                      var homeTeam = findTeam(allTeams.data, value, 'homeTeam');
                      var awayTeam = findTeam(allTeams.data, value, 'awayTeam');
                      value.homeTeamName = homeTeam.name;
                      value.awayTeamName = awayTeam.name;
                  });
                  return awayMatches;
              }
          });
      }

      function findTeam(allTeams, matchData, type) {
          var foundTeam = _.find(allTeams, function(team) {
              return team.objectKey === matchData['' + type + ''];
          });
          return foundTeam;
      }

      function findPlayer(allPlayers, eventData, type) {
          var foundPlayer = _.find(allPlayers, function(player) {
              return player.objectKey === eventData['' + type + ''];
          });
          return foundPlayer;
      }

      function getAllTeams() {
          return $http.get('/teams').then(function(response) {
             allTeams.data = utils.unpackObjectKeys(response.data);
          });
      }

      function getAllPlayers() {
          return $http.get('/players').then(function(response) {
             allPlayers.data = utils.unpackObjectKeys(response.data);
          });
      }

      function postMessage(eventData) {
          return $window.firebase.auth().currentUser.getToken(true).then(function(idToken) {
             eventData.idToken = idToken;
              return $http({
                  method: 'POST',
                  url: '/events/new',
                  data: eventData
              });
          }).catch(function(error) {
             return console.log('error getting token: ' + error);
          });
      }

      function createPlayer(data) {
          return $window.firebase.auth().currentUser.getToken(true).then(function(idToken) {
              data.idToken = idToken;
              data.objectKey = null;
              return $http({
                  method: 'POST',
                  url: '/players/new',
                  data: data
              });
          }).catch(function(error) {
              console.log('error getting token: ');
              console.log(error);
              return;
          });
      }

      function createTeam(data) {
          return $window.firebase.auth().currentUser.getToken(true).then(function(idToken) {
              data.idToken = idToken;
              data.objectKey = null;
              return $http({
                  method: 'POST',
                  url: '/teams/new',
                  data: data
              });
          }).catch(function(error) {
              console.log('error getting token: ');
              console.log(error);
              return;
          });
      }

      function rejectPlayer(key) {
          return $window.firebase.auth().currentUser.getToken(true).then(function(idToken) {
              var data = {
                  key: key,
                  idToken: idToken
              };
              return $http({
                  method: 'POST',
                  url: '/players/reject',
                  data: data
              });
          }).catch(function(error) {
             return console.log('error getting token: ' + error);
          });
      }

      function submitPlayer(data) {
          return $http({
              method: 'POST',
              url: '/players/submit',
              data: data
          });
      }

      function init() {
          getAllTeams();
          getAllPlayers();
      }

      init();

      return {
        fetchPlayer: fetchPlayer,
        fetchPlayerSubmission: fetchPlayerSubmission,
        fetchAllPlayers: fetchAllPlayers,
        fetchAllUsers: fetchAllUsers,
        fetchUser: fetchUser,
        fetchAllPlayerSubmissions: fetchAllPlayerSubmissions,
        fetchTeamPlayers: fetchTeamPlayers,
        fetchTeam: fetchTeam,
        fetchAllTeams: fetchAllTeams,
        fetchAllMatches: fetchAllMatches,
        fetchDivisions: fetchDivisions,
        fetchDivision: fetchDivision,
        fetchConferences: fetchConferences,
        fetchDivisionTeams: fetchDivisionTeams,
        fetchConferenceDivisions: fetchConferenceDivisions,
        fetchPlayerContract: fetchPlayerContract,
        fetchTeamContracts: fetchTeamContracts,
        fetchHomeMatches: fetchHomeMatches,
        fetchAwayMatches: fetchAwayMatches,
        fetchPrimaryEvents: fetchPrimaryEvents,
        fetchSecondaryEvents: fetchSecondaryEvents,
        postMessage: postMessage,
        submitPlayer: submitPlayer,
        createPlayer: createPlayer,
        createTeam: createTeam,
        rejectPlayer: rejectPlayer
      };
  });
