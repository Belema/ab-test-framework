'use strict';

const location = require('../../utils/location');
const window = require('../../utils/window');

describe('utils/location', function () {
    afterEach(function () {
        window(null);
    });

    describe('function hasHashKey(key)', function () {
        it('returns false when the location has no hash', function () {
            window({ location: {}, decodeURIComponent: decodeURIComponent });
            expect(location.hasHashKey('key')).toBe(false);
        });

        it('returns false when the hash is null', function () {
            window({ location: { hash: null }, decodeURIComponent: decodeURIComponent });
            expect(location.hasHashKey('key')).toBe(false);
        });

        it('returns false when the hash is empty', function () {
            window({ location: { hash: '' }, decodeURIComponent: decodeURIComponent });
            expect(location.hasHashKey('key')).toBe(false);
        });

        it('returns true when the hash is the key', function () {
            window({ location: { hash: 'blah' }, decodeURIComponent: decodeURIComponent });
            expect(location.hasHashKey('blah')).toBe(true);
        });

        it('returns true when the hash is the key (with leading #)', function () {
            window({ location: { hash: '#beep' }, decodeURIComponent: decodeURIComponent });
            expect(location.hasHashKey('beep')).toBe(true);
        });

        it('returns false when the hash is longer than the key', function () {
            window({ location: { hash: 'kkeeyy' }, decodeURIComponent: decodeURIComponent });
            expect(location.hasHashKey('kkeey')).toBe(false);
        });

        it('returns true when the hash contains the passed in key as a key', function () {
            window({ location: { hash: 'little=sir&echo' }, decodeURIComponent: decodeURIComponent });
            expect(location.hasHashKey('echo')).toBe(true);
        });

        it('returns true when the hash contains the passed in key as a key (with leading #)', function () {
            window({ location: { hash: '#little=miss&sunshine' }, decodeURIComponent: decodeURIComponent });
            expect(location.hasHashKey('little')).toBe(true);
        });

        it('returns false when the hash contains the passed in key as a value', function () {
            window({ location: { hash: '#little=miss&sunshine' }, decodeURIComponent: decodeURIComponent });
            expect(location.hasHashKey('miss')).toBe(false);
        });
    });

    describe('function getHashValue(key)', function () {
        it('returns null when the location has no hash', function () {
            window({ location: {}, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('key')).toBe(null);
        });

        it('returns null when the hash is null', function () {
            window({ location: { hash: null }, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('key')).toBe(null);
        });

        it('returns null when the hash is empty', function () {
            window({ location: { hash: '' }, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('key')).toBe(null);
        });

        it('returns value when the hash contains only key & value', function () {
            window({ location: { hash: 'hello=kitty' }, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('hello')).toBe('kitty');
        });

        it('returns value when the hash contains only key & value (with leading #)', function () {
            window({ location: { hash: '#john=doe' }, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('john')).toBe('doe');
        });

        it('returns null when the key is not in the hash', function () {
            window({ location: { hash: 'mr=boombastic' }, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('shaggy')).toBe(null);
        });

        it('returns value when the key is the first of two key/value pairs', function () {
            window({ location: { hash: 'ping=pong&table=tennis' }, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('ping')).toBe('pong');
        });

        it('returns value when the key is the first of two key/value pairs (with leading #)', function () {
            window({ location: { hash: '#feng=shui&yin=yang' }, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('feng')).toBe('shui');
        });

        it('returns value when the key is the last of two key/value pairs', function () {
            window({ location: { hash: 'look=up&hash=table' }, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('hash')).toBe('table');
        });

        it('returns value when the key is the last of two key/value pairs (with leading #)', function () {
            window({ location: { hash: '#motorcycle=bike&automobile=car' }, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('automobile')).toBe('car');
        });

        it('returns complex values correctly', function () {
            window({ location: { hash: 'mvt=1.0-3.1-5.0' }, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('mvt')).toBe('1.0-3.1-5.0');
        });

        it('returns complex values correctly (with leading #)', function () {
            window({ location: { hash: '#mvt=2.1-4.0-6.1' }, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('mvt')).toBe('2.1-4.0-6.1');
        });

        it('handles space characters', function () {
            window({ location: { hash: 'space=c r a f t' }, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('space')).toBe('c r a f t');
        });

        it('handles space characters (with leading #)', function () {
            window({ location: { hash: '#star=s h i p' }, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('star')).toBe('s h i p');
        });

        it('handles space characters encoded with %20', function () {
            window({ location: { hash: 'psg=paris%20saint%20germain' }, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('psg')).toBe('paris saint germain');
        });

        it('handles space characters encoded with %20 (with leading #)', function () {
            window({ location: { hash: '#mario=the%20plumber' }, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('mario')).toBe('the plumber');
        });

        it('handles space characters encoded with +', function () {
            window({ location: { hash: 'car=bla+bla' }, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('car')).toBe('bla bla');
        });

        it('handles space characters encoded with + (with leadin #)', function () {
            window({ location: { hash: '#quote=compare+the+meerkat' }, decodeURIComponent: decodeURIComponent });
            expect(location.getHashValue('quote')).toBe('compare the meerkat');
        });
    });

    describe('function getQueryValue(key)', function () {
        it('returns null when the location has no search', function () {
            window({ location: {}, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('key')).toBe(null);
        });

        it('returns null when the search is null', function () {
            window({ location: { search: null }, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('key')).toBe(null);
        });

        it('returns null when the search is empty', function () {
            window({ location: { search: '' }, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('key')).toBe(null);
        });

        it('returns value when the search contains only key & value', function () {
            window({ location: { search: 'hello=kitty' }, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('hello')).toBe('kitty');
        });

        it('returns value when the search contains only key & value (with leading ?)', function () {
            window({ location: { search: '?john=doe' }, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('john')).toBe('doe');
        });

        it('returns null when the key is not in the search', function () {
            window({ location: { search: 'mr=boombastic' }, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('shaggy')).toBe(null);
        });

        it('returns value when the key is the first of two key/value pairs', function () {
            window({ location: { search: 'ping=pong&table=tennis' }, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('ping')).toBe('pong');
        });

        it('returns value when the key is the first of two key/value pairs (with leading ?)', function () {
            window({ location: { search: '?feng=shui&yin=yang' }, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('feng')).toBe('shui');
        });

        it('returns value when the key is the last of two key/value pairs', function () {
            window({ location: { search: 'look=up&hash=table' }, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('hash')).toBe('table');
        });

        it('returns value when the key is the last of two key/value pairs (with leading ?)', function () {
            window({ location: { search: '?motorcycle=bike&automobile=car' }, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('automobile')).toBe('car');
        });

        it('returns complex values correctly', function () {
            window({ location: { search: 'mvt=1.0-3.1-5.0' }, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('mvt')).toBe('1.0-3.1-5.0');
        });

        it('returns complex values correctly (with leading ?)', function () {
            window({ location: { search: '?mvt=2.1-4.0-6.1' }, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('mvt')).toBe('2.1-4.0-6.1');
        });

        it('handles space characters', function () {
            window({ location: { search: 'space=c r a f t' }, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('space')).toBe('c r a f t');
        });

        it('handles space characters (with leading ?)', function () {
            window({ location: { search: '?star=s h i p' }, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('star')).toBe('s h i p');
        });

        it('handles space characters encoded with %20', function () {
            window({ location: { search: 'psg=paris%20saint%20germain' }, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('psg')).toBe('paris saint germain');
        });

        it('handles space characters encoded with %20 (with leading ?)', function () {
            window({ location: { search: '?mario=the%20plumber' }, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('mario')).toBe('the plumber');
        });

        it('handles space characters encoded with +', function () {
            window({ location: { search: 'car=bla+bla' }, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('car')).toBe('bla bla');
        });

        it('handles space characters encoded with + (with leadin ?)', function () {
            window({ location: { search: '?quote=compare+the+meerkat' }, decodeURIComponent: decodeURIComponent });
            expect(location.getQueryValue('quote')).toBe('compare the meerkat');
        });
    });

    describe('function isAbTestDisabled()', function () {
        const disabledCases = [
            'disable_ab_tests',
            '#disable_ab_tests',
            'disable_ab_tests&lunch',
            '#disable_ab_tests&lunch',
            'disable_ab_tests&lunch=pret',
            '#disable_ab_tests&lunch=pret',
            'lunch&disable_ab_tests',
            '#lunch&disable_ab_tests',
            'lunch=&disable_ab_tests',
            '#lunch=&disable_ab_tests',
            'lunch=pret&disable_ab_tests',
            '#lunch=pret&disable_ab_tests',
            'lunch=pret&disable_ab_tests&keep',
            '#lunch=pret&disable_ab_tests&keep',
            'lunch=pret&disable_ab_tests&keep=cool',
            '#lunch=pret&disable_ab_tests&keep=cool',
            'debug_ab_tests&disable_ab_tests',
            'disable_ab_tests&debug_ab_tests',
            'disable_ab_tests=',
            '#disable_ab_tests='
        ];

        const enabledCases = [
            null,
            '',
            '#',
            'ddisable_ab_tests',
            'disable_ab_testss',
            '#ddisable_ab_tests',
            '#disable_ab_testss',
            'Disable_ab_tests',
            '#disable_Ab_tests',
            '?disable_ab_tests',
            'please=disable_ab_tests',
            'debug_ab_tests',
        ];

        disabledCases.forEach(function (disabledCase) {
            it(`should return true when hash is ${JSON.stringify(disabledCase)}`, function () {
                window({ location: { hash: disabledCase } });

                expect(location.isAbTestDisabled()).toBe(true);
            });
        });

        enabledCases.forEach(function (enabledCase) {
            it(`should return false when hash is ${JSON.stringify(enabledCase)}`, function () {
                window({ location: { hash: enabledCase } });

                expect(location.isAbTestDisabled()).toBe(false);
            });
        });
    });

    describe('function isDebugEnabled()', function () {
        const enabledCases = [
            'debug_ab_tests',
            '#debug_ab_tests',
            'debug_ab_tests&lunch',
            '#debug_ab_tests&lunch',
            'debug_ab_tests&lunch=pret',
            '#debug_ab_tests&lunch=pret',
            'lunch&debug_ab_tests',
            '#lunch&debug_ab_tests',
            'lunch=&debug_ab_tests',
            '#lunch=&debug_ab_tests',
            'lunch=pret&debug_ab_tests',
            '#lunch=pret&debug_ab_tests',
            'lunch=pret&debug_ab_tests&keep',
            '#lunch=pret&debug_ab_tests&keep',
            'lunch=pret&debug_ab_tests&keep=cool',
            '#lunch=pret&debug_ab_tests&keep=cool',
            'debug_ab_tests&disable_ab_tests',
            'disable_ab_tests&debug_ab_tests',
            'debug_ab_tests=',
            '#debug_ab_tests='
        ];

        const disabledCases = [
            null,
            '',
            '#',
            'ddebug_ab_tests',
            'debug_ab_testss',
            '#ddebug_ab_tests',
            '#debug_ab_testss',
            'Debug_ab_tests',
            '#debug_Ab_tests',
            '?debug_ab_tests',
            'please=debug_ab_tests',
            'disable_ab_tests',
        ];

        enabledCases.forEach(function (enabledCase) {
            it(`should return true when hash is ${JSON.stringify(enabledCase)}`, function () {
                window({ location: { hash: enabledCase } });

                expect(location.isDebugEnabled()).toBe(true);
            });
        });

        disabledCases.forEach(function (disabledCase) {
            it(`should return false when hash is ${JSON.stringify(disabledCase)}`, function () {
                window({ location: { hash: disabledCase } });

                expect(location.isDebugEnabled()).toBe(false);
            });
        });
    });
});
