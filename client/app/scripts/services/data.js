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
          return $http.get('/players/' + id, {cache: true});
      }

      function fetchAllPlayers() {
          return $http.get('/players', {cache: true}).then(function(response) {
             allPlayers.data = utils.unpackObjectKeys(response.data);
             return allPlayers;
          });
      }

      function fetchTeam(teamId) {
          return $http.get('/teams/' + teamId, {cache: true});
      }

      function fetchTeamPlayers(teamId) {
          return $http.get('/players/team/' + teamId, {cache: true});
      }

      function fetchAllTeams() {
          return $http.get('/teams', {cache: true}).then(function(response) {
              allTeams.data = utils.unpackObjectKeys(response.data);
              return allTeams;
          });
      }

      function fetchDivisions() {
          return $http.get('/divisions', {cache: true});
      }

      function fetchConferences() {
          return $http.get('/conferences', {cache:true});
      }

      function fetchDivisionTeams(divisionId) {
          return $http.get('/teams/division/' + divisionId, {cache: true});
      }

      function fetchConferenceDivisions(conferenceId) {
          return $http.get('/divisions/conference/' + conferenceId, { cache: true});
      }

      function fetchPlayerContract(id) {
          return $http.get('/contracts/' + id.toString(), {cache: true});
      }

      function fetchPrimaryEvents(playerId) {
          return $http.get('/events/actor/' + playerId.toString(), {cache: true}).then(function(response) {
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
          return $http.get('/events/oppActor/' + playerId.toString(), {cache: true}).then(function(response) {
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
          return $http.get('/matches/homeTeam/' + teamId.toString(), {cache: true}).then(function(response) {
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
          return $http.get('/matches/awayTeam/' + teamId.toString(), {cache: true}).then(function(response) {
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
          return $http.get('/teams', {cache: true}).then(function(response) {
             allTeams.data = utils.unpackObjectKeys(response.data);
          });
      }

      function getAllPlayers() {
          return $http.get('/players', {cache: true}).then(function(response) {
             allPlayers.data = utils.unpackObjectKeys(response.data);
          });
      }

      function postMessage(eventData) {
          return $window.firebase.auth().currentUser.getToken(true).then(function(idToken) {
              var eventObj = {
                 actor: eventData.actor,
                 oppActor: eventData.oppActor || null,
                 secondaryOppActor: eventData.secondaryOppActor || null,
                 type: eventData.type,
                 intensity: eventData.intensity || null,
                 team: eventData.team || null,
                 match: eventData.match || null,
                 oppTeam:  eventData.oppTeam || null,
                 time: new Date().toJSON(),
                 idToken: idToken
             };
              return $http({
                  method: 'POST',
                  url: '/events/new',
                  data: eventObj
              });
          }).catch(function(error) {
             return console.log('error getting token: ' + error);
          });
      }

      function init() {
          getAllTeams();
          getAllPlayers();
      }

      init();

      return {
        fetchPlayer: fetchPlayer,
        fetchAllPlayers: fetchAllPlayers,
        fetchTeamPlayers: fetchTeamPlayers,
        fetchTeam: fetchTeam,
        fetchAllTeams: fetchAllTeams,
        fetchDivisions: fetchDivisions,
        fetchConferences: fetchConferences,
        fetchDivisionTeams: fetchDivisionTeams,
        fetchConferenceDivisions: fetchConferenceDivisions,
        fetchPlayerContract: fetchPlayerContract,
        fetchHomeMatches: fetchHomeMatches,
        fetchAwayMatches: fetchAwayMatches,
        fetchPrimaryEvents: fetchPrimaryEvents,
        fetchSecondaryEvents: fetchSecondaryEvents,
        postMessage: postMessage
      };
  });
