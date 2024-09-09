[![Build Status](https://travis-ci.org/mrhorin/suggestrap.svg?branch=master)](https://travis-ci.org/mrhorin/suggestrap)
[![npm version](https://badge.fury.io/js/suggestrap.svg)](https://badge.fury.io/js/suggestrap)
![npm](https://img.shields.io/npm/dt/suggestrap.svg)
[![GitHub license](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://raw.githubusercontent.com/mrhorin/suggestrap/master/LICENSE)

[![NPM](https://nodei.co/npm/suggestrap.png)](https://nodei.co/npm/suggestrap/)

# suggestrap
![show](https://user-images.githubusercontent.com/6502717/49056240-4c7db100-f23e-11e8-9a2e-863f59ad84a7.gif)

suggestrap can show suggestions by requesting a JSON file to a JSON API server that you prepared.

## Installation
npm:
```bash
npm install suggestrap
```
yarn:
```bash
yarn add suggestrap
```

## Usage
1. Prepare a JSON server for suggestions yourself. When suggestrap requests a JSON file to your server, the server needs to generate a JSON file with a request parameter, a part of the request URL and then to return the JSON file.
2. The JSON format is an array object that has hash objects like the following example. (However, you can also specify an array object for suggestions on the browser side instead of requesting the JSON file to the server. For more details, please refer to [Example](#example) and [Option](#option))
```json
[
  {"id":1, "age":32, "name":"Jack"},
  {"id":2, "age":41, "name":"Jackie"},
  {"id":3, "age":41, "name":"Jake"},
  {"id":4, "age":20, "name":"James"},
  {"id":5, "age":28, "name":"Jane"}
]
```
3. When an user types a value into a target form, suggestrap replaces a wildcard, a part of the JSON URL, with the value. For example, if the JSON URL is 'https://example.com/json/users/%QUERY' and the input value is 'ja', suggestrap genetates 'https://example.com/json/users/ja' and then requests a JSON file to the server. After that, the server generates a JSON with the value and then returns it.
4. Since suggestrap received the JSON, it genarates a suggestion element next to the target form element from the JSON.

## Example

### JSON server
html:
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

babel:
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

### Hash objects
html:
```html
<input id="target" type="text">

<script src="./suggestrap/lib/suggestrap.js"></script>
<script>
  var req = {
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
  };
  var option = {
    minlength: 2,
    delay: 400,
    count: 5,
    id: "suggestrap"
  };
  var suggestrap = new Suggestrap(req, option);
</script>
```

babel:
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

const option = {
  minlength: 2,
  delay: 400,
  count: 5,
  id: "suggestrap"
}

let suggestion = new Suggestrap(req, option)
```

## request

The first argument is required.

|Key|Format|Description|
|---|------|-----------|
|target|string|Specify an ID of a target form element, on which suggestrap show suggestions|
|url|string|Specify an URL, e.g. https://example.com/json/users/%QUERY, for requesting a JSON file. The URL needs to include a wildcard like the example. You can also specify a string of the wildcard with the wildcard key in the second argument. When an user input a value into the target form element, suggestrap replaces the wildcard with the input value.|
|key|string|Specify a key name of the JSON file that you'd like to show as suggestions.|
|values|array|You can specify an array object that has hash objects to show suggestions instead of requesting a JSON file. **In that case, the url key isn't required.** Besides, you can specify the JSON URL with this key like the url key. When you specify the JSON URL with this key, the behavior is completely same as the url key. It means that this key takes priority over the url key when you specify both of url and values key at the same time.|

## option

The second argument is optional.

|Key|Format|Default|Description|
|---|------|-------|-----------|
|minlength|number|2|Once an input character count reaches minlength, the suggestions are shown.|
|wildcard|string|"%QUERY"|This option is a string for specifying wildcard in the URL. Since an user input a value in the target form, the wildcard is replaced with the input value.|
|delay|number|400|The suggestions are show after any **milliseconds** have passed.|
|id|string|"suggestrap"|Specify an ID for the suggestion element. If the ID already exists, suggestrap will add `_2` as a suffix to the end of the ID.|
|onClick|function(event, value)||Specify an anonymous function with 2 arguments as a click handler for the suggestion elements. `event` is the Event interface for DOM. `value` is the value that an user clicked. By default, the value clicked by an user in the suggestion elements is set into the tartget form element, and then the suggetion elements hide.|

## Customization

You can customize the CSS for the suggestion elements by overriding the style sheet and also specify an ID of the suggestion element with the id key in the second argument.
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
And then, access http://localhost:8080 with your browesr.

## License
[GPL-3.0](https://opensource.org/licenses/GPL-3.0)

## Author
[mrhorin](https://github.com/mrhorin)
