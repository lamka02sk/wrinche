const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "[name].min.css"
});

module.exports = {

    entry: {

        // JS
        admin: './scripts/Admin.js',
        vendor: './vendor/Vendor.js',

        // Styles
        style_admin_light: './styles/Admin_Light.sass',
        style_admin_dark: './styles/Admin_Dark.sass'

    },

    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, './dist')
    },

    module: {

        rules: [

            {
                // Sass Loader
                test: /(\.scss$)|(\.sass$)/,
                use: extractSass.extract({
                    use: [
                        { loader: "css-loader?url=false" },
                        { loader: "sass-loader" }
                    ]
                })
            },

            /*{
                // ESLint
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
            },*/

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

        extractSass,

        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/,
            cssProcessorOptions: { discardComments: { removeAll: true } }
        }),

        /*new webpack.optimize.UglifyJsPlugin({

            output: {
                comments: false,
                beautify: false
            }

        })*/

    ]

};