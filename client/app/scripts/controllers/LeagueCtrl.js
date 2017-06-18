'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:LeagueCtrl
* @description
* # LeagueCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('LeagueCtrl', function ($scope, $state, Data, utils) {
    var vm = this;
    vm.leagueTeamDefs = [
        {headerName: "Team", field: "name", cellRenderer: teamNameCellRender},
        {headerName: "Logo", field: "picUrl"},
        {headerName: "Division", field: "division"},
        {headerName: "Object Key", field: "objectKey"},
        {headerName: "UID", field: "uid"}
    ];
    vm.divisions = [];
    vm.conferences = [];
    vm.leagueTeams = [];
    vm.leaguePlayers = [];
    vm.divisionTeams = [];
    vm.conferenceTeams = [];
    vm.selectedConf = { value: vm.conferences[0] };
    vm.selectedDiv = { value: vm.divisions[0] };
    vm.setConference = setConference;
    vm.setDivision = setDivision;

    vm.gridOptions = {
        columnDefs: vm.leagueTeamDefs,
        rowData: vm.leagueTeams,
        angularCompileRows: true,
        onGridReady: function(event) {
            console.log(event);
            console.log('fired on ready');
        },
    };
    $scope.goToTeam = goToTeam;

    function init() {
        setLeagueModel();
        getConferences();
    }

    function getConferences() {
        Data.fetchConferences().then(function(response) {
            vm.conferences = utils.unpackObjectKeys(response.data);
            vm.selectedConf = { value: vm.conferences[0].name };
        });
    }

    function setDivision(value) {
        Data.fetchDivisionTeams(value.objectKey).then(function(response) {
            vm.leagueTeams =  utils.unpackObjectKeys(response.data);
            updateGrid();
        });
    }

    function setConference(value) {
        var conferenceDivisions = [];
        var divisionTeams = [];
        var conferenceTeams = [];
        var counter = 0;
        var divisionCount = 0;
        Data.fetchConferenceDivisions(value.objectKey).then(function(response) {
            conferenceDivisions = utils.unpackObjectKeys(response.data);
            vm.divisions = conferenceDivisions;
            vm.selectedDiv = { value: vm.divisions[0] };
            divisionCount = conferenceDivisions.length;
            _.forEach(conferenceDivisions, function(division) {
                Data.fetchDivisionTeams(division.objectKey).then(function(response) {
                    counter++;
                    divisionTeams = utils.unpackObjectKeys(response.data);
                    _.forEach(divisionTeams, function(team) {
                        conferenceTeams.push(team);
                    });
                    if (counter === divisionCount) {
                        vm.leagueTeams = conferenceTeams;
                        updateGrid();
                    }
                });
            });

        });
    }

    function setLeagueModel() {
        Data.fetchAllTeams().then(function(response) {
            vm.leagueTeams = response.data;
            console.log('league teams are');
            console.log(vm.leagueTeams);
            updateGrid();
        });
    }

    function teamNameCellRender(params) {
        params.$scope.goToTeam = goToTeam;
        return "<a class=\"team-link\" ng-click=\"goToTeam(data.uid)\">" + params.data.name + "</a>";
    }

    function goToTeam(id) {
        $state.go('root.team', { teamId: id });
    }

    function updateGrid() {
        vm.gridOptions.api.setRowData(vm.leagueTeams);
    }

    init();
});
