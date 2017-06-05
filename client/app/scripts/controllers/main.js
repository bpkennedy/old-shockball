'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('MainCtrl', function ($window) {
    var vm = this;
    vm.test = 'test';

    vm.columnDefs = [
        {headerName: "Make", field: "make"},
        {headerName: "Model", field: "model"},
        {headerName: "Price", field: "price"}
    ];

    vm.rowData = [
        {make: "Toyota", model: "Celica", price: 35000},
        {make: "Ford", model: "Mondeo", price: 32000},
        {make: "Porsche", model: "Boxter", price: 72000}
    ];

    vm.gridOptions = {
        columnDefs: vm.columnDefs,
        rowData: vm.rowData
    };

    function init() {
    }

    init();
});
