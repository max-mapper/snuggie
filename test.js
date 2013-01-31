var server = require('./')(8080)
var request = require('request')
var pending = 0

pending++
request.post({url: "http://localhost:8080", body: "var foo = require'util')", json: true}, function(e,r,b) {
  if (!b.error) throw new Error()
  decrement()
})

pending++
request.post({url: "http://localhost:8080", body: "var foo = require('util')", json: true}, function(e,r,b) {
  if (b.error) throw new Error()
  decrement()
})

pending++
request.post({url: "http://localhost:8080", body: "var foo = require('foo')", json: true}, function(e,r,b) {
  if (!b.error) throw new Error()
  decrement()
})

function decrement() {
  pending--
  if (pending === 0) {
    console.log('all passed')
    process.exit()
  }
}