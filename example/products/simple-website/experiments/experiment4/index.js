'use strict';

const location = require('ab-test-framework/utils/location');

module.exports.trigger = function (callback) {
    if (location.getQueryValue('do') === 'it') {
        return callback();
    }
};

module.exports.variation0 = function () {
    return false;
};

module.exports.variation1 = function () {
    window.alert('Nothing is impossible!');
};
