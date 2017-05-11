'use strict';

const packageName = require('../package').name;

const fs = require('graceful-fs');
const path = require('path');
const rimraf = require('rimraf');

const rootPath = path.resolve(__dirname, `../`);
const linkPath = path.resolve(__dirname, `../example/node_modules/`);
const link = path.resolve(__dirname, `../example/node_modules/`, packageName);

const text = {
    red: function (input) {
        return `\n\x1b[31m${input}\x1b[0m`;
    },
    bold: function (input) {
        return `\n\x1b[1m${input}\x1b[0m`;
    },
    newline: '\n'
};

function isScopedPackage () {
    return packageName.indexOf('/') > 0;
}

try {
    fs.statSync(linkPath);
} catch (e) {
    fs.mkdirSync(linkPath);
}

try {
    if (isScopedPackage()) {
        fs.statSync(path.resolve(linkPath, packageName.split('/')[0]));
    }
} catch (e) {
    fs.mkdirSync(path.resolve(linkPath, packageName.split('/')[0]));
}

try {
    fs.statSync(link);
} catch (e) {
    fs.symlinkSync(rootPath, link);
}

const build = require('../example/build');

build.task.then(function () {
    return new Promise(function (resolve, reject) {
        rimraf(path.resolve(__dirname, `../example/{output,node_modules}`), function (error) {
            return error ? reject(error) : resolve();
        });
    });
}).then(function () {
    console.log(text.bold('Executed e2e tests successfully!'), text.newline);
}).catch(function (error) {
    console.error(text.red('Error while executing e2e tests: '), error, text.newline);
    process.exit(1);
});
