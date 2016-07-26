_ = require 'underscore'

class window.Suggestrap

  constructor: (req, option)->
    option = option || {}
    @args = _argsInitialize(req, option)
    @suggestInfoInitialize()
    @setSelector()
    @setEventListener()
    # @targetFormのkeyupイベントハンドラ
    @keyupHandler = _.debounce((event)=>
      # 文字数がminlength以上か
      if event.target.value.length >= @args["minlength"]
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
    @targetForm = document.getElementById @args["target"]
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
      # 無効なキー入力パターン
      disabledKeyPtn = new RegExp "(ArrowUp)|(ArrowDown)|(ArrowLeft)|(ArrowRight)|(Shift)|(Control)|(Enter)", "ig"
      if event.key.match(disabledKeyPtn) == null
        # 有効なキー入力時
        @keyupHandler(event)
      else if event.key.match(/ArrowUp/ig)
        @upSelectSeggest()
      else if event.key.match(/ArrowDown/ig)
        @downSelectSeggest()
      else if event.key.match(/Enter/ig)
        @hideSuggest()
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
    return @args["url"].replace(///#{@args["wildcard"]}///gi, targetValue)

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
    # json要素の数だけelementを生成して追加
    for val in json
      _suggest_li = document.createElement "li"
      _suggest_li.innerHTML = val[@args["key"]]
      # サジェストclick時
      _suggest_li.addEventListener "click", (event)=>
        @targetForm.value = event.target.innerHTML
        @hideSuggest()
      @suggest.appendChild _suggest_li
    @suggestInfo["length"] = @suggest.childNodes.length
    @suggestInfo["currentIndex"] = -1

  # @suggestの子ノードを全削除
  removeSuggest: ()->
    for node, index in @suggest.childNodes
      @suggest.removeChild @suggest.childNodes[0]
    @suggestInfoInitialize()

  # @suggestを表示
  showSuggest: ()->
    @suggest.style.display = "block"
    @suggestInfo["show"] = true

  # @suggestを非表示
  hideSuggest: ()->
    @suggest.style.display = "none"
    @suggestInfo["show"] = false

  # 選択中のサジェストを上へ
  upSelectSeggest: ()->
    if @suggestInfo["show"]
      if @suggestInfo["currentIndex"] > -1
        @suggestInfo["currentIndex"] = @suggestInfo["currentIndex"] - 1
      else
        @suggestInfo["currentIndex"] = @suggestInfo["length"] - 1
      @activeSelectSuggest()

  # 選択中のサジェストを下へ
  downSelectSeggest: ()->
    if @suggestInfo["show"]
      if @suggestInfo["currentIndex"] == @suggestInfo["length"] - 1
        @suggestInfo["currentIndex"] = -1
      else
        @suggestInfo["currentIndex"] = @suggestInfo["currentIndex"] + 1
      @activeSelectSuggest()

  # 選択中のサジェストをアクティブに
  activeSelectSuggest: ()->
    for node in @suggest.childNodes
      node.className = ""
    switch @suggestInfo["currentIndex"]
      when -1
        break
      else
        @suggest.childNodes[@suggestInfo["currentIndex"]].className = "active"
        @targetForm.value =  @suggest.childNodes[@suggestInfo["currentIndex"]].innerHTML

  # サジェスト情報の初期化
  suggestInfoInitialize: ()->
    @suggestInfo = { show: false, length: 0, currentIndex: -1 }

  # コンストラクタ引数の初期化
  _argsInitialize = (req, option)->
    # optionが未指定の場合デフォルト値を設定
    unless req["target"]?
      throw "target is not found. This argument is necessary."
    unless req["url"]?
      throw "url is not found. This argument is necessary."
    unless req["key"]?
      throw "key is not found. This argument is necessary."
    args =
      target: req["target"]
      url: req["url"]
      key: req["key"]
    args["wildcard"] = option["wildcard"] || "%QUERY"
    args["minlength"] = option["minlength"] || 2
    return args
