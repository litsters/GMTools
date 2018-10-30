const config = require("../../config");
const { paths } = config;
const languages = require(paths.languages);
var I18nPlugin = require("i18n-webpack-plugin");

module.exports = function(language) {
    return new I18nPlugin(
        languages[language]
    )
};