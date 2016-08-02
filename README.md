# suggestrap
The UI component of suggestrap is able to show suggestions from JSON.
## Install
Install with [Bower](https://bower.io/).
```
bower install suggestrap
```
## Usage
You need to include `suggestrap.main.min.js` in the head tag element.  
Suggestions elements as absolute css style will be inserted after the target element by suggestrap. Its position depend on parent element of the target element, so the parent element css style must be relative.
```html
<div style="position: relative;">
  <input id="target" type="text">
  <input type="submit" value="submit">
</div>
```
Suggestrap must receive JSON which is nest one hash.
```json
[
  {"id":1, "name":"satoru"},
  {"id":2, "name":"shigeru"},
  {"id":3, "name":"shigesato"},
  {"id":4, "name":"satoshi"}
]
```  
This code must write in after ready event.  
```javascript
window.onload = function(){
  req = {
    target: "target",
    url: "http://example.com/name/json/%QUERY",
    key: "name"
  };
  option = {
    minlength: 2,
    wildcard: "%QUERY",
    delay: 400,
    count: 5
  };
  suggestrap = new Suggestrap(req, option);
}
```
The first argument hash in Suggestrap object is required items.
- `target`: The input tag element's id of target that you would like to suggest.
- `url`: Link to JSON. '%QUERY' is request params, inputed value in target element is set into its.
- `key`: if you would like to show name key of JSON in suggestions, this value is 'name'.

The second argument hash in Suggestrap object is optional item.
- `minlength`: The minimum character length needed before suggestions start getting rendered. Defaults to 2.
- `wildcard`: Request params's wild card for JSON. Defaults to '%QUERY'.
- `delay`: If target element fire the keyup event and don't fire the next keyup event until over 400ms, suggestrap would show the suggestions from inputed value. The  option purpose is that don't increase request for JSON URL. Defaults to 400.
- `count`: If this option is 10, suggestrap would show maxium 10 suggestions. Defaults to 5.

If you don't understand about this README.md document, there are demo.html file in './dist/html/' directory, please show this file from your browser.
## Customize
If you want to customize suggestions css style, you've to override css styles on '#suggestrap-space' or its inner list elements.
```css
/* For example */
#suggestrap-space {
  top: 50px;
  border-radius: 0px;
  padding: 10px 0px;
}
#suggestrap-space li {
  font-size: 15px;
}
#suggestrap-space li.active,
#suggestrap-space li:hover {
  background-color: #5bc0de;
}

```
## Browser Support
I've confirmed operation by these browsers.
- Google Chrome 51
- Firefox 38
- Safari 9 OS X El Capitan
- Safari 9 iOS 9
- Opera 38
- Microsoft Edge 25
- Internet Explorer 10-11

## License
[GPL-2.0](https://opensource.org/licenses/GPL-2.0)

## Author
[mrhorin](https://github.com/mrhorin)
