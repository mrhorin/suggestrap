import http from 'http'
import fs from 'fs'
import path from 'path'

const getJson = (query, key, count) => {
  let res = []
  const countries = [
    { id: 1, name: "United States" },
    { id: 2, name: "China" },
    { id: 3, name: "Japan" },
    { id: 4, name: "Germany" },
    { id: 5, name: "United Kingdom" },
    { id: 6, name: "India" },
    { id: 7, name: "France" },
    { id: 8, name: "Brazil" },
    { id: 9, name: "Italy" },
    { id: 10, name: "Canada" }
  ]
  const pattern = new RegExp(query, 'i')
  // Extract matched hashes
  for (let index = 0; index < countries.length && res.length < count; index++) {
    if (countries[index][key].match(pattern)) {
      res.push(countries[index])
    }
  }
  return JSON.stringify(res)
}

const testServer = http.createServer()

testServer.on('request', (req, res) => {
  var resFile

  // Remove parameters from a request url
  switch (req.url.replace(/\?.*/i, '')) {
    case '/':
      resFile = { path: './test/index.html', contentType: 'text/html'}
      break
    case '/browser-test.js':
      resFile = { path: './test/browser-test.js', contentType: 'application/javascript' }
      break
    case '/chai.js':
      resFile = { path: './node_modules/chai/chai.js', contentType: 'application/javascript' }
      break
    case '/mocha.js':
      resFile = { path: './node_modules/mocha/mocha.js', contentType: 'application/javascript' }
      break
    case '/mocha.css':
      resFile = { path: './node_modules/mocha/mocha.css', contentType: 'text/css' }
      break
    case '/countries.json':
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.write(getJson(req.url.replace(/.*keyword=/gi, '').replace(/&.*/gi, ''), 'name', 3))
      return res.end()
      break
    default:
      return res.end()
  }

  fs.readFile(path.resolve(resFile.path), 'utf-8', (err, data, readFile) => {
    if (err) {
      console.log(err)
      res.writeHead(400, { 'Content-Type': 'text/plain' })
      res.write(err)
      return res.end()
    } else {
      res.writeHead(200, { 'Content-Type': resFile.contentType })
      res.write(data)
      res.end()
    }
  })
}).listen(8080)

console.log('Running test-server.js on http://localhost:8080')