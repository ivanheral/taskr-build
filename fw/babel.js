var vue = require('vueify-fork');
var babel = require('babelify');
var alias = require('aliasify');

function getBabelRc(ts, fw) {

    var conf = {
        presets: ["@babel/env"],
        plugins: ts ? [
            "@babel/proposal-class-properties",
            "@babel/proposal-object-rest-spread"
        ] : ["@babel/plugin-syntax-dynamic-import"]
    };

    if (ts) {
        conf.extensions = ['.js', '.jsx', '.ts', '.tsx'];
        (fw == "preact") || (fw == "hyperapp") ? conf.presets.push(["@babel/typescript", {
            jsxPragma: "h"
        }]): conf.presets.push("@babel/typescript")
        if (fw == "angular") {
            conf.plugins = [
                "babel-plugin-transform-typescript-metadata",
                [
                    "@babel/plugin-proposal-decorators",
                    {
                        "legacy": true
                    }
                ],
                ["@babel/proposal-class-properties", {
                    "loose": true
                }]
            ]
        }
    }
    return conf;
}

module.exports = function (fw, is_ts, env) {

    var conf = {
        transform: [
            ['htmlcssify', {
                insert: fw !== 'angular',
                min: env == 'production'
            }]
        ]
    };
    if (fw == 'angular') {
        conf.transform.push('angular2-templatify');
    }

    conf.transform.push(['envify', {
        NODE_ENV: env,
        global: true
    }]);

    var babelconf = getBabelRc(is_ts, fw);

    if (fw == "react") babelconf.presets.push('@babel/react');
    if (fw == "vue") conf.transform.push(vue);

    if (fw == "inferno") {
        babelconf.plugins.push(["babel-plugin-inferno", {
            "imports": true
        }]);
    }

    if (fw == "preact" || fw == "hyperapp") {
        babelconf.plugins.push(["@babel/plugin-transform-react-jsx", {
            "pragma": "h"
        }]);
    }

    conf.transform.push(babel.configure(babelconf));
    if (fw == "vue") {
        conf.transform.push(alias.configure({
            aliases: {
                vue: env == "production" ? "vue/dist/vue.min" : "vue/dist/vue"
            }
        }));
    }
    return conf;
};