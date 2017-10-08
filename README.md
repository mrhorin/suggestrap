[![Build Status](https://travis-ci.org/mrhorin/suggestrap.svg?branch=master)](https://travis-ci.org/mrhorin/suggestrap)
[![npm version](https://badge.fury.io/js/suggestrap.svg)](https://badge.fury.io/js/suggestrap)
[![GitHub license](https://img.shields.io/badge/license-GPLv2-blue.svg)](https://raw.githubusercontent.com/mrhorin/suggestrap/master/LICENSE)  

[![NPM](https://nodei.co/npm/suggestrap.png)](https://nodei.co/npm/suggestrap/)

# suggestrap
![show](https://user-images.githubusercontent.com/6502717/31308201-7997988c-abad-11e7-865d-0507c59b6f6b.gif)  
This module could show suggestions from JSON on the input element.

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
import Suggestrap from 'js/suggestrap'

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
Suggestrap's to receive a JSON which is nest one hash.
```json
[
  {"id":1, "name":"James"},
  {"id":2, "name":"Jack"},
  {"id":3, "name":"Jane"},
  {"id":4, "name":"Jackie"}
]
```  

The first argument hash is required.
- `target`: Specify element id of target that you would like to show.
- `url`: The URL is for receive JSON. It must have wildcard. The JSON is used for to show suggestion.
- `key`: If you would like to show name key of JSON in suggestions, this value is 'name'.

The second argument hash is optional.
- `minlength`: As Inputted character count reaches minlength, show suggestions. Defaults to 2.
- `wildcard`: The option is string for specify wildcard in URL. As You input a value in the target form, the wildcard is replaced the value. Defaults to '%QUERY'.
- `delay`: As the target element fires a keyup event and then doesn't show suggestions soon until over 400 ms. The option is useful for doesn't make suggestrap to do necessary request. Defaults to 400.
- `count`: If this option is 5, suggestrap would show maxium 5 suggestions. Defaults to 5.

## Customize
If you want to customize suggestions css style, you've to override css styles.
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
