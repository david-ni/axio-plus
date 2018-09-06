/**
 * @file webpack config for production
 * @author david wang 
 */

const path = require('path');
const webpackMerge = require('webpack-merge');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpackCommonConfig = require('./webpack.common');
const entryPath = path.resolve(__dirname,'../index.ts');
const buildPath = path.resolve(__dirname,'../dist');

module.exports = webpackMerge(webpackCommonConfig,{
    entry: entryPath,
    output: {
        path: buildPath,
        filename: 'axioplus.min.js'
    },
    mode: 'production',
    optimization: {
        minimizer: [
            new uglifyJsPlugin({
                uglifyOptions:{
                    sourceMap: false,
                    compress: {
                        warnings: false
                    },
                    mangle: {
                        safari10: true
                    },
                    output: {
                        ascii_only: true,
                        comments: false
                    }
                }
            })
        ]
    }
});