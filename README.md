[![Build Status](https://travis-ci.org/mrhorin/suggestrap.svg?branch=master)](https://travis-ci.org/mrhorin/suggestrap)
[![npm version](https://badge.fury.io/js/suggestrap.svg)](https://badge.fury.io/js/suggestrap)
[![GitHub license](https://img.shields.io/badge/license-GPLv2-blue.svg)](https://raw.githubusercontent.com/mrhorin/suggestrap/master/LICENSE)  

[![NPM](https://nodei.co/npm/suggestrap.png)](https://nodei.co/npm/suggestrap/)

# suggestrap
![show](https://user-images.githubusercontent.com/6502717/31308201-7997988c-abad-11e7-865d-0507c59b6f6b.gif)  
This module could show suggestions from JSON on an input element.

## Install
Install with [npm](https://www.npmjs.com/).
```
npm install suggestrap
```

## Usage
The suggestion elements are created by suggestrap and then it is inserted into next to the target element.  
```html
<input id="target" type="text">
<button type="submit" value="submit">
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
  count: 5
}

var suggestrap = new Suggestrap(req, option)
```
Suggestrap have to receive an array which has objects for showing suggestions as JSON.
```json
[
  {"id":1, "age":20, "name":"James"},
  {"id":2, "age":32, "name":"Jack"},
  {"id":3, "age":28, "name":"Jane"},
  {"id":4, "age":41, "name":"Jackie"}
]
```  

The first argument hash is required.
- `target`: Specify a target form element id which you would like to show.
- `url`: Specify an URL for receiving JSON. The URL have to include a wildcard.
- `key`: If you would like to show names in suggestions from JSON objects, this value is 'name'.

The second argument hash is optional.
- `minlength`: As inputed character count reaches minlength, the suggestions are shown. Defaults to 2.
- `wildcard`: This option is a string for specifying wildcard in the URL. As You enter a value in the target form, the wildcard is replaced the value which you entered. Defaults to '%QUERY'.
- `delay`: The suggestions are show after any milliseconds have passed. Defaults to 400.
- `count`: If this option is 5, suggestrap would show up to 5 suggestions. Defaults to 5.

## Customize
If you would like to customize suggestions css style, you need to override css styles yourself.
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
[GPL-2.0](https://opensource.org/licenses/GPL-2.0)

## Author
[mrhorin](https://github.com/mrhorin)
