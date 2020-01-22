# taskr-build

> Builder plugin for [Taskr](https://github.com/lukeed/taskr).

<a href="https://npmjs.org/package/taskr">
    <img src="https://img.shields.io/npm/v/taskr-build.svg" alt="NPM Version"/>
</a>
<a href="https://npmjs.org/package/taskr">
    <img src="https://img.shields.io/npm/dm/taskr-build.svg" alt="NPM Downloads"/>
</a>

## About
Plugin to build web apps with popular frameworks using javascript/typescript.
In short, Browserify + Babel 7 in 202X :sweat_smile:

## Why?
I was tired of using plugins and loaders depending on the javascript framework that I had to use in each project. Using Babel 7 and some transformations is enough. Less time to set up new projects (10-30 lines).

It has been fun to develop this.

## Install
Install with yarn.
<pre>
yarn add taskr taskr-build @taskr/{esnext,watch} --dev
</pre>

## Benchmark
Time to build a project with react and redux:

| Tool | Dev Build 1º |	Dev Build 2º | Dev Build 3º |
| :---         |     :---:      |     :---:      |     :---:      |
| [webpack](https://webpack.js.org/) | 8.02s | 2.11s | 2.9s |
| [parcel](https://parceljs.org/) | 3.67s | 1.89s | 1.81s |
| taskr-build (browserify) | 2.42s | 0.327s | 0.331s |

Performance improvement working with angular 8.

-----

List of frameworks supported with the key to use:
- [React](https://github.com/facebook/react) ("react")
- [Vue](https://github.com/vuejs/vue) ("vue")
- [Preact](https://github.com/developit/preact) ("preact")
- [Inferno](https://github.com/infernojs/inferno) ("inferno")
- [Hyperapp](https://github.com/hyperapp/hyperapp) ("hyperapp")
- [Angular 1 / Angular JS](https://github.com/angular/angular.js) ("angularjs")
- [Angular 2,4,7,8...](https://github.com/angular/angular) (not (AOT) compiler) ("angular")
- [Svelte](https://github.com/sveltejs/svelte) (only javascript) ("svelte")

## Examples

- [To-Do List Marvel with Preact X](https://github.com/ivanheral/To-Do-List-Marvel)
- [Vue Giphy Element UI](https://github.com/ivanheral/vue_giphy_taskr)
- [Angular 8 with Drag&drop](https://https://github.com/ivanheral/angular8_taskr)
- [Inferno/Typescript and Server Side Rendering](https://https://github.com/ivanheral/inferno_ts_ssr)
- [React/Typescript/Hooks with tests](https://https://github.com/ivanheral/angular8_taskr)
- [Vue Giphy Element UI with TypeScript](https://https://github.com/ivanheral/vue_giphy_taskr_ts)

## Thanks
[Taskr](https://github.com/lukeed/taskr): [Luke Edwards](https://lukeed.com) and [Jorge Bucaran](https://github.com/JorgeBucaran)

[Servør](https://github.com/lukejacksonn/servor): [Luke Jackson](https://github.com/lukejacksonn)
