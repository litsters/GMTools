const path = require("path");

const root = path.resolve(__dirname, "../"),
    projectRoot = path.resolve(root, "../"),
    serverRoot = path.resolve(projectRoot, "./server"),
    publicRoot = path.resolve(serverRoot, "./public"),
    compiled_dirname = "./static",
    compiled_output = path.resolve(publicRoot, compiled_dirname),
    localizationRoot = path.resolve(root, "./src/localization")

    DEFAULT_LANG = "en";
    DEFAULT_PORT = 8080;
    DEFAULT_PROXY = "http://localhost:4444";


module.exports = {
    paths: {
        root: root,
        projectRoot,
        serverRoot,
        publicRoot,
        compiledRoot: compiled_output,
        dev: {
            public: `${root}/public`
        },
        languages: `${localizationRoot}/languages.js`,
        translations: {
            en: `${localizationRoot}/translations/en.json`
        },
        output: {
            compiled: {
                path: compiled_output,
                dirname: compiled_dirname
            },
            js_default: `${compiled_output}/scripts`,
            css_default: `${compiled_output}/css`
        },

        webpack: {
            common: `${root}/config/build/webpack.common.js`,
            localized: `${root}/config/build/webpack.localized.js`,
            prod: `${root}/config/build/webpack.prod.js`
        }
    },

    environment: {
        default: {
            lang: DEFAULT_PORT,
            port: DEFAULT_PORT
        },
        setDefaults: function (env) {
            if (!env) env = {};

            env.lang = env.lang || DEFAULT_LANG;
            env.port = env.port || DEFAULT_PORT;
            env.proxy = env.proxy || DEFAULT_PROXY;

            return env;
        }
    },

    bundles: {
        "app": `${root}/src/index.tsx`,
        polyfill: "babel-polyfill"
    }
}