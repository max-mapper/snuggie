var http = require('http')
var concat = require('concat-stream')
var browserify = require('browserify')

module.exports = function(port, cb) {
  var server = http.createServer(handler)
  server.listen(port || 80, cb)
}

module.exports.handler = handler
module.exports.respond = respond
module.exports.bundle = bundle

function handler(req, res) {
  req.pipe(concat(buffered))
  function buffered(err, body) {
    if (err) return console.error(err)
    bundle(body, sendBundle)
  }
  function sendBundle(err, bundled) {
    var body, status
    if (err) {
      if (typeof res === 'function') return res(err)
      body = JSON.stringify(err)
    } else {
      if (typeof res === 'function') return res(false, bundled)
      body = JSON.stringify({bundle: bundled})
    }
    respond(res, body)
  }
}

function respond(res, body) {
  res.writeHead(200, {
    'Content-Length': body.length,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
  })
  res.end(body)
}

function bundle(scriptBody, cb) {
  var error
  var bundle = browserify({ debug: true, watch: false, cache: false })
  bundle.on('syntaxError', function(err) {
    error = {error: "syntaxError", message: err.toString()}
  })
  try {
    bundle.addEntry('app.js', { body: scriptBody })
  } catch(e) {
    error = {error: "missingModule", message: e.toString()}
  }
  var bundled = bundle.bundle()
  process.nextTick(function() {
    cb(error, bundled)
  })
}
