/* global window */
/* eslint-disable strict */

(function (window) {
    require('../utils/window')(window);

    var runner = require('../core/experiment-runner');

    var experiments = require(EXPERIMENT_ENTRY_FILE);

    runner.run(experiments);
})(window);
