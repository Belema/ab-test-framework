'use strict';

const Jasmine = require('jasmine');
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

var runner = new Jasmine();

runner.loadConfig({
    spec_dir: './tests',
    spec_files: [
        '**/*.test?(s).js'
    ],
    helpers: [
        'helpers/**/*.js'
    ]
});

runner.env.clearReporters();
runner.addReporter(new SpecReporter({
    spec: {
        displayPending: true
    }
}));

runner.execute();
