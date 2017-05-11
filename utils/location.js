'use strict';

var window = require('./window');

function getHash() {
    return window().location.hash || '';
}

function getSearch() {
    return window().location.search || '';
}

function hasHashKey (key) {
    var regex = new RegExp('(^|#|&)' + key + '(=|&|$)');
    var hash = getHash();
    return regex.test(hash);
}

function getHashValue (key) {
    var regex = new RegExp('^#?(?:.*&)?' + key + '=([^&]*).*$');
    var hash = getHash();
    var results = regex.exec(hash);
    return results && results[1] && window().decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function getQueryValue (key) {
    var regex = new RegExp('^\\??(?:.*&)?' + key + '=([^&]*).*$');
    var search = getSearch();
    var results = regex.exec(search);
    return results && results[1] && window().decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function isAbTestDisabled () {
    return hasHashKey('disable_ab_tests');
}

function isDebugEnabled () {
    return hasHashKey('debug_ab_tests');
}

module.exports.hasHashKey = hasHashKey;
module.exports.getHashValue = getHashValue;
module.exports.getQueryValue = getQueryValue;
module.exports.isAbTestDisabled = isAbTestDisabled;
module.exports.isDebugEnabled = isDebugEnabled;
