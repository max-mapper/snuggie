var request = require('browser-request')
request({method: "POST", body: "var foo = require('util')", url: 'http://localhost:8081', json: true}, function(err, resp, json) {
  if (!json.error) document.querySelector('body').innerHTML = "all passed"
})