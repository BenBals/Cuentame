var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, 'assets');
var fs = require('fs');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var autoprefixer = require('autoprefixer');
var precss       = require('precss');

var commonLoaders = [
    {
        preLoaders: [
            {
                test: /\.jsx?$/,
                loaders: ['eslint'],
                include: path.resolve(__dirname, 'src')
            }
        ],

        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.sass$/,
                loader: "style!css!sass?sourceMap"
            },
            {
                test: /\.scss$/,
                loader: "style!css!sass?sourceMap"
            }
        ]
    }
];


var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports =
{
    // Makes sure errors in console map to the correct file
    // and line number
    name: 'client',
    plugins: [new HtmlWebpackPlugin({
        title: 'Adivinar',
        template: './src/client/index.html'
    })],
    // devtool: 'eval',
    entry: [
        //'./bin/www.js',
        './src/client/index.jsx',
    ],
    output: {
        path: './build/client',
        filename: 'client.bundle.js',
        // Everything related to Webpack should go through a build path,
        // localhost:3000/build. That makes proxying easier to handle
        // publicPath: 'http://localhost:8081/assets/'
    },

    extensions: [
        '',
        '.jsx', '.js',
        '.json',
        '.html',
        '.css', '.styl', '.scss', '.sass'
    ],

    sassLoaderConfig: {
        sourceMap: true,
        indentedSyntax: true
    },


    module: {

        loaders: [
            // Compile es6 to js.
            {
                test: /src\/.*\.jsx?$/,
                loaders: [
                    'babel-loader'
                ]
            },

            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.sass$/,
                loader: "style!css!sass?config=sassLoaderConfig"
            },
            {
                test: /\.scss$/,
                loader: "style!css!sass?sourceMap"
            }

            ///app\/.*\.json$/
            // { test:  /\.json$/, loader: 'json-loader' },

            // Styles
            // { test: /\.css$/, loader: 'style-loader!css-loader' },
            // { test: /\.s(a|c)ss$/, loader: 'style!css?localIdentName=[path][name]---[local]---[hash:base64:5]!postcss!sass' },

            // Fonts
            // { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
            // { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }

            //{ test: /\.png$/, loader: 'url-loader?limit=100000' },
            //{ test: /\.jpg$/, loader: 'file-loader' }
        ],

        // plugins: [
        //     new webpack.HotModuleReplacementPlugin(),
        //     new webpack.NoErrorsPlugin()
        // ]
    },

    // postcss: [
    //     require('autoprefixer-core')
    // ],

    // devtool: 'source-map'
    postcss: function() {
        return [autoprefixer, precss]
    }
}
;











// var path = require('path')
// // var HtmlWebpackPlugin = require('html-webpack-plugin')

// module.exports = {
//     entry: {
//         client: path.resolve(__dirname, 'src/client/index.jsx')
//         // server: path.resolve(__dirname, 'src/server/index.js'),
//     },
//     output: {
//         path: path.resolve(__dirname, 'build'),
//         filename: '[name].bundle.js', //this is the default name, so you can skip it
//         //at this directory our bundle file will be available
//         //make sure port 8090 is used when launching webpack-dev-server
//         // publicPath: 'http://localhost:8090/assets'
//     },
//     module: {
//         preLoaders: [
//             {
//                 test: /\.jsx?$/,
//                 loaders: ['eslint'],
//                 include: path.resolve(__dirname, 'src')
//             }
//         ],

//         loaders: [
//             {
//                 //tell webpack to use jsx-loader for all *.jsx files
//                 test: /\.js*$/,
//                 loader: 'babel-loader',
//                 query: {
//                     presets: ['es2015', 'react']
//                 }
//             }
//         ]
//     },
//     // externals: {
//     //     //don't bundle the 'react' npm package with our bundle.js
//     //     //but get it from a global 'React' variable
//     //     'react': 'React'
//     // },
//     // externals: [
//     //     {
//     //         express: true
//     //     }
//     // ],
//     // plugins: [
//     //     new HtmlWebpackPlugin({
//     //         title: 'My React App',
//     //         template: path.resolve(__dirname, 'src/html/index.html'),
//     //         inject: 'body'
//     //     })
//     // ],
//     resolve: {
//         extensions: ['', '.js', '.jsx']
//     }
// }
