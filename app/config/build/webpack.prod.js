const config = require("../config");
const { paths, environment } = config;
const webpack_common = require(paths.webpack.common);

const webpack = require("webpack");
const Merge = require("webpack-merge");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
//const ExtractSassPlugin = require("./webpackPlugins/extractSassPlugin");



module.exports = env => {

    if (!env) env = environment.default;
    const { lang } = env;

    console.log("Output root: " + paths.output.compiled.path);

    return Merge(webpack_common, {
        mode: "production",
        //context: path.resolve(__dirname, "src"),
        output: {
            filename: `${lang}/[name].min.js`,
            path: paths.output.js_default,
            publicPath: paths.output.compiled.path,
        },
        plugins: ([
            new webpack.DefinePlugin({ // Can use this to set feature flags
                "process.env": {
                    "NODE_ENV": JSON.stringify("production")
                }
            }),

            new ProgressBarPlugin()
            //ExtractSassPlugin,
            //CompressionPlugin
        ]),
        optimization: {
            minimize: true
        }
    }
)}
