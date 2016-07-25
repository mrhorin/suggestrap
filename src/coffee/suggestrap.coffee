_ = require 'underscore'

class window.Suggestrap
  # サジェスト表示時に上下入力でサジェストを選択できるように
  # れどめ書く

  constructor: (option)->
    @option = _optionInitialize(option)
    @setSelector()
    @setEventListener()
    # @targetFormのkeyupイベントハンドラ
    @keyupHandler = _.debounce((event)=>
      # 文字数がminlength以上か
      if event.target.value.length >= @option["minlength"]
        _jsonUrl = @getJsonUrl(event.target.value)
        # JSONの取得
        @fetchSuggestJson _jsonUrl, (json)=>
          @addSuggest json
          @showSuggest()
      else
        @hideSuggest()
        @removeSuggest()
    , 400)

  setSelector: ->
    # サジェストしたいinputフォーム
    @targetForm = document.getElementById @option["target"]
    @targetForm.autocomplete = "off"
    # サジェスト表示用エレメント
    @suggest = document.createElement "ul"
    @suggest.id = "suggestrap-space"
    @hideSuggest()
    # @targetFormの次に@suggestを追加
    @targetForm.parentNode.insertBefore @suggest, @targetForm.nextSibling

  setEventListener: ->
    # フォーム入力時
    @targetForm.addEventListener "keyup", (event)=>
      # 無効なキー入力
      disabledKeyPtn = new RegExp "(Up)|(Down)|(Left)|(Right)|(Shift)|(Control)", "ig"
      if event.keyIdentifier.match(disabledKeyPtn) == null
        @keyupHandler(event)
      else if event.keyIdentifier.match(/Up/ig)
        console.log "Up"
      else if event.keyIdentifier.match(/Down/ig)
        console.log "Down"
    # フォームのフォーカス時
    @targetForm.addEventListener "focus", (event)=>
      @keyupHandler(event)
    # フォームのフォーカスがはずれた時
    @targetForm.addEventListener "blur", (event)=>
      # @suggest.childNodesのclickイベント発火を優先させる為にdelay
      _.delay(()=>
        @hideSuggest()
      , 200)

  # JSON取得URLを取得
  getJsonUrl: (targetValue)->
    return @option["url"].replace(///#{@option["wildcard"]}///gi, targetValue)

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

  # @suggestに追加
  addSuggest: (json)->
    @removeSuggest()
    # json要素の数だけelementを生成して追加するループ
    for val in json
      _suggest_li = document.createElement "li"
      _suggest_li.innerHTML = val[@option["key"]]
      # サジェストclick時
      _suggest_li.addEventListener "click", (event)=>
        @targetForm.value = event.target.innerHTML
        @hideSuggest()
      @suggest.appendChild _suggest_li

  # @suggestの子ノードを全削除
  removeSuggest: ()->
    for node, index in @suggest.childNodes
      @suggest.removeChild @suggest.childNodes[0]

  # @suggestを表示
  showSuggest: ()->
    @suggest.style.display = "block"

  # @suggestを非表示
  hideSuggest: ()->
    @suggest.style.display = "none"

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
