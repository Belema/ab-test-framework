'use strict';

const poller = require('ab-test-framework/utils/poller');
const button = require('./button.html');

module.exports.trigger = function (callback) {
    return callback();
};

module.exports.variation0 = function () {
    return false;
};

module.exports.variation1 = function () {
    function injectContinueButton () {
        const $ = window.$;

        $('.targetElement').after(button);

        $('.super-button').on('click', function () {
            window.alert('Do not do that again!');
        });
    }

    poller.poll([], [() => window.$], injectContinueButton);
};
