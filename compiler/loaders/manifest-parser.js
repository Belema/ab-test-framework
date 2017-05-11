'use strict';

module.exports = function (manifest) {
    this.cacheable();

    const parameters = this.request.split('?')[1].split('.');
    const name = parameters[0];
    const key = parameters[1];

    const experiments = JSON.parse(manifest);
    const value = experiments[name][key];

    return `module.exports = ${JSON.stringify(value)};`;
};
