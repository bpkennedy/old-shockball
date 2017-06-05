'use strict';

/**
* @ngdoc service
* @name shockballApp.utils
* @description
* # utils
* Factory in the shockballApp.
*/
angular.module('shockballApp')
.factory('utils', function () {

    function unpackObjectKeys(data) {
        var newArray = [];
        if (data) {
            _.forEach(data, function(value, key) {
                var item = value;
                item.objectKey = key;
                newArray.push(item);
            });
            return newArray;
        }
    }

    return {
        unpackObjectKeys: unpackObjectKeys
    };
});
