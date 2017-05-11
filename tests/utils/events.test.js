'use strict';

const events = require('../../utils/events');

describe('utils/events', function () {
    describe('function add(element, events, callback)', function () {
        it('invokes addEventListener() on the element if the function exists', function () {
            const element = {
                addEventListener: jasmine.createSpy('addEventListener'),
                attachEvent: jasmine.createSpy('attachEvent')
            };

            const callback = () => {};

            events.add(element, 'event', callback);

            expect(element.attachEvent).not.toHaveBeenCalled();
            expect(element.addEventListener).toHaveBeenCalledTimes(1);
            expect(element.addEventListener).toHaveBeenCalledWith('event', callback, false);
        });

        it('invokes attachEvent() on the element if addEventListener does not exist', function () {
            const element = {
                attachEvent: jasmine.createSpy('attachEvent')
            };

            const callback = () => {};

            events.add(element, 'event', callback);

            expect(element.attachEvent).toHaveBeenCalledTimes(1);
            expect(element.attachEvent).toHaveBeenCalledWith('onevent', callback);
        });

        it('does not call addEventListener() or attachEvent, when null events argument is passed in', function () {
            const element = {
                addEventListener: jasmine.createSpy('addEventListener'),
                attachEvent: jasmine.createSpy('attachEvent')
            };

            events.add(element, null, () => {});

            expect(element.attachEvent).not.toHaveBeenCalled();
            expect(element.addEventListener).not.toHaveBeenCalled();
        });

        it('can call addEventListener multiple times', function () {
            const element = {
                addEventListener: jasmine.createSpy('addEventListener'),
                attachEvent: jasmine.createSpy('attachEvent')
            };

            const callback = () => {};

            events.add(element, ['event1', 'event2'], callback);

            expect(element.attachEvent).not.toHaveBeenCalled();
            expect(element.addEventListener).toHaveBeenCalledTimes(2);
            expect(element.addEventListener).toHaveBeenCalledWith('event1', callback, false);
            expect(element.addEventListener).toHaveBeenCalledWith('event2', callback, false);
        });

        it('can call attachEvent multiple times', function () {
            const element = {
                attachEvent: jasmine.createSpy('attachEvent')
            };

            const callback = () => {};

            events.add(element, ['event1', 'event2'], callback);

            expect(element.attachEvent).toHaveBeenCalledTimes(2);
            expect(element.attachEvent).toHaveBeenCalledWith('onevent1', callback);
            expect(element.attachEvent).toHaveBeenCalledWith('onevent2', callback);
        });
    });
});
