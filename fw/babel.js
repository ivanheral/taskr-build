var vue = require('vueify-fork');
var babel = require('babelify');

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
        ] : ["@babel/proposal-class-properties"], ...[
            ["@babel/plugin-transform-typescript", {
                allowNamespaces: true
            }]
        ]] : ["@babel/plugin-syntax-dynamic-import"]
    };
}

module.exports = function (opts, is_ts) {

    const {
        fw,
        env,
        extract
    } = opts;

    var babelconf = getBabelRc(is_ts, fw);

    try {
        require.resolve('babel-plugin-dynamic-import-split-require');
        babelconf.plugins.push('babel-plugin-dynamic-import-split-require');
    } catch (e) {}

    var conf = {
        transform: [
            ...[
                ['htmlcssify', {
                    insert: fw !== 'angular',
                    min: env.match(/prod/i),
                    extract: extract
                }]
            ],
            ['envify', {
                NODE_ENV: env.match(/prod/i) ? 'production' : 'development',
                global: true
            }]
        ]
    };

    if (fw.match(/angular/i)) conf.transform = [...conf.transform, 'angular2-templatify'];

    if (fw.match(/vue/i)) conf.transform = [...conf.transform, vue];

    if (fw.match(/react/i)) babelconf.presets = [...babelconf.presets, '@babel/react'];

    if (fw.match(/inferno/i))
        babelconf.plugins = [...babelconf.plugins, ["babel-plugin-inferno", {
            "imports": true
        }]];

    if (fw.match(/(preact|hyperapp)/i))
        babelconf.plugins = [...babelconf.plugins, ["@babel/plugin-transform-react-jsx", {
            "pragma": "h"
        }]]

    if (fw.match(/vue/i)) {
        babelconf.plugins = [...babelconf.plugins, ["module-resolver", {
            "alias": {
                vue: `vue/dist/vue${env.match(/prod/i) ? ".min" : ""}.js`
            }
        }]]
    }
    conf.transform = [...conf.transform, babel.configure(babelconf)];
    return conf;
};