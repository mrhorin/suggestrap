# suggestrap
The UI component of sugestrap is able to show suggestions from JSON.
## Usage
```html
<input id="target" type="text">
<input type="submit" value="submit">
```
Suggestrap receive this JSON, so it need to nest one.
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
The first argument hash is required items.
- `target`: The input tag element's id that you want to suggest.
- `url`: Link to JSON. '%QUERY' is request params. Inputed value in target element is set into in its.
- `key`: if you would like to show JSON's 'name' key in suggestions, Its value is 'key'.

The second argument hash is optional item.
- `minlength`: The minimum character length needed before suggestions start getting rendered. Defaults to '2'.
- `wildcard`: Request params's wild card for JSON. Defaults to '%QUERY'.
