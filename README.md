# suggestrap
The UI component of sugestrap is able to show suggestions from JSON.
## Usage
```html
<input id="target" type="text">
<input type="submit" value="submit">
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
- `url`: Link to JSON. '%QUERY' is request params. Inputed value in target element is set into in its.
- `key`: if you would like to show JSON's 'name' key in suggestions, Its value is 'key'.

The second argument hash in Suggestrap object is optional item.
- `minlength`: The minimum character length needed before suggestions start getting rendered. Defaults to '2'.
- `wildcard`: Request params's wild card for JSON. Defaults to '%QUERY'.

If you don't understand about this README.md document, there are demo.html file in './dist/html/' directory, please show this file from your browser.
