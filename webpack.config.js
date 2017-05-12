var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: __dirname + "/client/index.js",
    output: {path: __dirname + '/compiled/client/', filename: 'bundle.js'},

    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /.css$/,
                loaders: ['style-loader', 'css-loader'],
             }
        ],
    }
}

console.log(module.exports.entry);
