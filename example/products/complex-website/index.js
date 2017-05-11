'use strict';

var experiment1 = require('./experiments/experiment1');
var experiment3 = require('./experiments/experiment3');

module.exports = [
    {
        name: require('./manifest?experiment1.name'),
        id: require('./manifest?experiment1.id'),
        trigger: experiment1.trigger,
        variations: [
            {
                weight: 50,
                code: experiment1.variation0
            },
            {
                weight: 50,
                style: require('./experiments/experiment1/style.scss'),
                code: experiment1.variation1
            }
        ]
    },
    {
        name: require('./manifest?experiment3.name'),
        id: require('./manifest?experiment3.id'),
        trigger: experiment3.trigger,
        variations: [
            {
                weight: 1,
                code: experiment3.variation0
            },
            {
                weight: 2,
                style: require('./experiments/experiment3/style.scss'),
                code: experiment3.variation0
            }
        ]
    }
];
