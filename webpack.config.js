const path = require('path');
const webpack = require('webpack');

module.exports = {

    entry: {
        admin: './scripts/Admin.js',
        vendor: './vendor/Vendor.js'
    },

    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, './dist')
    },

    module: {

        rules: [

            {

                // Transpile JS
                test: /\.js$/,
                exclude: [ path.resolve(__dirname, 'node_modules') ],
                use: [

                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env']
                        }
                    }

                ]

            },

            {

                // YAML loader
                test: /\.yaml$/,
                loaders: ['json-loader', 'yaml-loader']

            }

        ]

    },

    plugins: [

        /*new webpack.optimize.UglifyJsPlugin({

            output: {
                comments: false,
                beautify: false
            }

        })*/

    ]

};