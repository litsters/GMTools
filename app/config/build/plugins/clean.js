const config = require("../../config");
const { paths } = config;
const CleanWebpackPlugin = require("clean-webpack-plugin");

// Clean the static output folder.
module.exports = new CleanWebpackPlugin([paths.output.compiled.dirname], {
    root: paths.compiledRoot,
    verbose: true, // Write logs to console.
    dry: false
});