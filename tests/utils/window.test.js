'use strict';

describe('utils/window', function () {
    let window;

    beforeEach(function () {
        window = require('../../utils/window');
    });

    afterEach(function () {
        delete require.cache[require.resolve('../../utils/window')];
    });

    it('throws when value is requested from uninitialised module', function () {
        expect(() => window()).toThrow();
    });

    it('ignores values that are not of type object', function () {
        window(undefined);
        expect(() => window()).toThrow();

        window(null);
        expect(() => window()).toThrow();
    });

    it('returns object it is initialised with', function () {
        const value = {};
        window(value);

        expect(window()).toBe(value);
    });

    it('is deinitialised when set to a value that is not an object', function () {
        window({});
        expect(() => window()).not.toThrow();

        window(null);
        expect(() => window()).toThrow();
    });
});
