[![Build Status](https://travis-ci.org/mrhorin/suggestrap.svg?branch=master)](https://travis-ci.org/mrhorin/suggestrap)
[![npm version](https://badge.fury.io/js/suggestrap.svg)](https://badge.fury.io/js/suggestrap)
![npm](https://img.shields.io/npm/dt/suggestrap.svg)
[![GitHub license](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://raw.githubusercontent.com/mrhorin/suggestrap/master/LICENSE)

[![NPM](https://nodei.co/npm/suggestrap.png)](https://nodei.co/npm/suggestrap/)

# suggestrap
![show](https://user-images.githubusercontent.com/6502717/49056240-4c7db100-f23e-11e8-9a2e-863f59ad84a7.gif)
This module can show suggestions with a JSON file.

## Install
Install with [npm](https://www.npmjs.com/).
```
npm install suggestrap
```

## Usage
Prepare a JSON server for suggestions yourself. When Suggestrap requests a JSON file for suggestions, the server needs to generate the JSON file with a request parameter, a part of the request URL, and then return it. The JSON format is an array which has hashes like the following example. (However, you can also specify an array object for suggestions on the browser side without the JSON server instead of requesting the JSON file to the server. Refer [Note](#note) for details, if you want.)
```json
[
  {"id":1, "age":32, "name":"Jack"},
  {"id":2, "age":41, "name":"Jackie"},
  {"id":3, "age":41, "name":"Jake"},
  {"id":4, "age":20, "name":"James"},
  {"id":5, "age":28, "name":"Jane"}
]
```
When an user types a value into a target form, Suggestrap replaces a wildcard, a part of the JSON URL, with the value. For example, if the JSON URL is 'https://example.com/json/users/%QUERY' and the inputed value is 'ja', Suggestrap genetates 'https://example.com/json/users/ja' and requests a JSON file to the server. The server searches suggestions from the database with the value and returns the JSON file. The suggestion element is created by Suggestrap, and then it is inserted into next to the target element, which you specify.
```html
<input id="target" type="text">

<script src="./suggestrap/lib/suggestrap.js"></script>
<script>
  var req = {
    target: "target",
    url: "https://example.com/json/users/%QUERY",
    key: "name"
  };
  var option = {
    minlength: 2,
    wildcard: "%QUERY",
    delay: 400,
    count: 5,
    id: "suggestrap"
  };
  var suggestrap = new Suggestrap(req, option);
</script>
```
This example is written with ES6. You don't need to refer suggestrap.js in the html file when you import suggestrap with ES6.
```javascript
import Suggestrap from 'suggestrap'

const req = {
  target: "target",
  url: "https://example.com/json/users/%QUERY",
  key: "name"
}
const option = {
  minlength: 2,
  wildcard: "%QUERY",
  delay: 400,
  count: 5,
  id: "suggestrap"
}

let suggestion = new Suggestrap(req, option)
```
The first argument hash is required.
- **target**: Specify an ID of a target form element, which you would like to show suggestions on.
- **url**: Specify an URL for requesting a JSON file. The URL needs to include a wildcard like the example above. You can specify a string of the wildcard with the option of the second argument. Suggestrap replaces the wildcard with a value that an user types.
- **key**: Specify a key name of the JSON objects that you'd like to show as suggestions.
- **values**: When you'd like to show suggestions from an array object instead of requestiong a JSON, you can input it with this key. **In that case, the url key isn't required.** Besides, you can specify the JSON URL with this key like the url key. As you specify the JSON URL with this key, the behavior is same as the url key completely. This key takes priority over the url key when you specify url and values key at same time. Please refer [Note](#note)  for more infomation and a concrete example.

The second argument hash is optional.
- **minlength**: As a inputed character count reaches minlength, the suggestions are shown. Defaulults to `2`.
- **wildcard**: This option is a string for specifying wildcard in the URL. As an user inputs a value in the target form, the wildcard is replaced the value. Defaulults to `'%QUERY'`.
- **delay**: The suggestions are show after any **milliseconds** have passed. Defaulults to `400`.
- **count**: When this option is 5, suggestrap would show up to 5 suggestions. Defaulults to `5`.
- **id**: Specify an ID of a suggestion element. When the ID exists, suggestrap adds a suffix like `_2` to the end of the ID. Defaulults to `'suggestrap'`.
- **onClick**: Specify a click handler as an anonymous function for the suggestions.

### Note
When you'd like to specify an array object in a browser side instead of requesting a JSON file to a JSON server, you could use the values key. When an user inputs a value into a target form, suggestrap extracts suggestions from the array object with the value, which the user inputs. **In that case, the url key isn't required.** You don't need to specify the url key in the first argument. If you specify the values key and the url key at same time, the values key takes priority over the url key. This example is written with ES6.
```javascript
import Suggestrap from 'suggestrap'

const req = {
  target: "target",
  key: "name",
  values: [
    { name: "Andy" },
    { name: "Billy" },
    { name: "Catherine" },
    { name: "David" },
    { name: "Emily"},
    { name: "Henry"},
    { name: "Jack"},
    { name: "Kevin"},
    { name: "Mike"}
  ]
}

let suggestion = new Suggestrap(req)
```

## Customize
If you'd like to customize a css style of a suggestion element, you need to override the css style yourself.
```css
/* Example */
ul#suggestrap {
  background: #fff;
  border-radius: 3px;
  box-shadow: -2px 2px 7px rgba(0,0,0,0.3);
}
ul#suggestrap li {
  color: #333;
  padding: 1px 6px;
}
ul#suggestrap li.suggestrap-active,
ul#suggestrap li:hover {
  background: #4b89bf;
  color: #fff;
}
```

## Development

### How to start test-server.js
```bash
dokcer-compose exec node yarn run test
```
And then, access http:localhost:8080 with your browesr.

## License
[GPL-3.0](https://opensource.org/licenses/GPL-3.0)

## Author
[mrhorin](https://github.com/mrhorin)
