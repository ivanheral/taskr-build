#!/usr/bin/env node

const fs = require('fs')
const url = require('url')
const path = require('path')
const http = require('http')
const clor = require('clor');
const tinydate = require('tinydate');

function stamp() {
  let i = 0;
  const args = new Array(arguments.length);
  for (; i < args.length; ++i) {
    args[i] = arguments[i];
  }

  let stamp = tinydate('[{HH}:{mm}:{ss}]');
  let Datess = new Date();

  process.stdout.write(clor['magenta'](stamp(Datess)) + ' ');
  console[this.method].apply(console, (this.custom ? [this.custom].concat(args) : args));
}

function log() {
  stamp.apply({
    method: 'log',
    color: 'magenta'
  }, arguments);
  return this;
}

// ----------------------------------
// Generate map of all known mimetypes
// ----------------------------------

const mime = Object.entries(require('./types.json')).reduce(
  (all, [type, exts]) =>
  Object.assign(all, ...exts.map(ext => ({
    [ext]: type
  }))), {}
)

const cwd = process.cwd();

// ----------------------------------
// Server utility functions
// ----------------------------------

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

// ----------------------------------
// Start file watching server
// ----------------------------------

const start = options => {
  const root = options.root || ".";
  const fallback = options.fallback || "index.html";
  const port = options.port || 8080;
  const reloadPort = options.reloadPort || 5000;

  // ----------------------------------
  // Template clientside reload script
  // ----------------------------------

  const reloadScript = `
  <script>
    const source = new EventSource('http://localhost:${reloadPort}');
    source.onmessage = e => location.reload(true);
  </script>
  `;

  http
    .createServer((request, res) => {
      // Open the event stream for live reload
      res.writeHead(200, {
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      })
      // Send an initial ack event to stop request pending
      sendMessage(res, 'connected', 'awaiting change')
      // Send a ping event every minute to prevent console errors
      setInterval(sendMessage, 60000, res, 'ping', 'still waiting')
      // Watch the target directory for changes and trigger reload
      fs.watch(path.join(cwd, root), {
          recursive: true
        }, () =>
        sendMessage(res, 'message', 'reloading page')
      )
    })
    .listen(parseInt(reloadPort, 10))


  // ----------------------------------
  // Start static file server
  // ----------------------------------

  http
    .createServer((req, res) => {
      const pathname = url.parse(req.url).pathname
      const isRoute = isRouteRequest(pathname)
      const status = isRoute && pathname !== '/' ? 301 : 200
      const resource = isRoute ? `/${fallback}` : decodeURI(pathname)
      const uri = path.join(cwd, root, resource)
      const ext = uri.replace(/^.*[\.\/\\]/, '').toLowerCase()
      // Check if files exists at the location
      fs.stat(uri, (err, stat) => {
        if (err) return sendError(res, resource, 404)
        // Respond with the contents of the file
        fs.readFile(uri, 'binary', (err, file) => {
          if (err) return sendError(res, resource, 500)
          if (isRoute) file += reloadScript
          sendFile(res, resource, status, file, ext)
        })
      })
    })
    .listen(parseInt(port, 10))


  // ----------------------------------
  // Open the page in the default browser
  // ----------------------------------

  const page = `http://localhost:${port}`
  const open =
    process.platform == 'darwin' ?
    'open' :
    process.platform == 'win32' ?
    'start' :
    'xdg-open'

  require("child_process").exec(open + " " + page);
}

module.exports = {
  start: start
}