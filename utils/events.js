'use strict';

module.exports.add = function (element, events, callback) {
    if (!events || !events.length) {
        return;
    }

    var list = [].concat(events);
    for (var i = 0; i < list.length; i++) {
        if (element.addEventListener) {
            element.addEventListener(list[i], callback, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + list[i], callback);
        }
    }
};
