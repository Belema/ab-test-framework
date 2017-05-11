'use strict';

const compiler = require('ab-test-framework/compiler');
const fs = require('fs');
const path = require('path');

const productPath = path.resolve(__dirname, './products');
const products = fs.readdirSync(productPath)
                   .filter(file => file[0] !== '.' && fs.statSync(path.resolve(productPath, file)).isDirectory());

function createCompiler (product, environment) {
    return compiler({
        environment: environment,
        entryFile: path.resolve(__dirname, `./products/${product}/index.js`),
        outputPath: path.resolve(__dirname, `./output/${environment}/${product}`),
        outputFile: 'ab.js'
    });
}

function build (product) {
    const config = require(`./products/${product}/config.json`);
    const environments = Object.keys(config.environments);

    return Promise.all(environments.map((environment) => {
        return new Promise((resolve, reject) => {
            createCompiler(product, environment).run(function (error, stats) {
                if (error || stats.hasErrors()) {
                    console.error(`ERROR: Failed to build ${product} (${environment})`);
                    return reject(error || stats.compilation.errors);
                }

                console.log(`[webpack:build product:${product} environment:${environment}]`, '\n', stats.toString({
                    colors: true,
                    reasons: true
                }));

                resolve(stats);
            });
        });
    }));
}

module.exports.task = Promise.all(products.map(build));
