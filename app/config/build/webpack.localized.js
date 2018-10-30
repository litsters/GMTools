const config = require("../config");
const { paths } = config;

const webpack_prod = require(paths.webpack.prod);
const languages = require(paths.languages);

const Merge = require("webpack-merge");
const i18nPlugin = require("./plugins/i18n");
//const ExtractSassPlugin = require("./webpackPlugins/extractSassPlugin");
//const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = Object.keys(languages).map(function(language) {
    
    console.log("LANGUAGE: " + JSON.stringify(language));

    var env = {
        lang: language
    }

    return Merge(webpack_prod(env), {
        plugins: [
            //ExtractSassPlugin,
            i18nPlugin(language),       
        ],
    });
});