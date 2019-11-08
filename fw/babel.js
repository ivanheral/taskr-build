var vue = require('vueify-fork');
var babel = require('babelify');
var alias = require('aliasify');

function getBabelRc(ts, fw) {
    return {
        presets: ["@babel/env", ...ts ? [...fw.match(/(preact|hyperapp)/i) ? [
            ["@babel/typescript", {
                jsxPragma: "h"
            }]
        ] : ["@babel/typescript"]] : []],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        plugins: ts ? [...fw.match(/angular/i) ? [
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
        ] : ["@babel/proposal-class-properties",
            "@babel/proposal-object-rest-spread"
        ]] : ["@babel/plugin-syntax-dynamic-import"]
    };
}

module.exports = function (fw, is_ts, env) {

    var babelconf = getBabelRc(is_ts, fw);

    var conf = {
        transform: [
            ['htmlcssify', {
                insert: fw !== 'angular',
                min: env.match(/prod/i)
            }]
        ]
    };

    conf.transform = [...conf.transform, ['envify', {
        NODE_ENV: env.match(/prod/i) ? 'production' : 'development',
        global: true
    }]];

    if (fw.match(/angular/i)) conf.transform = [...conf.transform, 'angular2-templatify'];
    if (fw.match(/react/i)) babelconf.presets = [...babelconf.presets, '@babel/react'];
    if (fw.match(/vue/i)) conf.transform = [...conf.transform, vue];
    if (fw.match(/inferno/i))
        babelconf.plugins = [...babelconf.plugins, ["babel-plugin-inferno", {
            "imports": true
        }]];

    if (fw.match(/(preact|hyperapp)/i))
        babelconf.plugins = [...babelconf.plugins, ["@babel/plugin-transform-react-jsx", {
            "pragma": "h"
        }]]

    if (fw.match(/svelte/i))
        conf.transform = [...conf.transform, ['sveltify', {
            extensions: [
                ".html",
                ".svelte"
            ]
        }]]

    conf.transform = [...conf.transform, babel.configure(babelconf)];
    if (fw.match(/vue/i)) {
        conf.transform = [...conf.transform, alias.configure({
            aliases: {
                vue: `vue/dist/vue.${env.match(/prod/i) && "min"}`
            }
        })];
    }
    return conf;
};