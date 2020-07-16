#!/usr/bin/env node

const fs = require('fs')
const url = require('url')
const path = require('path')
const http = require('http')
const clor = require('clor');
const utils = require('./utils');
const tinydate = require('tinydate');
const cwd = process.cwd();
const isPortAvailable = require('./port.js');

function stamp() {
  let i = 0;
  const args = new Array(arguments.length);
  for (; i < args.length; ++i) {
    args[i] = arguments[i];
  }

  let stamp = tinydate('[{HH}:{mm}:{ss}]');
  let Dates = new Date();

  process.stdout.write(clor['magenta'](stamp(Dates)) + ' ');
  console[this.method].apply(console, (this.custom ? [this.custom].concat(args) : args));
}

function log() {
  stamp.apply({
    method: 'log',
    color: 'magenta'
  }, arguments);
  return this;
}

const mime = Object.entries(require('./types.json')).reduce(
  (all, [type, exts]) =>
  Object.assign(all, ...exts.map(ext => ({
    [ext]: type
  }))), {}
)

const sendError = (res, resource, status) => {
  res.writeHead(status)
  res.end()
  log(`Error ${clor.red.bold(resource)}`)
}

const sendFile = (res, resource, status, file, ext) => {
  res.writeHead(status, {
    'Content-Type': mime[ext] || 'application/octet-stream',
    'Access-Control-Allow-Origin': '*',
  })
  res.write(file, 'binary')
  res.end()
  log(`Reloading ${clor.green.bold(resource)}`)
}

const sendMessage = (res, channel, data) => {
  res.write(`event: ${channel}\nid: 0\ndata: ${data}\n`)
  res.write('\n\n')
}

const isRouteRequest = uri =>
  uri
  .split('/')
  .pop()
  .indexOf('.') === -1 ?
  true :
  false

const start = options => {
  const root = options.root || ".";
  const fallback = options.fallback || "index.html";
  const port = parseInt(options.port) || 8080;
  const reloadPort = options.reloadPort || 5000;
  const reloadScript = `
  <script>
    const source = new EventSource('http://localhost:${reloadPort}');
    source.onmessage = function(e){ location.reload(true)};
  </script>
  `;
  (async function () {
    var status = await isPortAvailable(port);
    log(`Port ${port} ${status ? "is":"is not"} available`)

    http
      .createServer((req, res) => {
        const pathname = url.parse(req.url).pathname
        const isRoute = isRouteRequest(pathname)
        const status = isRoute && pathname !== '/' ? 301 : 200
        const resource = isRoute ? `/${fallback}` : decodeURI(pathname)
        const uri = path.join(cwd, root, resource)
        const ext = uri.replace(/^.*[\.\/\\]/, '').toLowerCase()
        fs.stat(uri, (err, _stat) => {
          if (err) return sendError(res, resource, 404)
          fs.readFile(uri, 'binary', (err, file) => {
            if (err) return sendError(res, resource, 500)
            if (isRoute) file += reloadScript
            sendFile(res, resource, status, file, ext)
          })
        })
      })
      .listen(port, () => {
        utils.open_browser(port);
        log(`Open ${clor.blue.bold("http://localhost:"+port)}`);
      })

    http
      .createServer((_request, res) => {
        res.writeHead(200, {
          Connection: 'keep-alive',
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        })
        sendMessage(res, 'connected', 'awaiting change')
        setInterval(sendMessage, 60000, res, 'ping', 'still waiting')
        fs.watch(path.join(cwd, root), {
            recursive: true
          }, () =>
          sendMessage(res, 'message', 'reloading page')
        )
      })
      .listen(parseInt(reloadPort, 10))
  })()
}

module.exports = {
  start: start
}