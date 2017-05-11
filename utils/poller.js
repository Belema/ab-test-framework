'use strict';

var window = require('./window');

var POLLER_DELAY = 100;
var POLLER_LIMIT = 15000;

function polyfillQuerySelectorAll () {
    if (!window().document.querySelectorAll) {
        window().document.querySelectorAll = function (selectors) {
            var style = window().document.createElement('style'), elements = [], element;
            window().document.documentElement.firstChild.appendChild(style);
            window().document._qsa = [];

            style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
            window().scrollBy(0, 0);
            style.parentNode.removeChild(style);

            while (window().document._qsa.length) {
                element = window().document._qsa.shift();
                element.style.removeAttribute('x-qsa');
                elements.push(element);
            }
            window().document._qsa = null;
            return elements;
        };
    }
}

function checkPredicates (predicates) {
    if (!predicates || !predicates.length) {
        return true;
    }

    for (var j = 0; j < predicates.length; j++) {
        var isTruePredicate = predicates[j]();
        if (!isTruePredicate) {
            return false;
        }
    }

    return true;
}

module.exports.poll = function (/* selectors, predicates = null, callback */) {
    var selectors = arguments[0];
    var predicates = arguments.length === 3 ? arguments[1] : null;
    var callback = arguments.length === 3 ? arguments[2] : arguments[1];

    polyfillQuerySelectorAll();

    var elements = [];
    var elapsed = 0;

    return (function poll () {
        var missingItem = null;

        for (var i = 0; i < selectors.length; i++) {
            if (elements[i]) {
                continue;
            }

            var item = selectors[i];
            var selector = (typeof item === 'string') ? item : item[0];
            var quantity = (typeof item === 'string') ? 1 : item[1];

            var queryResult = window().document.querySelectorAll(selector);

            if (queryResult.length < quantity) {
                missingItem = ':' + selector;
                break;
            } else {
                elements[i] = queryResult;
            }
        }

        if (!missingItem && checkPredicates(predicates)) {
            return callback.apply(null, elements);
        }

        elapsed += POLLER_DELAY;
        if (elapsed < POLLER_LIMIT) {
            return window().setTimeout(poll, POLLER_DELAY);
        } else {
            return window().console.log('ab-test:timeout' + missingItem);
        }
    })();
};
