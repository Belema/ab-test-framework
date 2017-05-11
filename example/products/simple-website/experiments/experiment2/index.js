'use strict';

module.exports.trigger = function (callback) {
    return callback();
};

module.exports.variation0 = function () {
    return false;
};

module.exports.variation1 = function () {
    window.alert('Experiment 2!');
};
