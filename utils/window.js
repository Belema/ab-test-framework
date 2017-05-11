'use strict';

var window;

module.exports = function (value) {
    if (arguments.length > 0) {
        window = (typeof value === 'object') ? value : null;
        return;
    }

    if (!window) {
        throw new Error('Window not initialised.');
    }

    return window;
};
