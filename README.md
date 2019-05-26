# taskr-build

> Builder plugin for [Taskr](https://github.com/lukeed/taskr).

## About

This is an experiment to check if we can use browserify (without too much configuration) with the most popular frameworks.

## Install

Install with npm or yarn.

<pre>
npm i taskr taskr-build @taskr/esnext
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


## Usage

Plugin to build web apps with frameworks using JavaScript or TypeScript.

In short, Browserify + Babel 7 in 2019 :sweat_smile:

```js
var env = 'development'
var fw = 'preact'
var cache = 'yes'

export async function build(task) {
    await task.source('src/js/main.tsx').build({
        fw: `${fw}`,
        env: `${env}`
        cache: `${cache}`
    }).target(`${out}`)
}
```

Currently tested with:
- [React](https://github.com/facebook/react)
- [Vue](https://github.com/vuejs/vue)
- [Preact](https://github.com/developit/preact)
- [Inferno](https://github.com/infernojs/inferno)
- [Hyperapp](https://github.com/hyperapp/hyperapp)
- [Angular 1 / Angular JS](https://github.com/angular/angular.js)
- [Angular](https://github.com/angular/angular)

## Examples

- [To-Do List Marvel with Preact X](https://github.com/ivanheral/To-Do-List-Marvel)

## Thanks

[Taskr](https://github.com/lukeed/taskr):
[Luke Edwards](https://lukeed.com) and 
[Jorge Bucaran](https://github.com/JorgeBucaran)

[Servør](https://github.com/lukejacksonn/servor):
[Luke Jackson](https://github.com/lukejacksonn)
