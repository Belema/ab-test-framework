'use strict';

function isExperimentRunnable (experiment) {
    return typeof experiment.id === 'number'
        && experiment.variations
        && experiment.variations.length > 0;
}

function getAllocationForExperiment (experiment, allocations) {
    if (!isExperimentRunnable(experiment)) {
        return null;
    }

    var allocation = allocations[experiment.id];
    if (typeof allocation === 'number') {
        return allocation;
    }

    if (experiment.variations.length === 1) {
        allocations[experiment.id] = 0;
        return 0;
    }

    var weights = [];
    for (var i = 0; i < experiment.variations.length; i++) {
        var variation = experiment.variations[i];
        weights.push({
            item: variation.weight,
            accumulator: (weights.length ? weights[weights.length - 1].accumulator : 0) + variation.weight
        });
    }

    var random = Math.random() * weights[weights.length - 1].accumulator;
    for (var j = 0; j < weights.length; j++) {
        if (random < weights[j].accumulator) {
            allocations[experiment.id] = j;
            break;
        }
    }

    if (random === weights[weights.length - 1].accumulator) {
        allocations[experiment.id] = weights.length - 1;
    }

    return allocations[experiment.id];
}

module.exports.variations = function (experiments, allocations) {
    if (!experiments || !allocations) {
        throw new Error('Missing required parameter');
    }

    var output = [];

    for (var i = 0; i < experiments.length; i++) {
        var variationIndex = getAllocationForExperiment(experiments[i], allocations);
        if (typeof variationIndex === 'number') {
            output.push({
                experimentIdentifier: experiments[i].id,
                variationIndex: variationIndex,
                trigger: experiments[i].trigger,
                data: experiments[i].variations[variationIndex]
            });
        }
    }

    return output;
};
