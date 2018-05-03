const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    plugins: [
        new UglifyJSPlugin(),
        new webpack.DefinePlugin({
            __PAM_SEARCH_API__: "'<ENTER_URL_HERE>'",
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
});
