# suggestrap
The UI component of sugestrap is able to show suggestions from JSON.
## Install
Install with [Bower](https://bower.io/).
```
bower install suggestrap
```
## Usage
Suggestions elements as absolute css style will be inserted after the target element by suggestrap. Its position depend on parent element of the target element, so the parent element css style must be relative.
```html
<div style="position: relative;">
  <input id="target" type="text">
  <input type="submit" value="submit">
</form>
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
    wildcard: "%QUERY"
  };
  suggestrap = new window.Suggestrap(req, option);
}
```
The first argument hash in Suggestrap object is required items.
- `target`: The input tag element's id of target that you would like to suggest.
- `url`: Link to JSON. '%QUERY' is request params, inputed value in target element is set into its.
- `key`: if you would like to show JSON's 'name' key in suggestions, this value is 'name'.

The second argument hash in Suggestrap object is optional item.
- `minlength`: The minimum character length needed before suggestions start getting rendered. Defaults to '2'.
- `wildcard`: Request params's wild card for JSON. Defaults to '%QUERY'.

If you don't understand about this README.md document, there are demo.html file in './dist/html/' directory, please show this file from your browser.
## Customize
If you want to customize suggestions css style, you have to override css styles on '#suggestrap-space' or its inner list elements.
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
I have checked operation by these browsers.
- Google Chrome 51
- Firefox 38
- Safari 9
- Microsoft Edge 25
