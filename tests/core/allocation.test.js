'use strict';

const allocation = require('../../core/allocation');
const window = require('../../utils/window');

describe('core/allocation', function () {
    describe('mergeHashValues(allocations)', function () {
        it('returns clone of input when hash is undefined', function () {
            window({ location: {} });

            const input = {};
            const output = allocation.mergeHashValues(input);

            expect(output).toEqual(input);
        });

        it('does not modify the input in place', function () {
            window({ location: {} });

            const input = {};
            const output = allocation.mergeHashValues(input);

            expect(output).not.toBe(input);
        });

        it('returns clone of input when hash is null', function () {
            window({ location: { hash: null } });

            const input = {};
            const output = allocation.mergeHashValues(input);

            expect(output).toEqual(input);
        });

        it('returns clone of input when hash is empty', function () {
            window({ location: { hash: '' } });

            const input = {};
            const output = allocation.mergeHashValues(input);

            expect(output).toEqual(input);
        });

        it('returns clone of input when hash does not have mvt hash parameter', function () {
            window({ location: { hash: '#foo=bar' }, decodeURIComponent: decodeURIComponent });

            const input = {};
            const output = allocation.mergeHashValues(input);

            expect(output).toEqual(input);
        });

        it('returns clone of input when hash has empty mvt hash parameter', function () {
            window({ location: { hash: '#mvt=' }, decodeURIComponent: decodeURIComponent });

            const input = {};
            const output = allocation.mergeHashValues(input);

            expect(output).toEqual({});
        });

        it('returns clone of input when hash has invalid mvt hash parameter', function () {
            window({
                location: { hash: '#mvt=1.1-2' },
                console: { log: jasmine.createSpy('log') },
                decodeURIComponent: decodeURIComponent
            });

            const input = {};
            const output = allocation.mergeHashValues(input);

            expect(output).toEqual({});
        });

        it('writes a message to the console when hash has invalid mvt hash parameter', function () {
            window({
                location: { hash: '#mvt=1.1-2' },
                console: { log: jasmine.createSpy('log') },
                decodeURIComponent: decodeURIComponent
            });

            const input = {};
            const output = allocation.mergeHashValues(input);

            expect(output).toEqual({});
            expect(window().console.log).toHaveBeenCalledTimes(1);
        });

        it('returns cominbation of input and values from the hash when hash has one value', function () {
            window({
                location: { hash: '#mvt=2.3' },
                parseInt: parseInt,
                decodeURIComponent: decodeURIComponent
            });

            const input = {};
            const output = allocation.mergeHashValues(input);

            expect(output).toEqual({ '2': 3 });
        });

        it('returns cominbation of input and values from the hash when hash has more than one value', function () {
            window({
                location: { hash: '#mvt=2.4-3.27-18.0' },
                parseInt: parseInt,
                decodeURIComponent: decodeURIComponent
            });

            const input = {};
            const output = allocation.mergeHashValues(input);

            expect(output).toEqual({ '2': 4, '3': 27, '18': 0 });
        });

        it('returns values from the hash over values from the input', function () {
            window({
                location: { hash: '#mvt=4.16-3.9' },
                parseInt: parseInt,
                decodeURIComponent: decodeURIComponent
            });

            const input = { '2': 4, '4': 8 };
            const output = allocation.mergeHashValues(input);

            expect(output).toEqual({ '2': 4, '3': 9, '4': 16 });
        });
    });
});
