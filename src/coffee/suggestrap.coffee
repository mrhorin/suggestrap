class window.Suggestrap
  # 矢印でもイベントが発生するから keyup 以外に
  # keyup だとローマ字入力する度に発火してJSONリクエストしまう問題
  # サジェスト表示時に上下入力で選択できるように
  # れどめ書く

  constructor: (option)->
    @option = _optionInitialize(option)
    @setSelector()
    @createSuggest()
    @setEventListener()

  setSelector: ->
    @targetForm = document.getElementById @option["target"]

  setEventListener: ->
    # フォーム入力時
    @targetForm.addEventListener "keyup", (event)=>
      if event.target.value.length >= @option["minlength"]
        _jsonUrl = @getJsonUrl(event.target.value)
        # _jsonUrlにajaxでリクエスト
        @fetchSuggestJson _jsonUrl, (json)=>
          @showSuggest json
    # フォームのフォーカス時
    @targetForm.addEventListener "focus", (event)=>
      if event.target.value.length >= @option["minlength"]
        @suggest.style = "display: block;"
    # フォームのフォーカスがはずれた時
    @targetForm.addEventListener "blur", (event)=>
      @suggest.style = "display: none;"

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

  # @suggestを表示
  showSuggest: (json)->
    @removeSuggest()
    # json要素の数だけelementを生成して追加するループ
    for val in json
      _suggest_li = document.createElement "li"
      _suggest_li.innerHTML = val[@option["key"]]
      _suggest_li.addEventListener "click", (event)=>
        @targetForm.value = event.target.innerHTML
        @suggest.style = "display: none;"
      @suggest.appendChild _suggest_li
    @suggest.style = "display: block;"

  # @suggestの子ノードを全削除
  removeSuggest: ()->
    for node, index in @suggest.childNodes
      @suggest.removeChild @suggest.childNodes[0]

  # @suggestを生成
  createSuggest: ->
    @suggest = document.createElement "ul"
    @suggest.id = "suggestrap-space"
    @suggest.style = "display: none;"
    @targetForm.parentNode.insertBefore @suggest, @targetForm.nextSibling

  # optionの初期化
  _optionInitialize = (option)->
    # optionが未指定の場合デフォルト値を設定
    unless option["target"]?
      throw "target is not found. This option is necessary."
    unless option["url"]?
      throw "url is not found. This option is necessary."
    unless option["key"]?
      throw "key is not found. This option is necessary."
    unless option["wildcard"]?
      option["wildcard"] = "%QUERY"
    unless option["minlength"]?
      option["minlength"] = 2
    return option
