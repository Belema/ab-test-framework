'use strict';

var allocation = require('./allocation');
var analytics = require('./analytics-tracker');
var config = require('../config');
var location = require('../utils/location');
var segmentation = require('./segmentation');
var storage = require('../utils/storage');
var window = require('../utils/window');

function handleError (error, enableDebug) {
    window().console.log('nuk-mvt:error');

    if (analytics && analytics.trackError) {
        analytics.trackError(error);
    }

    if (enableDebug) {
        window().console.log(error);
    }
}

function runVariation (variation, options) {
    if (variation.style) {
        var element = window().document.createElement('style');
        element.innerHTML = variation.style;
        window().document.head.appendChild(element);
    }
    if (typeof variation.code === 'function') {
        variation.code(options);
    }
}

function runExperiment (trigger, variation) {
    return trigger(function (options) {
        runVariation(variation, options);
    });
}

module.exports.run = function (experiments) {
    var enableDebug = true;

    try {
        if (location.isAbTestDisabled()) {
            window().console.log('ab-test:disable');
            return;
        }

        enableDebug = location.isDebugEnabled();
        if (enableDebug) {
            window().console.log('ab-test:debug');
        }

        var allocations = storage.getFromLocalStorage(config.storage.key) || {};
        allocations = allocation.mergeHashValues(allocations);

        var selectedVariations = segmentation.variations(experiments, allocations);
        analytics.addTrackingVariable(selectedVariations);

        storage.setInLocalStorage(config.storage.key, allocations);

        for (var i = 0; i < selectedVariations.length; i++) {
            runExperiment(selectedVariations[i].trigger, selectedVariations[i].data);
        }
    } catch (error) {
        handleError(error, enableDebug);
    }
};
