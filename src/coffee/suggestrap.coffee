class window.Suggestrap

  constructor: (option)->
    @option = _optionInitialize(option)
    @setSelector()
    @setEventListener()

  setSelector: ->
    @targetForm = document.getElementById @option["target"]

  setEventListener: ->
    @targetForm.addEventListener "keyup", (event)=>
      if event.target.value.length >= @option["minlength"]
        _jsonUrl = @getJsonUrl(event.target.value)
        # URLにajaxでリクエストしてjsonを取得
        @fetchSuggestJson _jsonUrl, (json)->
          console.log json

  # サジェスト用JSONをjsonUrlから取得
  fetchSuggestJson: (jsonUrl, callbackFunc)->
    xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onreadystatechange = ()->
      if this.readyState == 4 && this.status == 200
        if this.response
          # 読み込んだ後の処理
          callbackFunc this.response
    xmlHttpRequest.open 'GET', jsonUrl, true
    xmlHttpRequest.responseType = 'json'
    xmlHttpRequest.send(null)

  # JSON用URLを取得
  getJsonUrl: (targetValue)->
    return @option["url"].replace(///#{@option["wildcard"]}///gi, targetValue)

  # optionの初期化
  _optionInitialize = (option)->
    # optionが未指定の場合デフォルト値を設定
    unless option["target"]?
      throw "target is not found. This option is necessary."
    unless option["url"]?
      throw "url is not found. This option is necessary."
    unless option["wildcard"]?
      option["wildcard"] = "%QUERY"
    unless option["minlength"]?
      option["minlength"] = 2
    return option
