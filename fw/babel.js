var vue = require('vueify-fork');
var babel = require('babelify');
var alias = require('aliasify');

function getBabelRc(ts, fw) {

    var pragma;
    pragma.jsxPragma = "h";

    var conf = {
        presets: ["@babel/env"],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        plugins: ts ? [
            "@babel/proposal-class-properties",
            "@babel/proposal-object-rest-spread"
        ] : ["@babel/plugin-syntax-dynamic-import"]
    };

    if (ts) {
        fw.match(/(preact|hyperapp)/i) ? conf.presets.push(["@babel/typescript", pragma]) : conf.presets.push("@babel/typescript")
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
                min: env.match(/prod/i)
            }]
        ]
    };
    if (fw == 'angular') conf.transform = [...conf.transform, 'angular2-templatify'];

    conf.transform = [...conf.transform, ['envify', {
        NODE_ENV: env.match(/prod/i) ? 'production' : 'development',
        global: true
    }]];

    var babelconf = getBabelRc(is_ts, fw);

    if (fw == "react") babelconf.presets = [...babelconf.presets, '@babel/react'];
    if (fw == "vue") con.transform = [...conf.transform, vue];

    if (fw == "inferno")
        babelconf.plugins = [...babelconf.plugins, ["babel-plugin-inferno", {
            "imports": true
        }]];

    if (fw.match(/(preact|hyperapp)/i))
        babelconf.plugins = [...babelconf.plugins, ["@babel/plugin-transform-react-jsx", pragma]]

    if (fw == "svelte") {
        conf.transform = [...conf.transform, ['sveltify', {
            extensions: [
                ".html",
                ".svelte"
            ]
        }]]
    }
    conf.transform = [...conf.transform, babel.configure(babelconf)];
    if (fw == "vue") {
        conf.transform = [...conf.transform, alias.configure({
            aliases: {
                vue: `vue/dist/vue.${env.match(/prod/i) && "min"}`
            }
        })];
    }
    return conf;
};