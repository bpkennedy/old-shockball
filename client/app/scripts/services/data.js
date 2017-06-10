'use strict';

/**
 * @ngdoc service
 * @name shockballApp.Data
 * @description
 * # Data
 * Factory in the shockballApp.
 */
angular.module('shockballApp')
  .factory('Data', function ($http, utils) {
      var allTeams = {
          data: []
      };
      var allPlayers = {
          data: []
      };

      function fetchPlayer(id) {
          return $http.get('/players/' + id, {cache: true});
      }

      function fetchTeam(teamId) {
          return $http.get('/teams/' + teamId, {cache: true});
      }

      function fetchPlayerContract(id) {
          return $http.get('/contracts/' + id.toString(), {cache: true});
      }

      function fetchPrimaryEvents(playerId) {
          return $http.get('/events/primarySource/' + playerId.toString(), {cache: true}).then(function(response) {
              if (response.data) {
                  var primarySourceEvents = utils.unpackObjectKeys(response.data);

                  _.forEach(primarySourceEvents, function(value) {
                      var primarySourcePlayer = findPlayer(allPlayers.data, value, 'primarySource');
                      var secondarySourcePlayer = findPlayer(allPlayers.data, value, 'secondarySource');
                      value.primarySourceName = primarySourcePlayer.firstName;
                      value.secondarySourceName = secondarySourcePlayer.firstName;
                  });
                  return primarySourceEvents;
              }
          });
      }

      function fetchSecondaryEvents(playerId) {
          return $http.get('/events/secondarySource/' + playerId.toString(), {cache: true}).then(function(response) {
              if (response.data) {
                  var secondarySourceEvents = utils.unpackObjectKeys(response.data);

                  _.forEach(secondarySourceEvents, function(value) {
                      var primarySourcePlayer = findPlayer(allPlayers.data, value, 'primarySource');
                      var secondarySourcePlayer = findPlayer(allPlayers.data, value, 'secondarySource');
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

      function init() {
          getAllTeams();
          getAllPlayers();
      }

      init();

      return {
        fetchPlayer: fetchPlayer,
        fetchTeam: fetchTeam,
        fetchPlayerContract: fetchPlayerContract,
        fetchHomeMatches: fetchHomeMatches,
        fetchAwayMatches: fetchAwayMatches,
        fetchPrimaryEvents: fetchPrimaryEvents,
        fetchSecondaryEvents: fetchSecondaryEvents
      };
  });
