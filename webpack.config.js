const path = require('path');
const SRC_DIR = 'source';
const DIST_DIR = 'dist';
const IS_DEBUG = process.env.NODE_ENV !== 'production';

const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        engine: path.join(__dirname, SRC_DIR, 'js/index.js')
    },
    output: {
        filename: 'js/[name].parten.js',
        path: path.join(__dirname, DIST_DIR),
        library: 'parten',
        libraryTarget: 'umd'
    },
    mode: IS_DEBUG ? 'development' : 'production',
    plugins: [
        new HtmlPlugin({
            template: path.join(__dirname, SRC_DIR, 'index.html')
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader']
            }
        ]
    }
}