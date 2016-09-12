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
    var profile = this;

    profile.labels = ["Shooting", "Passing", "Tackling", "Blocking", "Speed", "Stamina", "Presence"];

    profile.data = [
        [65, 59, 90, 81, 56, 55, 40],
        // [28, 48, 40, 19, 96, 27, 100]
    ];

    profile.selected = [];

    profile.query = {
      order: 'name',
      limit: 5,
      page: 1
    };

    profile.desserts = [{
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

    profile.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
