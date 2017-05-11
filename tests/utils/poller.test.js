'use strict';

const poller = require('../../utils/poller');
const window = require('../../utils/window');

describe('utils/poller', function () {
    afterEach(function () {
        window(null);
    });

    describe('function poll(/* selectors, predicates = null, callback */)', function () {
        it('adds querySelectorAll polyfill to window.document if querySelectorAll does not exist', function () {
            const windowStub = {
                document: {}
            };

            window(windowStub);
            poller.poll([], () => {});

            expect(windowStub.document.querySelectorAll).toBeDefined();
        });

        it('does not add querySelectorAll polyfill to window.document if querySelectorAll already exists', function () {
            const querySelectorAll = () => [];

            const windowStub = {
                document: { querySelectorAll }
            };

            window(windowStub);
            poller.poll([], () => {});

            expect(windowStub.document.querySelectorAll).toBe(querySelectorAll);
        });

        it('invokes callback synchroneously if selector array is empty', function () {
            const querySelectorAll = () => [];
            const setTimeout = jasmine.createSpy('setTimeout');

            window({
                document: { querySelectorAll },
                setTimeout
            });

            const callback = jasmine.createSpy('callback');

            poller.poll([], callback);

            expect(callback).toHaveBeenCalled();
            expect(setTimeout).not.toHaveBeenCalled();
        });

        it('invokes callback synchroneously if elements are already present on the page', function () {
            const querySelectorAll = () => [{}];
            const setTimeout = jasmine.createSpy('setTimeout');

            window({
                document: { querySelectorAll },
                setTimeout
            });

            const callback = jasmine.createSpy('callback');

            poller.poll(['selector'], callback);

            expect(callback).toHaveBeenCalled();
            expect(setTimeout).not.toHaveBeenCalled();
        });

        it('does not invoke callback synchroneously if elements are not already present on the page', function () {
            const querySelectorAll = () => [];
            const setTimeout = jasmine.createSpy('setTimeout');

            window({
                document: { querySelectorAll },
                setTimeout
            });

            const callback = jasmine.createSpy('callback');

            poller.poll(['selector'], callback);

            expect(callback).not.toHaveBeenCalled();
            expect(setTimeout).toHaveBeenCalled();
        });

        it('inkoves callback (synchroneously) with the elements found', function () {
            const querySelectorAll = function (selector) {
                switch (selector) {
                    case 'selector1':
                        return [ {id: '1-1'} ];
                    case 'selector2':
                        return [ {id: '2-1'}, {id: '2-2'} ];
                    default:
                        return [];
                }
            };

            window({
                document: { querySelectorAll }
            });

            const callback = jasmine.createSpy('callback');

            poller.poll(['selector1', 'selector2'], callback);

            expect(callback).toHaveBeenCalledWith([ {id: '1-1'} ], [ {id: '2-1'}, {id: '2-2'} ]);
        });

        it('inkoves callback (asynchroneously) with the elements found', function () {
            const elements1 = [];
            const elements2 = [ {id: '2-1'}, {id: '2-2'} ];

            const querySelectorAll = function (selector) {
                switch (selector) {
                    case 'selector1':
                        return elements1;
                    case 'selector2':
                        return elements2;
                    default:
                        return [];
                }
            };

            const setTimeout = (cb) => elements1.push({id: '1-1'}) && cb();

            window({
                document: { querySelectorAll },
                setTimeout
            });

            const callback = jasmine.createSpy('callback');

            poller.poll(['selector1', 'selector2'], callback);

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith([ {id: '1-1'} ], [ {id: '2-1'}, {id: '2-2'} ]);
        });

        it('stops polling after 15 seconds (150 attempts) and write log message', function () {
            // This unit test is more readable in this synchroneous form,
            // but the cost is that it generates a 150 level deep call stack.
            let counter = 1;

            const querySelectorAll = () => [];
            const setTimeout = (cb) => counter++ && cb();
            const log = jasmine.createSpy('log');

            window({
                console: { log },
                document: { querySelectorAll },
                setTimeout
            });

            const callback = jasmine.createSpy('callback');

            poller.poll(['selector'], callback);

            expect(callback).not.toHaveBeenCalled();
            expect(counter).toBe(150);
            expect(log).toHaveBeenCalled();
        });

        it('can specify a given number of matching elements', function () {
            const elements1 = [ 1 ];
            const elements2 = [ 2 ];

            const querySelectorAll = function (selector) {
                switch (selector) {
                    case 'selector1':
                        return JSON.parse(JSON.stringify(elements1));
                    case 'selector2':
                        return JSON.parse(JSON.stringify(elements2));
                    default:
                        return [];
                }
            };

            const setTimeout = function (cb) {
                elements1.push(1);
                elements2.push(2);
                cb();
            };

            window({
                document: { querySelectorAll },
                setTimeout
            });

            const callback = jasmine.createSpy('callback');

            poller.poll([['selector1', 3], ['selector2', 5]], callback);

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith([1, 1, 1], [2, 2, 2, 2, 2]);
        });

        it('invokes the callback only after all predicates are simultaneously true, when an array of predicates is passed in', function () {
            const stack = [];

            const querySelectorAll = () => {};
            const setTimeout = jasmine.createSpy('setTimeout')
                                      .and.callFake((cb) => stack.push('x') && cb());

            window({
                document: { querySelectorAll },
                setTimeout
            });

            const predicate1 = () => stack.length && !(stack.length % 3);
            const predicate2 = () => stack.length && !(stack.length % 5);

            const callback = jasmine.createSpy('callback');

            poller.poll([], [predicate1, predicate2], callback);

            expect(setTimeout).toHaveBeenCalledTimes(15);
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith();
        });

        it('waits for all the selectors to be resolved, even when all the predicates are true', function () {
            const elements1 = [];
            const elements2 = [ {id: '2-0'}, {id: '2-1'} ];

            const querySelectorAll = function (selector) {
                switch (selector) {
                    case 'selector1':
                        return elements1;
                    case 'selector2':
                        return elements2;
                    default:
                        return [];
                }
            };

            const setTimeout = jasmine.createSpy('setTimeout')
                                      .and.callFake((cb) => elements1.push({id: `1-${elements1.length}`}) && cb());

            window({
                document: { querySelectorAll },
                setTimeout
            });

            const predicate1 = () => true;
            const predicate2 = () => true;

            const callback = jasmine.createSpy('callback');

            poller.poll([['selector1', 2], 'selector2'], [predicate1, predicate2], callback);

            expect(setTimeout).toHaveBeenCalledTimes(2);
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith([ {id: '1-0'}, {id: '1-1'} ], [ {id: '2-0'}, {id: '2-1'} ]);
        });

        it('waits for all the predicates to be true, even when all the selectors are resolved', function () {
            const stack = [];

            const querySelectorAll = () => [ {id: 'x'}, {id: 'y'} ];

            const setTimeout = jasmine.createSpy('setTimeout')
                                      .and.callFake((cb) => stack.push('0') && cb());

            window({
                document: { querySelectorAll },
                setTimeout
            });

            const predicate1 = () => stack.length && !(stack.length % 2);
            const predicate2 = () => stack.length && !(stack.length % 3);

            const callback = jasmine.createSpy('callback');

            poller.poll([['selector1', 2], 'selector2'], [predicate1, predicate2], callback);

            expect(setTimeout).toHaveBeenCalledTimes(6);
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith([ {id: 'x'}, {id: 'y'} ], [ {id: 'x'}, {id: 'y'} ]);
        });

        it('waits for all selectors to be resolved and for all the predicates to be true', function () {
            const stack = [];
            const elements = [];

            const querySelectorAll = () => elements;

            const setTimeout = jasmine.createSpy('setTimeout')
                                      .and.callFake((cb) => stack.push('0') && elements.push(elements.length) && cb());

            window({
                document: { querySelectorAll },
                setTimeout
            });

            const predicate = () => stack.length > 2;

            const callback = jasmine.createSpy('callback');

            poller.poll([['selector', 3]], [predicate], callback);

            expect(setTimeout).toHaveBeenCalledTimes(3);
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith([ 0, 1 , 2 ]);
        });
    });
});
