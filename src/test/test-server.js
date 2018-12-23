import http from 'http'
import fs from 'fs'
import path from 'path'

const getJson = (query, key, count) => {
  let res = []
  const countries = [
    { id: 1, name: "United States", avatar: `http://localhost:${port}/img/1` },
    { id: 2, name: "China", avatar: `http://localhost:${port}/img/2` },
    { id: 3, name: "Japan", avatar: `http://localhost:${port}/img/3` },
    { id: 4, name: "Germany", avatar: `http://localhost:${port}/img/4` },
    { id: 5, name: "United Kingdom", avatar: `http://localhost:${port}/img/5` },
    { id: 6, name: "India", avatar: `http://localhost:${port}/img/6` },
    { id: 7, name: "France", avatar: `http://localhost:${port}/img/7` },
    { id: 8, name: "Brazil", avatar: `http://localhost:${port}/img/8` },
    { id: 9, name: "Italy", avatar: `http://localhost:${port}/img/9` },
    { id: 10, name: "Canada", avatar: `http://localhost:${port}/img/10` },
    { id: 11, name: "United Arab Emirates", avatar: `http://localhost:${port}/img/11` }
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
const port = 8080

testServer.on('request', (req, res) => {
  var resFile

  if (req.url == '/') {
    resFile = {
      path: './test/index.html',
      contentType: 'text/html',
      encording: 'utf-8'
    }
  } else if (req.url.match('browser-test.js')) {
    resFile = {
      path: './test/browser-test.js',
      contentType: 'application/javascript',
      encording: 'utf-8'
    }
  } else if (req.url.match('/img')) {
    let img = req.url.replace(/^\/img\//i, '').replace(/\?.*/i, '')
    resFile = {
      path: `./src/test/img/${img}.gif`,
      contentType: 'image/gif ',
      encording: 'binary'
    }
  } else if (req.url.match('chai.js')) {
    resFile = {
      path: './node_modules/chai/chai.js',
      contentType: 'application/javascript',
      encording: 'utf-8'
    }    
  } else if (req.url.match('mocha.js')) {
    resFile = {
      path: './node_modules/mocha/mocha.js',
      contentType: 'application/javascript',
      encording: 'utf-8'
    }
  } else if (req.url.match('mocha.css')) {
    resFile = {
      path: './node_modules/mocha/mocha.css',
      contentType: 'text/css',
      encording: 'utf-8'
    }  
  } else if (req.url.match('countries.json')) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.write(getJson(req.url.replace(/.*keyword=/gi, '').replace(/&.*/gi, ''), 'name', 3))
    return res.end()    
  } else {
    return res.end()
  }

  fs.readFile(path.resolve(resFile.path), resFile.encording, (err, data, readFile) => {
    if (err) {
      console.log(err)
      res.writeHead(400, { 'Content-Type': 'text/plain' })
      return res.end(err)
    } else {
      res.writeHead(200, { 'Content-Type': resFile.contentType })
      res.end(data, resFile.encording)
    }
  })
}).listen(port)

console.log('\u001b[32m' + `Running test-server.js on http://localhost:${port}` + '\u001b[0m')