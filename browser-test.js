var browserify = require('browserify')
var fs = require('fs')
var snuggie = require('./')

snuggie(8081)

var http = require('http').createServer(function(req, res) {
  if (req.url === '/') return serveIndex(res)
  else return serveTest(res)
  
}).listen(8080)

function serveIndex(res) {
  var index = '<html><body><script src="test.js"></script></body></html>'
  res.writeHead(200, {
    'Content-Length': index.length,
    'Content-Type': 'text/html'
  })
  res.end(index)
}

function serveTest(res) {
  var test = fs.readFileSync('./browser-script.js')
  var bundle = browserify({ debug: true, watch: false, cache: false })
  bundle.addEntry('test.js', { body: test })
  var body = bundle.bundle()
  res.writeHead(200, {
    'Content-Length': body.length,
    'Content-Type': 'text/javascript'
  })
  res.end(body)
}