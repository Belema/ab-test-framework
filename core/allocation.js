'use strict';

var location = require('../utils/location');
var window = require('../utils/window');

module.exports.mergeHashValues = function (allocation) {
    var clone = {};
    for (var property in allocation) {
        if (allocation.hasOwnProperty(property)) {
            clone[property] = allocation[property];
        }
    }

    var queryValues = location.getHashValue('mvt');
    if (!queryValues) {
        return clone;
    }

    var queryValuePattern = /^\d+\.\d+(-\d+\.\d+)*$/;
    if (!queryValuePattern.test(queryValues)) {
        window().console.log('nuk-mvt:bad query values');
        return clone;
    }

    var queryValueList = queryValues.split('-');
    for (var i = 0; i < queryValueList.length; i++) {
        var keyValuePair = queryValueList[i].split('.');
        clone[keyValuePair[0]] = window().parseInt(keyValuePair[1], 10);
    }

    return clone;
};
