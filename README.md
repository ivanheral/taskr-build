# taskr-build

> Builder plugin for [Taskr](https://github.com/lukeed/taskr).

## About

Plugin to build web apps with frameworks using JavaScript or TypeScript.

In short, Browserify + Babel 7 in 2019 :sweat_smile:

## Install

Install with npm or yarn.

<pre>
npm i taskr taskr-build @taskr/esnext @taskr/watch --save-dev
</pre>

## Benchmark

All the tests have been executed with these specifications:

```
AMD FX-8350 Eight-Core
8 GB RAM
Linux Mint 19.1 (Xfce 64-bit)
128GB SSD
```

Time to build a project with react and redux:

| Tool | Dev Build 1º |	Dev Build 2º | Dev Build 3º |
| :---         |     :---:      |     :---:      |     :---:      |
| [webpack](https://webpack.js.org/) | 8.02s | 2.11s | 2.9s |
| [parcel](https://parceljs.org/) | 3.67s | 1.89s | 1.81s |
| taskr-build (browserify) | 2.42s | 0.327s | 0.331s |

Currently tested with:
- [React](https://github.com/facebook/react)
- [Vue](https://github.com/vuejs/vue)
- [Preact](https://github.com/developit/preact)
- [Inferno](https://github.com/infernojs/inferno)
- [Hyperapp](https://github.com/hyperapp/hyperapp)
- [Angular 1 / Angular JS](https://github.com/angular/angular.js)
- [Angular 2,4,7,8...](https://github.com/angular/angular) (not (AOT) compiler)
- [Svelte](https://github.com/sveltejs/svelte) (only javascript)

## Examples

- [To-Do List Marvel with Preact X](https://github.com/ivanheral/To-Do-List-Marvel)
- [Vue Giphy Element UI](https://github.com/ivanheral/vue_giphy_taskr)
- [Angula 8 with Drag&drop](https://https://github.com/ivanheral/angular8_taskr)

## Thanks

[Taskr](https://github.com/lukeed/taskr):
[Luke Edwards](https://lukeed.com) and 
[Jorge Bucaran](https://github.com/JorgeBucaran)

[Servør](https://github.com/lukejacksonn/servor):
[Luke Jackson](https://github.com/lukejacksonn)
