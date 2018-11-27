[![Build Status](https://travis-ci.org/mrhorin/suggestrap.svg?branch=master)](https://travis-ci.org/mrhorin/suggestrap)
[![npm version](https://badge.fury.io/js/suggestrap.svg)](https://badge.fury.io/js/suggestrap)
[![GitHub license](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://raw.githubusercontent.com/mrhorin/suggestrap/master/LICENSE)  

[![NPM](https://nodei.co/npm/suggestrap.png)](https://nodei.co/npm/suggestrap/)

# suggestrap
![show](https://user-images.githubusercontent.com/6502717/49056240-4c7db100-f23e-11e8-9a2e-863f59ad84a7.gif)  
This module could show suggestions from JSON URL on an input form element.

## Install
Install with [npm](https://www.npmjs.com/).
```
npm install suggestrap
```

## Usage
A suggestion element is created by suggestrap and then it is inserted into next to the target element which you specify.  
```html
<input id="target" type="text">
```
This example is written with ES6.  
```javascript
import Suggestrap from 'suggestrap'

const req = {
  target: "target",
  url: "http://example.com/json/users/%QUERY",
  key: "name"
}
const option = {
  minlength: 2,
  wildcard: "%QUERY",
  delay: 400,
  count: 5,
  id: 'suggestrap'
}

var suggestion = new Suggestrap(req, option)
```
Suggestrap have to receive a JSON. The JSON format is an array which has objects.
```json
[
  {"id":1, "age":32, "name":"Jack"},
  {"id":2, "age":41, "name":"Jackie"},
  {"id":3, "age":41, "name":"Jake"},
  {"id":4, "age":20, "name":"James"},
  {"id":5, "age":28, "name":"Jane"}
]
```  

The first argument hash is required.
- `target`: Specify a target form element ID which you would like to show.
- `url`: Specify an URL for receiving JSON. The URL have to include a wildcard like the example above.
- `key`: Specify a key name of JSON objects which you'd like to show.
- `values`: If you'd like to show suggestions from an Array object instead of JSON URL, you can input it with this key. **In that case, the url key isn't required.** Besides, you can specify JSON URL with this key like the url key. When you specify JSON URL, the behavior is same as the url key completely. This key takes priority over the url key when you specify url and values key at same time.

The second argument hash is optional.
- `minlength`: As inputed character count reaches minlength, the suggestion are shown. Defaults to 2.
- `wildcard`: This option is a string for specifying wildcard in the URL. As You enter a value in the target form, the wildcard is replaced the value which you entered. Defaults to '%QUERY'.
- `delay`: The suggestions are show after any milliseconds have passed. Defaults to 400.
- `count`: When this option is 5, suggestrap would show up to 5 suggestions. Defaults to 5.
- `id`: Specify a suggestion element ID. Defalults to 'suggestrap'.

## Customize
If you would like to customize a css style of a suggestion, you need to override the css style yourself.
```css
/* Example */
ul#suggestrap {
  top: 50px;
  border-radius: 0px;
  padding: 10px 0px;
}
ul#suggestrap li {
  font-size: 15px;
}
ul#suggestrap li.active,
ul#suggestrap li:hover {
  background-color: #5bc0de;
}
```

## License
[GPL-3.0](https://opensource.org/licenses/GPL-3.0)

## Author
[mrhorin](https://github.com/mrhorin)
