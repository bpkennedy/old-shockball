'use strict';

/**
 * @ngdoc function
 * @name shockballApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the shockballApp
 */
angular.module('shockballApp')
  .controller('ProfileCtrl', function () {
    var vm = this;
    vm.labels = [];
    vm.userObj = {
        first_name: 'Tholme',
        last_name: 'So',
        current_team: 5,
        stats: {
            speed: '80',
            tackle: '25',
            stamina: '60',
            shooting: '80',
            passing: '20',
            defending: '10'
        },
        current_training: 'speed',
        current_strategy: 'scoring',
        birth_planet: 'Tatooine',
        profile_pic: 'http://i736.photobucket.com/albums/xx4/bpkennedy/norringtonfreelance.jpg',
        isCaptain: false,
        isOwner: false,
        current_team_id: 4,
        items: [ 6, 14, 29 ]
    };
    vm.teamObj = {
        team_name: 'Kenbo Spankers',
        creation_date: '8934098423',
        team_training: 'Attacking',
        team_strategy: 'Aggressive',
        stats: {
            passing: 70,
            attacking: 65,
            defending: 80
        },
        origin: {
            planet: 'kenbo',
            system: 'testSector',
            sector: 'Hutt Space'
        },
        team_logo: 'http://vignette3.wikia.nocookie.net/bloodbowl-legendary/images/b/b8/Amazon_Icon.gif',
        building_id: 3858993,
        sponsor_id: null
    };

    function init() {
        constructSkillChart();
    }

    function constructSkillChart() {
        vm.labels = [
            "Speed",
            "Tackling",
            "Stamina",
            "Shooting",
            "Passing",
            "Defending"
        ];
        vm.data = [ _.values(vm.userObj.stats) ];
    }

    vm.selected = [];

    vm.query = {
      order: 'name',
      limit: 5,
      page: 1
    };

    vm.desserts = [{
        name: 'Parfait',
        calories: 44,
        fat: 3,
        carbs: 8,
        protein: 6,
        sodium: 5,
        calcium: {
            value: 4,
            unit: 2
        },
        iron: {
            value: 3
        }
    },
    {
        name: 'Ice Cream',
        calories: 66,
        fat: 3,
        carbs: 12,
        protein: 6,
        sodium: 50,
        calcium: {
            value: 7,
            unit: 5
        },
        iron: {
            value: 8
        }
    },
    {
        name: 'Skittles',
        calories: 12,
        fat: 30,
        carbs: 18,
        protein: 16,
        sodium: 51,
        calcium: {
            value: 14,
            unit: 12
        },
        iron: {
            value: 13
        }
    }];

    vm.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    init();
  });
