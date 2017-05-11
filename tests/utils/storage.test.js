'use strict';

const window = require('../../utils/window');
const storage = require('../../utils/storage');

const atob = (input) => new Buffer(input, 'base64').toString();
const btoa = (input) => new Buffer(input).toString('base64');

describe('utils/storage', function () {
    afterEach(function () {
        window(null);
    });

    describe('function getFromLocalStorage(key)', function () {
        it('does not throw when window.localStorage throws', function () {
            window({
                document: {},
                get localStorage () { throw new Error('Illegal move'); }
            });

            expect(() => storage.getFromLocalStorage('key')).not.toThrow();
        });

        it('does use window.localStorage when available', function () {
            const dictionary = {};
            let documentCookieHasBeenRead = false;

            window({
                atob,
                document: {
                    get cookie () { documentCookieHasBeenRead = true; return ''; }
                },
                localStorage: {
                    setItem: (key, value) => dictionary[key] = value,
                    getItem: jasmine.createSpy('getItem').and.callFake((key) => dictionary[key])
                }
            });

            storage.getFromLocalStorage('key');

            expect(documentCookieHasBeenRead).toBe(false);
            expect(window().localStorage.getItem).toHaveBeenCalledWith('key');
        });

        it('does use cookies when window.localStorage is not available', function () {
            let documentCookieHasBeenRead = false;

            window({
                btoa,
                document: {
                    get cookie () { documentCookieHasBeenRead = true; return ''; }
                }
            });

            storage.getFromLocalStorage('key');

            expect(documentCookieHasBeenRead).toBe(true);
        });

        it('does use cookies when setItem throw errors (Safari private mode)', function () {
            let documentCookieHasBeenRead = false;

            window({
                btoa,
                document: {
                    get cookie () { documentCookieHasBeenRead = true; return ''; }
                },
                localStorage: {
                    setItem: function () { throw new Error('Cannot setItem in Safari private mode.'); }
                }
            });

            storage.getFromLocalStorage('key');

            expect(documentCookieHasBeenRead).toBe(true);
        });
    });

    describe('function setInLocalStorage(key, value)', function () {
        it('does not throw when window.localStorage throws', function () {
            window({
                btoa,
                document: {},
                get localStorage () { throw new Error('Illegal move'); }
            });

            expect(() => storage.setInLocalStorage('key', 'value')).not.toThrow();
        });

        it('does use window.localStorage when available', function () {
            const dictionary = {};
            let documentCookieHasBeenRead = false;

            window({
                document: {
                    get cookie () { documentCookieHasBeenRead = true; return ''; }
                },
                localStorage: {
                    setItem: jasmine.createSpy('setItem').and.callFake((key, value) => dictionary[key] = value),
                    getItem: (key) => dictionary[key]
                }
            });

            storage.setInLocalStorage('key', { name1: 'value', name2: 0, name3: null });

            expect(documentCookieHasBeenRead).toBe(false);
            expect(window().localStorage.setItem).toHaveBeenCalledWith('key', '{"name1":"value","name2":0,"name3":null}');
        });

        it('does use cookies when window.localStorage is not available', function () {
            window({
                btoa,
                document: { cookie: '' }
            });

            storage.setInLocalStorage('key', { name1: 'value', name2: 0, name3: null });

            expect(window().document.cookie).toContain(btoa('{"name1":"value","name2":0,"name3":null}'));
        });

        it('does use cookies when in Safari private mode (getItem & setItem throw errors)', function () {
            window({
                btoa,
                document: {
                    cookie: ''
                },
                localStorage: {
                    getItem: function () { throw new Error('Cannot getItem in Safari private mode.'); },
                    setItem: function () { throw new Error('Cannot setItem in Safari private mode.'); },
                    removeItem: function () { throw new Error('Cannot removeItem in Safari private mode.'); }
                }
            });

            storage.setInLocalStorage('key', { name1: 'nom1', name2: -7, name3: null });

            expect(window().document.cookie).toContain(btoa('{"name1":"nom1","name2":-7,"name3":null}'));
        });
    });

    describe('functions getFromLocalStorage(key) & setInLocalStorage(key, value)', function () {
        it('allows to store and retrieve values (with localStorage)', function () {
            const dictionary = {};

            window({
                localStorage: {
                    setItem: (key, value) => dictionary[key] = value,
                    getItem: (key) => dictionary[key]
                }
            });

            const originalData = {
                prop1: 'value',
                prop2: 0,
                prop3: null
            };

            storage.setInLocalStorage('key', originalData);

            expect(storage.getFromLocalStorage('key')).toEqual(originalData);
        });

        it('allows to store and retrieve values (without localStorage)', function () {
            let documentCookie = '';

            window({
                atob,
                btoa,
                document: {
                    set cookie (value) { documentCookie = value; },
                    get cookie () { return documentCookie; }
                }
            });

            const originalData = {
                prop4: 'eulav',
                prop5: 0,
                prop6: null
            };

            storage.setInLocalStorage('key', originalData);

            expect(storage.getFromLocalStorage('key')).toEqual(originalData);
        });
    });

    describe('function getFromSessionStorage(key)', function () {
        it('does not throw when window.sessionStorage throws', function () {
            window({
                document: {},
                get sessionStorage () { throw new Error('Illegal move'); }
            });

            expect(() => storage.getFromSessionStorage('key')).not.toThrow();
        });

        it('does use window.sessionStorage when available', function () {
            const dictionary = {};
            let documentCookieHasBeenRead = false;

            window({
                atob,
                document: {
                    get cookie () { documentCookieHasBeenRead = true; return ''; }
                },
                sessionStorage: {
                    setItem: (key, value) => dictionary[key] = value,
                    getItem: jasmine.createSpy('getItem').and.callFake((key) => dictionary[key])
                }
            });

            storage.getFromSessionStorage('key');

            expect(documentCookieHasBeenRead).toBe(false);
            expect(window().sessionStorage.getItem).toHaveBeenCalledWith('key');
        });

        it('does use cookies when window.sessionStorage is not available', function () {
            let documentCookieHasBeenRead = false;

            window({
                btoa,
                document: {
                    get cookie () { documentCookieHasBeenRead = true; return ''; }
                }
            });

            storage.getFromSessionStorage('key');

            expect(documentCookieHasBeenRead).toBe(true);
        });

        it('does use cookies when setItem throw errors (Safari private mode)', function () {
            let documentCookieHasBeenRead = false;

            window({
                btoa,
                document: {
                    get cookie () { documentCookieHasBeenRead = true; return ''; }
                },
                getFromSessionStorage: {
                    setItem: function () { throw new Error('Cannot setItem in Safari private mode.'); }
                }
            });

            storage.getFromSessionStorage('key');

            expect(documentCookieHasBeenRead).toBe(true);
        });

        it('does not throw when window.sessionStorage has length property but no getItem/setItem functions', function () {
            window({
                document: {},
                sessionStorage: { length: 0 }
            });

            expect(storage.getFromSessionStorage('whatever')).toBe(null);
        });

        it('returns null when window.sessionStorage & document.cookie are undefined', function () {
            window({
                document: {}
            });

            expect(storage.getFromSessionStorage('key')).toBe(null);
        });
    });

    describe('function setInSessionStorage(key, value)', function () {
        it('does not throw when window.sessionStorage throws', function () {
            window({
                btoa,
                document: {},
                get sessionStorage () { throw new Error('Illegal move'); }
            });

            expect(() => storage.setInSessionStorage('key', 'value')).not.toThrow();
        });

        it('does use window.sessionStorage when available', function () {
            const dictionary = {};
            let documentCookieHasBeenRead = false;

            window({
                document: {
                    get cookie () { documentCookieHasBeenRead = true; return ''; }
                },
                sessionStorage: {
                    setItem: jasmine.createSpy('setItem').and.callFake((key, value) => dictionary[key] = value),
                    getItem: (key) => dictionary[key]
                }
            });

            storage.setInSessionStorage('key', { name1: 'value', name2: 0, name3: null });

            expect(documentCookieHasBeenRead).toBe(false);
            expect(window().sessionStorage.setItem).toHaveBeenCalledWith('key', '{"name1":"value","name2":0,"name3":null}');
        });

        it('does use cookies when window.sessionStorage is not available', function () {
            window({
                btoa,
                document: { cookie: '' }
            });

            storage.setInSessionStorage('key', { name1: 'value', name2: 0, name3: null });

            expect(window().document.cookie).toContain(btoa('{"name1":"value","name2":0,"name3":null}'));
        });

        it('does use cookies when in Safari private mode (getItem & setItem throw errors)', function () {
            window({
                btoa,
                document: {
                    cookie: ''
                },
                sessionStorage: {
                    getItem: function () { throw new Error('Cannot getItem in Safari private mode.'); },
                    setItem: function () { throw new Error('Cannot setItem in Safari private mode.'); },
                    removeItem: function () { throw new Error('Cannot removeItem in Safari private mode.'); }
                }
            });

            storage.setInSessionStorage('key', { name1: 'nom1', name2: -7, name3: null });

            expect(window().document.cookie).toContain(btoa('{"name1":"nom1","name2":-7,"name3":null}'));
        });

        it('does use cookies when window.sessionStorage is empty object', function () {
            let documentCookieHasBeenSet = false;

            window({
                btoa,
                sessionStorage: { },
                document: {
                    get cookie () {  return ''; },
                    set cookie (value) { documentCookieHasBeenSet = true; }
                }
            });

            storage.setInSessionStorage('bbc', 'breakfast');
            expect(documentCookieHasBeenSet).toBe(true);
        });
    });

    describe('functions getFromSessionStorage(key) & setInSessionStorage(key, value) combination', function () {
        it('allows to store and retrieve values (with sessionStorage)', function () {
            const dictionary = {};

            window({
                sessionStorage: {
                    setItem: (key, value) => dictionary[key] = value,
                    getItem: (key) => dictionary[key]
                }
            });

            const originalData = {
                prop1: 'value',
                prop2: 0,
                prop3: null
            };

            storage.setInSessionStorage('key', originalData);

            expect(storage.getFromSessionStorage('key')).toEqual(originalData);
        });

        it('allows to store and retrieve values (without sessionStorage)', function () {
            let documentCookie = '';

            window({
                atob,
                btoa,
                document: {
                    set cookie (value) { documentCookie = value; },
                    get cookie () { return documentCookie; }
                }
            });

            const originalData = {
                prop4: 'eulav',
                prop5: 0,
                prop6: null
            };

            storage.setInSessionStorage('key', originalData);

            expect(storage.getFromSessionStorage('key')).toEqual(originalData);
        });
    });

    describe('function getCookie(key)', function () {
        it('fetches the correct value from the correct key', function () {
            const cookieValue = btoa(JSON.stringify('hello-m8'));
            const cookie = `nuk_test=${cookieValue}`;

            window({
                atob,
                document: {
                    get cookie () { return cookie; }
                }
            });

            expect(storage.getCookie('nuk_test')).toEqual('hello-m8');
        });

        it('fetches the correct value from the correct key when there are multiple keys', function () {
            const cookieValue1 = btoa(JSON.stringify('hello-m8'));
            const cookieValue2 = btoa(JSON.stringify('goodbye-m8'));
            const cookieValue3 = btoa(JSON.stringify('or8-m8'));
            const cookie = `nuk_test1=${cookieValue1}; nuk_test2=${cookieValue2}; nuk_test3=${cookieValue3};`;

            window({
                atob,
                document: {
                    get cookie () { return cookie; }
                }
            });

            expect(storage.getCookie('nuk_test2')).toEqual('goodbye-m8');
        });

        it('returns null when the key is not available', function () {
            const cookieValue1 = btoa(JSON.stringify('hello-m8'));
            const cookieValue2 = btoa(JSON.stringify('or8-m8'));
            const cookie = `nuk_test1=${cookieValue1}; nuk_test2=${cookieValue2};`;

            window({
                atob,
                document: {
                    get cookie () { return cookie; }
                }
            });

            expect(storage.getCookie('nuk_test3')).toEqual(null);
        });
    });

    describe('function setCookie(key, value, options)', function () {
        it('sets the cookie correctly', function () {
            const cookieValue1 = btoa(JSON.stringify('hello-m8'));
            const cookieValue2 = btoa(JSON.stringify('or8-m8'));
            let cookie = `nuk_test1=${cookieValue1}; nuk_test2=${cookieValue2};`;

            window({
                atob,
                btoa,
                document: {
                    get cookie () { return cookie; },
                    set cookie (value) { cookie = value; }
                }
            });

            storage.setCookie('nuk_test', 'woohoo');
            expect(cookie).toEqual('nuk_test=' + window().btoa('"woohoo"'));
        });

        it('overwrites the value if the key already exists', function () {
            const cookieValue1 = btoa(JSON.stringify('hello-m8'));
            const cookieValue2 = btoa(JSON.stringify('or8-m8'));
            let cookie = `nuk_test1=${cookieValue1}; nuk_test2=${cookieValue2};`;

            window({
                atob,
                btoa,
                document: {
                    get cookie () { return cookie; },
                    set cookie (value) { cookie = value; }
                }
            });

            storage.setCookie('nuk_test1', 'm8-m8');
            expect(cookie).toEqual('nuk_test1=' + window().btoa('"m8-m8"'));
        });

        it('calls set cookie with correctly built options', function () {
            window({
                atob,
                btoa,
                document: {
                    foo: function (value) {
                        return value;
                    },
                    set cookie (value) {
                        this.foo(value);
                    }
                }
            });

            const setterSpy = spyOn(window().document, 'foo');
            const encodedValue = window().btoa('"woohoo"');

            storage.setCookie('nuk_test', 'woohoo', {
                path: '/',
                expires: 'Tue, 31 Dec 2999 23:59:59 GMT'
            });

            expect(setterSpy).toHaveBeenCalledWith('nuk_test=' + encodedValue + ';path=/;expires=Tue, 31 Dec 2999 23:59:59 GMT');
        });
    });

    describe('functions getCookie(key) and setCookie(key, value, options)', function () {
        it('retrieves the correct value after storing it when there is only one key', function () {
            let cookie = '';

            window({
                atob,
                btoa,
                document: {
                    get cookie () { return cookie; },
                    set cookie (value) { cookie = value; }
                }
            });

            storage.setCookie('nuk_test', 'woohoo');
            expect(storage.getCookie('nuk_test')).toEqual('woohoo');
        });

        it('retrieves the correct value after storing it when there is multiple keys', function () {
            const cookieValue1 = btoa(JSON.stringify('hello-m8'));
            const cookieValue2 = btoa(JSON.stringify('or8-m8'));
            let cookie = `nuk_test1=${cookieValue1}; nuk_test2=${cookieValue2};`;

            window({
                atob,
                btoa,
                document: {
                    get cookie () { return cookie; },
                    set cookie (value) { cookie = value; }
                }
            });

            storage.setCookie('nuk_test2', 'woohoo');
            expect(storage.getCookie('nuk_test2')).toEqual('woohoo');
        });
    });
});
