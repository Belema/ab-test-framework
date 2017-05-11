'use strict';

const segmentation = require('../../core/segmentation');

const randomFake = () => randomFake.value;
const truePredicate = (callback) => callback();
const falsePredicate = () => void(0);

function generateExperiments (experiments) {
    return experiments.map((experiment) => ({
        id: experiment.id,
        trigger: experiment.trigger,
        variations: [
            { index: 0, weight: 1 },
            { index: 1, weight: 2 },
            { index: 2, weight: 3 },
            { index: 3, weight: 4 },
        ]
    }));
}

describe('core/segmentation', function () {
    describe('function variations(experiments, allocations)', function () {
        beforeEach(function () {
            randomFake.value = 0;
            spyOn(Math, 'random').and.callFake(randomFake);
        });

        it('throws when experiments argument passed in is null', function () {
            expect(() => segmentation.variations(null, {})).toThrow();
        });

        it('throws when allocations argument passed in is null', function () {
            expect(() => segmentation.variations([], null)).toThrow();
        });

        it('returns allocation from object passed in if there is an allocation for the given experiment', function () {
            const experiments = generateExperiments([ {id: 3, trigger: truePredicate} ]);

            let allocations = {'3': 2};
            let output = segmentation.variations(experiments, allocations);

            expect(Math.random).not.toHaveBeenCalled();
            expect(allocations).toEqual({'3': 2});
            expect(output).toEqual([{
                experimentIdentifier: 3,
                variationIndex: 2,
                trigger: truePredicate,
                data: experiments[0].variations[2]
            }]);
        });

        it('creates a random allocation when there are no existing allocation for a given experiment', function () {
            const experiments = generateExperiments([ {id: 7, trigger: truePredicate} ]);

            const expectedVariationIndex = function (randomValue) {
                if (randomValue < 0.1) {
                    return 0;
                }
                if (randomValue < 0.3) {
                    return 1;
                }
                if (randomValue < 0.6) {
                    return 2;
                }
                return 3;
            };

            for (let i = 0; i < 21; i++) {
                randomFake.value = i / 20;
                let expectedVariation = expectedVariationIndex(randomFake.value);

                let allocations = {};
                let output = segmentation.variations(experiments, allocations);

                expect(Math.random).toHaveBeenCalled();
                expect(allocations).toEqual({'7': expectedVariation});
                expect(output).toEqual([{
                    experimentIdentifier: 7,
                    variationIndex: expectedVariation,
                    trigger: truePredicate,
                    data: experiments[0].variations[expectedVariation]
                }]);
            }
        });

        it('handles experiments that are not triggered', function () {
            const experiments = generateExperiments([ {id: 5, trigger: falsePredicate} ]);

            let allocations = {};
            let output = segmentation.variations(experiments, allocations);

            expect(Math.random).toHaveBeenCalled();
            expect(allocations).toEqual({'5': 0});
            expect(output).toEqual([{
                experimentIdentifier: 5,
                variationIndex: 0,
                trigger: falsePredicate,
                data: experiments[0].variations[0]
            }]);
        });

        it('creates allocations only for the experiments that are not already allocated', function () {
            const experiments = generateExperiments([
                {id: 31, trigger: truePredicate},
                {id: 41, trigger: falsePredicate},
                {id: 59, trigger: truePredicate},
                {id: 26, trigger: falsePredicate}
            ]);

            const allocations = {
                '97': 0,
                '31': 3,
                '41': 2
            };

            randomFake.value = 0.25;
            let output = segmentation.variations(experiments, allocations);

            expect(allocations).toEqual({
                '97': 0,
                '31': 3,
                '41': 2,
                '59': 1,
                '26': 1
            });

            expect(output).toEqual([
                {experimentIdentifier: 31, variationIndex: 3, trigger: truePredicate, data: experiments[0].variations[3]},
                {experimentIdentifier: 41, variationIndex: 2, trigger: falsePredicate, data: experiments[1].variations[2]},
                {experimentIdentifier: 59, variationIndex: 1, trigger: truePredicate, data: experiments[2].variations[1]},
                {experimentIdentifier: 26, variationIndex: 1, trigger: falsePredicate, data: experiments[3].variations[1]}
            ]);
        });
    });
});
