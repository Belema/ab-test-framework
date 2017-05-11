'use strict';

const config = require('../../config');
const events = require('ab-test-framework/utils/events');
const location = require('ab-test-framework/utils/location');
const poller = require('ab-test-framework/utils/poller');
const storage = require('ab-test-framework/utils/storage');

module.exports.trigger = function (callback) {
    const codeValue = location.getQueryValue('code');
    if (codeValue === config.environment.code) {
        return callback();
    }
};

module.exports.variation0 = function () {
    return false;
};

module.exports.variation1 = function () {
    function action ($submit) {
        function displaySubmitAlertOnce () {
            const cookieValue = storage.getCookie('alerted');

            if (!cookieValue) {
                storage.setCookie('alerted', true, {
                    domain: config.environment.domain,
                    expires: 'Fri, 31 Dec 9999 23:59:59 GMT',
                    path: '/'
                });

                window.alert('blah');
            }
        }

        events.add($submit[0], 'click', displaySubmitAlertOnce);
    }

    poller.poll(['#Submit'], action);
};
