var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;    
    });

//console.log('Node Modules: '+ JSON.stringify(nodeModules));
module.exports =

{
    // The configuration for the server-side rendering
    name: 'server',
    target: 'node',
    entry: './src/server/index.js',
    output: {
        path: './build/server',
        filename: 'server.bundle.js'
    },
    externals: nodeModules,
    module: {
        loaders: [
            { test: /\.js$/,

                loaders: [
                    // 'imports?document=this',

                    // 'react-hot',
                    'babel-loader'
                    //,'jsx-loader'
                ]
            },
            //{ test: /\.css$/,  loader: path.join(__dirname, 'server', 'style-collector') + '!css-loader' },
            { test:  /\.json$/, loader: 'json-loader' },


            //{ test: /\.ejs$/, loader: 'ejs-loader?variable=data' }
        ]
    }
};