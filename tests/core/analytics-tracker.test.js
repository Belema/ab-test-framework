'use strict';

const config = require('../../config');
const window = require('../../utils/window');
const analytics = require('../../core/analytics-tracker');

describe('core/analytics-tracker', function () {
    beforeEach(function () {
        config.analytics.prefix = 'C';
        window({
            document: {}
        });
    });

    afterEach(function () {
        config.analytics.prefix = null;
        window(null);
    });

    describe('function trackError()', function () {
        it(`appends '(error)' to the variable ${config.analytics.variable} when it aleady has a value`, function () {
            window()[config.analytics.variable] = 'variable-content';
            analytics.trackError();
            expect(window()[config.analytics.variable]).toEqual('variable-content(error)');
        });

        it(`assigns '(error)' to the variable ${config.analytics.variable} when it is undefined`, function () {
            analytics.trackError();
            expect(window()[config.analytics.variable]).toEqual('(error)');
        });

        it(`assigns '(error)' to the variable ${config.analytics.variable} when it is empty`, function () {
            analytics.trackError();
            expect(window()[config.analytics.variable]).toEqual('(error)');
        });

        it(`assigns to the variable ${config.analytics.error}, the stack of the error passed in`, function () {
            analytics.trackError({ stack: 'Error stack trace'});
            expect(window()[config.analytics.error]).toEqual('Error stack trace');
        });

        it(`removes redundant tabs of stack in the variable ${config.analytics.error}`, function () {
            analytics.trackError({ stack: 'Error\n\tstack\n trace'});
            expect(window()[config.analytics.error]).toEqual('Error\nstack\ntrace');
        });

        it(`assigns to the variable ${config.analytics.error}, the message of the error passed when it does not have a stack`, function () {
            analytics.trackError({ message: 'Error message' });
            expect(window()[config.analytics.error]).toBe('Error message');
        });

        it(`does not assign to the variable ${config.analytics.error}, when no error is passed in`, function () {
            analytics.trackError();
            expect(window()[config.analytics.error]).toBe(undefined);
        });

        it(`does not assign to the variable ${config.analytics.error}, when error passed in has not stack and no message`, function () {
            analytics.trackError({});
            expect(window()[config.analytics.error]).toBe(undefined);
        });
    });

    describe('function addTrackingVariable(selectedVariations)', function () {
        it(`assigns an empty string to the variable ${config.analytics.variable} when selected variations is null`, function () {
            let variations = null;
            analytics.addTrackingVariable(variations);
            expect(window()[config.analytics.variable]).toEqual('');
        });

        it(`assigns an empty string to the variable ${config.analytics.variable} when selected variations is empty`, function () {
            let variations = [];
            analytics.addTrackingVariable(variations);
            expect(window()[config.analytics.variable]).toEqual('');
        });

        it(`assigns correct value to the variable ${config.analytics.variable} when selected variations has one experiment`, function () {
            let variations = [{experimentIdentifier: 1, variationIndex: 0}];
            analytics.addTrackingVariable(variations);
            expect(window()[config.analytics.variable]).toEqual('C1:0');
        });

        it(`assigns correct value to the variable ${config.analytics.variable} when selected variations has two experiments`, function () {
            let variations = [{experimentIdentifier: 1, variationIndex: 2}, {experimentIdentifier: 2, variationIndex: 1}];
            analytics.addTrackingVariable(variations);
            expect(window()[config.analytics.variable]).toEqual('C1:2-C2:1');
        });

        it(`assigns to the variable ${config.analytics.variable} values in alphabetical order`, function () {
            let variations = [{experimentIdentifier: 7, variationIndex: 3}, {experimentIdentifier: 4, variationIndex: 9}];
            analytics.addTrackingVariable(variations);
            expect(window()[config.analytics.variable]).toEqual('C4:9-C7:3');
        });

        it(`throws an error when the selected variations is badly formed (identifier is not a number)`, function () {
            let variations = [{experimentIdentifier: '1', variationIndex: 0}];
            expect(() => analytics.addTrackingVariable(variations)).toThrow();
        });

        it(`throws an error when the selected variations is badly formed (index is not a number)`, function () {
            let variations = [{experimentIdentifier: 1, variationIndex: '0'}];
            expect(() => analytics.addTrackingVariable(variations)).toThrow();
        });
    });
});
