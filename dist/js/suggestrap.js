(function() {
  var _;

  _ = require('underscore');

  window.Suggestrap = (function() {
    var _argsInitialize;

    function Suggestrap(req, option) {
      option = option || {};
      this.args = _argsInitialize(req, option);
      this.suggestInfoInitialize();
      this.setSelector();
      this.setEventListener();
      this.keyupHandler = _.debounce((function(_this) {
        return function(event) {
          var _jsonUrl;
          if (event.target.value.length >= _this.args["minlength"]) {
            _jsonUrl = _this.getJsonUrl(event.target.value);
            return _this.fetchSuggestJson(_jsonUrl, function(json) {
              _this.addSuggest(json);
              return _this.showSuggest();
            });
          } else {
            _this.hideSuggest();
            return _this.removeSuggest();
          }
        };
      })(this), 400);
    }

    Suggestrap.prototype.setSelector = function() {
      this.targetForm = document.getElementById(this.args["target"]);
      this.targetForm.autocomplete = "off";
      this.suggest = document.createElement("ul");
      this.suggest.id = "suggestrap-space";
      this.hideSuggest();
      return this.targetForm.parentNode.insertBefore(this.suggest, this.targetForm.nextSibling);
    };

    Suggestrap.prototype.setEventListener = function() {
      this.targetForm.addEventListener("keyup", (function(_this) {
        return function(event) {
          var disabledKeyPtn;
          disabledKeyPtn = new RegExp("(ArrowUp)|(ArrowDown)|(ArrowLeft)|(ArrowRight)|(Shift)|(Control)|(Enter)", "ig");
          if (event.key.match(disabledKeyPtn) === null) {
            return _this.keyupHandler(event);
          } else if (event.key.match(/ArrowUp/ig)) {
            return _this.upSelectSeggest();
          } else if (event.key.match(/ArrowDown/ig)) {
            return _this.downSelectSeggest();
          } else if (event.key.match(/Enter/ig)) {
            if (_this.suggestInfo["show"]) {
              return _this.hideSuggest();
            } else {
              return _this.keyupHandler(event);
            }
          }
        };
      })(this));
      this.targetForm.addEventListener("focus", (function(_this) {
        return function(event) {
          return _this.keyupHandler(event);
        };
      })(this));
      return this.targetForm.addEventListener("blur", (function(_this) {
        return function(event) {
          return _.delay(function() {
            return _this.hideSuggest();
          }, 200);
        };
      })(this));
    };

    Suggestrap.prototype.getJsonUrl = function(targetValue) {
      return this.args["url"].replace(RegExp("" + this.args["wildcard"], "gi"), targetValue);
    };

    Suggestrap.prototype.fetchSuggestJson = function(jsonUrl, callbackFunc) {
      var xmlHttpRequest;
      xmlHttpRequest = new XMLHttpRequest();
      xmlHttpRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          if (this.response) {
            return callbackFunc(this.response);
          }
        }
      };
      xmlHttpRequest.open('GET', jsonUrl, true);
      xmlHttpRequest.responseType = 'json';
      return xmlHttpRequest.send(null);
    };

    Suggestrap.prototype.addSuggest = function(json) {
      var _suggest_li, i, len, val;
      this.removeSuggest();
      for (i = 0, len = json.length; i < len; i++) {
        val = json[i];
        _suggest_li = document.createElement("li");
        _suggest_li.innerHTML = val[this.args["key"]];
        _suggest_li.addEventListener("click", (function(_this) {
          return function(event) {
            _this.targetForm.value = event.target.innerHTML;
            return _this.hideSuggest();
          };
        })(this));
        this.suggest.appendChild(_suggest_li);
      }
      this.suggestInfo["length"] = this.suggest.childNodes.length;
      return this.suggestInfo["currentIndex"] = -1;
    };

    Suggestrap.prototype.removeSuggest = function() {
      var i, index, len, node, ref;
      ref = this.suggest.childNodes;
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        node = ref[index];
        this.suggest.removeChild(this.suggest.childNodes[0]);
      }
      return this.suggestInfoInitialize();
    };

    Suggestrap.prototype.showSuggest = function() {
      this.suggest.style.display = "block";
      return this.suggestInfo["show"] = true;
    };

    Suggestrap.prototype.hideSuggest = function() {
      this.suggest.style.display = "none";
      return this.suggestInfo["show"] = false;
    };

    Suggestrap.prototype.upSelectSeggest = function() {
      if (this.suggestInfo["show"]) {
        if (this.suggestInfo["currentIndex"] > -1) {
          this.suggestInfo["currentIndex"] = this.suggestInfo["currentIndex"] - 1;
        } else {
          this.suggestInfo["currentIndex"] = this.suggestInfo["length"] - 1;
        }
        return this.activeSelectSuggest();
      }
    };

    Suggestrap.prototype.downSelectSeggest = function() {
      if (this.suggestInfo["show"]) {
        if (this.suggestInfo["currentIndex"] === this.suggestInfo["length"] - 1) {
          this.suggestInfo["currentIndex"] = -1;
        } else {
          this.suggestInfo["currentIndex"] = this.suggestInfo["currentIndex"] + 1;
        }
        return this.activeSelectSuggest();
      }
    };

    Suggestrap.prototype.activeSelectSuggest = function() {
      var i, len, node, ref;
      ref = this.suggest.childNodes;
      for (i = 0, len = ref.length; i < len; i++) {
        node = ref[i];
        node.className = "";
      }
      switch (this.suggestInfo["currentIndex"]) {
        case -1:
          break;
        default:
          this.suggest.childNodes[this.suggestInfo["currentIndex"]].className = "active";
          return this.targetForm.value = this.suggest.childNodes[this.suggestInfo["currentIndex"]].innerHTML;
      }
    };

    Suggestrap.prototype.suggestInfoInitialize = function() {
      return this.suggestInfo = {
        show: false,
        length: 0,
        currentIndex: -1
      };
    };

    _argsInitialize = function(req, option) {
      var args;
      if (req["target"] == null) {
        throw "target is not found. This argument is necessary.";
      }
      if (req["url"] == null) {
        throw "url is not found. This argument is necessary.";
      }
      if (req["key"] == null) {
        throw "key is not found. This argument is necessary.";
      }
      args = {
        target: req["target"],
        url: req["url"],
        key: req["key"]
      };
      args["wildcard"] = option["wildcard"] || "%QUERY";
      args["minlength"] = option["minlength"] || 2;
      return args;
    };

    return Suggestrap;

  })();

}).call(this);
