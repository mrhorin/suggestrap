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
1. Set up a JSON server to handle suggestions. When suggestrap makes a request to your server for a JSON file, the server should generate the JSON file using the request parameters from the URL and return it.
2. The JSON format should be an Array containing Objects like the following example. (However, you can also pass an Array using the `values` key in the first argument instead of requesting the JSON file to the server. For more details, please refer to [Example](#example) and [Option](#option))
```json
[
  {"id":1, "age":32, "name":"Jack"},
  {"id":2, "age":41, "name":"Jackie"},
  {"id":3, "age":41, "name":"Jake"},
  {"id":4, "age":20, "name":"James"},
  {"id":5, "age":28, "name":"Jane"}
]
```
3. After a user types a value into the target form, suggestrap replaces the wildcard in the URL with the value. For example, if the URL is 'https://example.com/json/users/%QUERY' and the input value is 'ja', suggestrap generates 'https://example.com/json/users/ja' and sends a requests to the server for the JSON file. The server then generates and returns the JSON file.
4. Once suggestrap receives the JSON file from your server, it generates a suggestion element next to the target form element using the JSON.

## Example

### When requesting a JSON to your server
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

let suggestrap = new Suggestrap(req, option)
```

### When passing Objects instead of requesting a JSON to your server
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

let suggestrap = new Suggestrap(req, option)
```

## Constructor

### req: Object

The first argument is required.

|Key|Format|Description|
|---|------|-----------|
|target|string|Specify an ID of a target form element, on which suggestrap shows suggestions|
|url|string|Specify an URL, e.g. https://example.com/json/users/%QUERY, for requesting a JSON file. The URL needs to include a wildcard like the example. You can also specify a string of the wildcard with the `wildcard` key in the second argument. When a user enters a value into the target form element, suggestrap replaces the wildcard with the input value.|
|key|string|Specify a key name of the JSON file that you'd like to show as suggestions.|
|values|Array|You can specify an Array containing Objects to show suggestions instead of requesting a JSON file. **In that case, the url key isn't required.** Besides, you can specify the JSON URL with this key like the `url` key. When you specify the JSON URL with this key, the behavior is completely same as the `url` key. It means that this key takes priority over the `url` key when you specify both of the `url` key and the `values` key at the same time.|

### option: Object

The second argument is optional.

|Key|Format|Default|Description|
|---|------|-------|-----------|
|minlength|number|2|Once an input character count reaches minlength, the suggestions are shown.|
|wildcard|string|"%QUERY"|This option is a string used to specify the wildcard in the URL. Once a user enters a value into the target form, the wildcard is replaced with the input value.|
|delay|number|400|Once a user enters a value into the form element, the suggestions are displayed after the `delay` key **milliseconds** have passed.|
|id|string|"suggestrap"|Specify an ID of the suggestion element. If the ID already exists, suggestrap will add `_2` as a suffix to the end of the ID.|
|clickHandler|function(event, value)||Specify an anonymous function with 2 arguments as a click handler for the suggestion elements. `event` is the Event interface for DOM. `value` is the value a user clicked. By default, the value clicked by the user in the suggestion elements is inserted into the tartget form element, and then the suggetion elements are hidden.|
|pressEnterHandler|function(event, value)||Specify an anonymous function with 2 arguments. It's triggered once a user pressed the Enter key on the target form element. `event` is the Event interface for DOM. `value` is the value the user selected. By default, the suggetions elements are hidden.|

## Properties
|Name|Format|Description|
|----|------|-----------|
|req|Object|The Object that you passed to the first argument.|
|option|Object|The Object that you passed to the second argument.|
|element|Object|The Object containing 3 Element objects. the `target` key holds the target form element you specified. the `suggestrap` key holds an `<ul>` element generated by suggestrap to show suggestions. the `style` key holds a `<style>` element generated by suggestrap and applied to the suggestion elements.|
|jsonUrl|string|A JSON URL with wildcards replaced by queries.|
|json|Array|A list of JSON suggestrap fetched from a JSON server.|
|suggestions|Array|A list of strings matching with a value a user typed into the target form element ,when you pass values to the `values` key in the first argument.|

## Methods

|Name|Return|Description|
|----|------|-----------|
|show()|boolean|Shows the suggestion elements and returns whether the elements show or not.|
|hide()|boolean|Hides the suggestion elements and returns whether the elements show or not.|
|moveUp()|number|Moves up the current position in the suggestion element and returns the index of the current position.|
|moveDown()|number|Moves down the current position in the suggestion element and returns the index of the current position.|
|hasUrl()|boolean|Returns true if you passed URL to the `url` key or the `values` key in the first argument, else false.|
|hasValues()|boolean|Returns true if you passed values to the `values` key in the first argument, else false.|

## CSS Customization

You can customize the CSS for the suggestion elements by overriding the style sheet and also specify an ID of the suggestion element with the `id` key in the second argument.
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
