var path = require('path')
// var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        client: path.resolve(__dirname, 'src/client/index.jsx')
        // server: path.resolve(__dirname, 'src/server/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].bundle.js', //this is the default name, so you can skip it
        //at this directory our bundle file will be available
        //make sure port 8090 is used when launching webpack-dev-server
        // publicPath: 'http://localhost:8090/assets'
    },
    module: {
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
                test: /\.js*$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    // externals: {
    //     //don't bundle the 'react' npm package with our bundle.js
    //     //but get it from a global 'React' variable
    //     'react': 'React'
    // },
    // externals: [
    //     {
    //         express: true
    //     }
    // ],
    // plugins: [
    //     new HtmlWebpackPlugin({
    //         title: 'My React App',
    //         template: path.resolve(__dirname, 'src/html/index.html'),
    //         inject: 'body'
    //     })
    // ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
}
