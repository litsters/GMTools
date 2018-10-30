const config = require("../config");
const { paths } = config;
const webpack = require("webpack");
//const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    target: "web",

    entry: config.bundles,
    output: {
        chunkFilename: '[name].bundle.js',
    },

    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json", ".html"],
    },

    module: {
        rules: [
            // All files with a ".ts" or ".tsx" extension will be handled by "awesome-typescript-loader".
            //{ test: /.ts$/, loader: "awesome-typescript-loader" },

            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: "ts-loader" },

            // Only run `.js` and `.jsx` files through Babel
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                include: [paths.root],
                exclude: [/node_modules/],
                query: { // Options to configure babel with
                    plugins: ["transform-runtime"],
                    presets: ["env", "react"]
                }
            },

            // All files with ".scss" will be handled and transpiled to css
            {
                test: /\.scss$/,
                include: [paths.root],
                exclude: [/node_modules/],
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]    
            },

            // All image files will be handled here
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    "file-loader"
                ]
            },

            // All font files will be handled here
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: "file-loader"
                    }
                ]
            },

            // All files with ".html" will be handled 
            { test: /\.html$/, loader: "html-loader" },

            // All output ".js" files will have any sourcemaps re-processed by "source-map-loader".
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    plugins: ([
        // make sure we allow any jquery usages outside of our webpack modules
        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery",
        //     "window.jQuery": "jquery"
        // }),




        /*new HtmlWebpackPlugin({
            inject: "body",
            filename: "../Views/Shared/_Layout.cshtml",
            template: "./Views/Shared/_Layout_Template.cshtml"
        })*/
    ]),
    optimization: {
        noEmitOnErrors: true        // avoid publishing when compilation failed.
    },

    // pretty terminal output
    stats: { 
        colors: true,
        env: true
     }
};