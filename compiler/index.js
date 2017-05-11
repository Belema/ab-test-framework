'use strict';

var autoprefixer = require('autoprefixer');
var webpack = require('webpack');

module.exports = function (options) {
    return webpack({
        entry: require.resolve('../bootstrap/index.js'),
        output: {
            filename: options.outputFile || 'ab.js',
            path: options.outputPath
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: require.resolve('babel-loader'),
                        options: {
                            presets: [
                                [
                                    require.resolve('babel-preset-es2015'),
                                    { modules: false }
                                ]
                            ]
                        }
                    }
                },
                {
                    resource: /manifest\.json$/,
                    resourceQuery: /\.(id|name)$/,
                    loader: require.resolve('./loaders/manifest-parser')
                },
                {
                    test: /config\.json$/,
                    use: {
                        loader: require.resolve('./loaders/config-parser'),
                        options: {
                            analytics: options.analytics,
                            environment: options.environment,
                            storage: options.storage
                        }
                    }
                },
                {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: require.resolve('css-loader'),
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader: require.resolve('postcss-loader'),
                            options: {
                                plugins: () => [
                                    autoprefixer({ browsers: ['last 4 versions']})
                                ]
                            }
                        },
                        {
                            loader: require.resolve('sass-loader')
                        }
                    ]
                },
                {
                    test: /\.html$/,
                    exclude: /node_modules/,
                    use: {
                        loader: require.resolve('html-loader'),
                        options: {
                            interpolate: true,
                            minimize: true,
                            removeAttributeQuotes: false
                        }
                    }
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                EXPERIMENT_ENTRY_FILE: JSON.stringify(options.entryFile)
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: true
                }
            })
        ]
    });
};
