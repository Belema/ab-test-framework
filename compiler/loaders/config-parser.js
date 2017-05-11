'use strict';

const loaderUtils = require('loader-utils');

function moduleAsText (object) {
    return `module.exports = ${JSON.stringify(object)};`;
}

module.exports = function (raw) {
    this.cacheable();
    const options = loaderUtils.getOptions(this);

    const config = JSON.parse(raw);

    if (config.metadata && config.metadata.framework === true) {
        Object.assign(config.analytics, options.analytics);
        Object.assign(config.storage, options.storage);
        return moduleAsText(config);
    }

    return moduleAsText({
        product: config.product,
        environment: config.environments[options.environment]
    });
};
