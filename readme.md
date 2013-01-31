# snuggie

bundle up your javascripts: a minimal HTTP API for [browserify](http://browserify.org)

```
npm install snuggie
```

## usage

`snuggie` is an http server

```javascript
var snuggie = require('snuggie')
snuggie(httpPort, onListeningCallback)
```

or

```
var snuggieHandler = require('snuggie').handler
require('http').createServer(snuggleHandler).listen(8000)
```

## api

first you must make a PUT/POST request to snuggie where your request upload body contains an ascii a javascript program (no multipart form uploads allowed)

then snuggie will use browserify to bundle your program and send you back a bundle. any node module available to your node server will be available to snuggie

e.g. :

```javascript
  var request = require('request')
  request.post({url: "http://snuggieserver:8000", body: "var foo = require('util')", json: true}).pipe(process.stdout)
```

the http response will be either:

```javascript
{"bundle": "// browserified bundle output contents"}
```

or

```javascript
{"error": "// syntaxError or moduleMissing", "message": "// a hopefully helpful error message"}
```

## license

BSD