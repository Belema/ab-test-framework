'use strict';

const experiment2 = require('./experiments/experiment2');
const experiment4 = require('./experiments/experiment4');

module.exports = [
    {
        name: require('./manifest?experiment2.name'),
        id: require('./manifest?experiment2.id'),
        trigger: experiment2.trigger,
        variations: [
            {
                weight: 50,
                code: experiment2.variation0,
            },
            {
                weight: 50,
                code: experiment2.variation1
            }
        ]
    },
    {
        name: require('./manifest?experiment4.name'),
        id: require('./manifest?experiment4.id'),
        trigger: experiment4.trigger,
        variations: [
            {
                weight: 1,
                code: experiment4.variation0
            },
            {
                weight: 2,
                code: experiment4.variation1
            }
        ]
    }
];
