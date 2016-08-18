_ = require 'lodash'

class window.Suggestrap

  constructor: (req, option)->
    throw "This browser doesn't support suggestrap." unless @isSupport()
    option = option || {}
    @args = _argsInitialize(req, option)
    _styleInitialize()
    @suggestInfoInitialize()
    @setSelector()
    @setEventListener()
    # @targetFormのkeyupイベントハンドラ
    @keyupHandler = _.debounce((event)=>
      # 文字数がminlength以上か && activeElementがターゲット要素か && 入力クエリと表示中サジェストの文字が異なるか
      if event.target.value.length >= @args["minlength"] && document.activeElement.id == @args["target"] && @suggestInfo["query"] != event.target.value
        @suggestInfo["query"] = event.target.value
        _jsonUrl = @getJsonUrl(event.target.value)
        # JSONの取得
        @fetchSuggestJson _jsonUrl, (json)=>
          if json.length > 0
            @addSuggest json
            @showSuggest()
      else
        @suggestInfo["query"] = ""
        @hideSuggest()
        @removeSuggest()
    , @args["delay"])

  setSelector: ->
    # サジェストしたいinputフォーム
    @targetForm = document.getElementById @args["target"]
    @targetForm.autocomplete = "off"
    # サジェスト表示用エレメント
    @suggest = document.createElement "ul"
    @suggest.id = "suggestrap-space"
    @suggest.style.backgroundColor = "#fff"
    @suggest.style.borderRadius = "5px"
    @suggest.style.boxShadow = "-2px 2px 7px rgba(0,0,0,0.3)"
    @suggest.style.listStyle = "none"
    @suggest.style.padding = "3px 0px"
    @suggest.style.fontSize = "1em"
    @suggest.style.position = "absolute"
    @suggest.style.top = "95%"
    @suggest.style.zIndex = "100"
    @suggest.style.margin = "0"
    @suggest.style.width = "auto"
    @suggest.style.height = "auto"
    @hideSuggest()
    # @targetFormの次に@suggestを追加
    @targetForm.parentNode.insertBefore @suggest, @targetForm.nextSibling

  setEventListener: ->
    # フォーム入力時
    @targetForm.addEventListener "keyup", (event)=>
      # 無効なkeyCode
      disabledKeyCode = [38, 40, 37, 39, 16, 17, 13]
      keyCode = event.keyCode
      if disabledKeyCode.indexOf(keyCode) == -1
        # 有効なキー入力時
        @keyupHandler(event)
      else if keyCode == 38
        @upSelectSeggest()
      else if keyCode == 40
        @downSelectSeggest()
      else if keyCode == 13
        if @suggestInfo["show"] && @suggestInfo["currentIndex"] != -1
          # サジェスト表示時は非表示に切り替え
          @hideSuggest()
        else
          @keyupHandler(event)
    # Mobile Safariで変換押下時にkeyupが発火しない時対策
    @targetForm.addEventListener "textInput", (event)=>
      @keyupHandler(event)
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
    xhr = new XMLHttpRequest();
    xhr.open 'GET', jsonUrl, true
    xhr.responseType = 'json'
    xhr.onreadystatechange = ()->
      if this.readyState == 4 && this.status == 200
        if this.response
          # 読み込んだ後の処理
          callbackFunc this.response
    xhr.send(null)

  # @suggestに追加
  addSuggest: (json)->
    @removeSuggest()
    # ie11対策
    if @checkBrowser("ie11") || @checkBrowser("ie10")
      _json = window.JSON.parse json
    else
      _json = json
    # 表示したサジェスト件数
    _displayed_count = 0
    # json要素の数だけelementを生成して追加
    for idx, val of _json
      _suggest_li = document.createElement "li"
      _suggest_li.style.textAlign = "left"
      _suggest_li.style.whiteSpace = "nowrap"
      _suggest_li.style.overflow = "hidden"
      _suggest_li.style.padding = "1px 6px"
      _suggest_li.innerHTML = val[@args["key"]]
      # サジェストclick時
      _suggest_li.addEventListener "click", (event)=>
        @targetForm.value = event.target.innerHTML
        @hideSuggest()
      @suggest.appendChild _suggest_li
      # @args["count"]に達したら追加処理を抜ける
      _displayed_count += 1
      break if  _displayed_count >= @args["count"]
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
    # query: 表示中のクエリ, show:表示状態, length:候補の件数, currentIndex:何番目の候補にいるか
    @suggestInfo = { query: "", show: false, length: 0, currentIndex: -1 }

  # 使用中のブラウザが対応しているか
  isSupport: ()->
    _supported = _getSuportedBrowsers()
    for idx, val of _supported
      return true if val
    return false

  # browserが使用中のブラウザか
  checkBrowser: (browser)->
    _supported = _getSuportedBrowsers()
    return _supported[browser]

  # サポートしているブラウザ一覧
  _getSuportedBrowsers = ->
    _ua = window.navigator.userAgent.toLowerCase()
    _ver = window.navigator.appVersion.toLowerCase()
    # IE11以外のIE
    _isMSIE = (_ua.indexOf('msie') > -1) && (_ua.indexOf('opera') == -1)
    return _supported =
      chrome: (_ua.indexOf('chrome') > -1) && (_ua.indexOf('edge') == -1) && (_ua.indexOf('opr/') == -1)
      firefox: (_ua.indexOf('firefox') > -1)
      safari: (_ua.indexOf('safari') > -1) && (_ua.indexOf('chrome') == -1)
      opera: (_ua.indexOf('opr/') != -1)
      edge: (_ua.indexOf('edge') > -1)
      ie11: (!_isMSIE && (_ua.indexOf('trident/7') > -1))
      ie10: (_isMSIE && (_ver.indexOf('msie 10.') > -1))

  # コンストラクタ引数の初期化
  _argsInitialize = (req, option)->
    # 必須項目
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
    # optionが未指定の場合デフォルト値を設定
    args["wildcard"] = option["wildcard"] || "%QUERY"
    args["minlength"] = option["minlength"] || 2
    args["delay"] = option["delay"] || 400
    args["count"] = option["count"] || 5
    return args

  # styleの初期化
  _styleInitialize = ()->
    _style = document.createElement "style"
    _css = "#suggestrap-space li{text-align:left;white-space:nowrap;overflow:hidden;padding:1px 6px}#suggestrap-space li.active,#suggestrap-space li:hover{cursor:pointer;background-color:#4b89bf;color:#fff}"
    _style.appendChild document.createTextNode _css
    # headタグの末尾に追加
    document.getElementsByTagName('head')[0].appendChild _style
