'use strict';

const frameworkPackage = require('../../package.json');
const examplePackage = require('../../example/package.json');

describe('example/package.json', function () {
    it('should refer to the current name of the package', function () {
        const frameworkName = frameworkPackage.name;
        const exampleDevDependencies = examplePackage.devDependencies;

        expect(exampleDevDependencies[frameworkName]).toBeDefined();
    });

    it('should use the current version of the package', function () {
        const frameworkName = frameworkPackage.name;
        const frameworkVersion = frameworkPackage.version;
        const exampleDependencyVersion = examplePackage.devDependencies[frameworkName];

        expect(exampleDependencyVersion).toEqual(frameworkVersion);
    });
});
