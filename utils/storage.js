'use strict';

var window = require('./window');

function encodeCookie (value) {
    return window().btoa(JSON.stringify(value));
}

function decodeCookie (value) {
    return JSON.parse(window().atob(value));
}

function stringifyCookieOptions (options) {
    var cookieOptions = [''];
    for (var property in options) {
        if (options.hasOwnProperty(property)) {
            cookieOptions.push(property + '=' + options[property]);
        }
    }
    return cookieOptions.join(';');
}

function isStorageAvailable (storage) {
    try {
        if (!storage) {
            return false;
        }

        var key = 'nuk_mvt_storage_test';
        storage.setItem(key, 'ping');
        var valueOut = storage.getItem(key);

        if (storage.removeItem) {
            storage.removeItem(key);
        }

        return (valueOut === 'ping') ? true : false;
    } catch (error) {
        return false;
    }
}

function getStorage (store) {
    try {
        var storage = window()[store];
        return isStorageAvailable(storage) ? storage : null;
    } catch (error) {
        return null;
    }
}

function getFromStorage (storage, key) {
    if (isStorageAvailable(storage)) {
        var storageItem = storage.getItem(key);
        return storageItem ? JSON.parse(storageItem) : null;
    } else {
        return exports.getCookie(key);
    }
}

module.exports.getCookie = function (key) {
    var pattern = new RegExp('(?:(?:^|.*;\\s*)' + key + '\\s*\\=\\s*([^;]*).*$)|^.*$');
    var cookie = window().document.cookie || '';
    var cookieItem = cookie.replace(pattern, '$1');
    return cookieItem ? decodeCookie(cookieItem) : null;
};

module.exports.setCookie = function (key, value, options) {
    var cookieValue = encodeCookie(value);
    var cookieOptions = stringifyCookieOptions(options);
    var cookie = key + '=' + cookieValue + cookieOptions;
    window().document.cookie = cookie;
};

module.exports.setInLocalStorage = function (key, value) {
    var localStorage = getStorage('localStorage');
    if (localStorage) {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        exports.setCookie(key, value, {
            expires: 'Fri, 31 Dec 9999 23:59:59 GMT',
            path: '/'
        });
    }
};

module.exports.setInSessionStorage = function (key, value) {
    var sessionStorage = getStorage('sessionStorage');
    if (sessionStorage) {
        sessionStorage.setItem(key, JSON.stringify(value));
    } else {
        exports.setCookie(key, value, { path: '/' });
    }
};

module.exports.getFromLocalStorage = function (key) {
    var localStorage = getStorage('localStorage');
    return getFromStorage(localStorage, key);
};

module.exports.getFromSessionStorage = function (key) {
    var sessionStorage = getStorage('sessionStorage');
    return getFromStorage(sessionStorage, key);
};
