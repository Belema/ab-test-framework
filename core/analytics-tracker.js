'use strict';

var config = require('../config');
var window = require('../utils/window');

function stringify (selectedVariations) {
    var output = [];

    for (var i = 0; i < selectedVariations.length; i++) {
        var variation = selectedVariations[i];

        if (typeof variation.experimentIdentifier !== 'number' || typeof variation.variationIndex !== 'number') {
            throw new Error('Error adding mvt tracking.');
        }

        output.push(config.analytics.prefix + variation.experimentIdentifier + ':' + variation.variationIndex);
    }

    return output.sort().join(config.analytics.separator);
}

module.exports.trackError = function (error) {
    window()[config.analytics.variable] = (window()[config.analytics.variable] || '') + '(error)';

    if (error) {
        if (typeof error.stack === 'string') {
            window()[config.analytics.error] = error.stack.replace(/\n\s+/g,'\n');
        } else if (typeof error.message === 'string') {
            window()[config.analytics.error] = error.message;
        }
    }
};

module.exports.addTrackingVariable = function (selectedVariations) {
    window()[config.analytics.variable] = stringify(selectedVariations || []);
};
