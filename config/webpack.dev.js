/**
 * @file webpack config for develpment
 * @author david wang 
 */

const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackCommonConfig = require('./webpack.common');

module.exports = webpackMerge(webpackCommonConfig,{
    entry: path.resolve(__dirname,''),
    devServer: {
        compress: true,
        hot: true,
        open: true
    }
});


