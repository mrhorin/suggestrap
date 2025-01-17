import '@babel/polyfill'
import _ from 'lodash'
import request from 'superagent'

export default class Suggestrap {

  constructor(req, option = {}) {
    this.req = this._initializeReq(req)
    this.option = this._initializeOption(option)
    this.json = []
    // A state of suggestions
    this.state = this._initializeState()
    // Html elements for showing suggestions
    this.element = this._initializeElements()
    this._setEventListener()
    this.hide()
  }

  // A JSON URL with wildcards replaced by queries
  get jsonUrl() {
    if (this.hasUrl() && 'values' in this.req) {
      return this.req.values.replace(this.option.wildcard, this.state.query)
    } else if (this.hasUrl() && 'url' in this.req) {
      return this.req.url.replace(this.option.wildcard, this.state.query)
    } else {
      console.warn("JSON URL isn't found because Suggestrap don't have an URL.")
      return ""
    }
  }

  // A list of suggestions matching query with the values in the first argument
  get suggestions() {
    let res = []
    if (this.req.values && this.state.query) {
      let pattern = new RegExp(this.state.query, 'i')
      for (let index = 0; index < this.req.values.length && res.length < this.option.count; index++){
        if (this.req.values[index][this.req.key].match(pattern)) {
          res.push(this.req.values[index])
        }
      }
    }
    return res
  }

  show() {
    // Set suggest position
    let rect = this.element['target'].getBoundingClientRect()
    let x = this.element['target'].offsetLeft
    let y = this.element['target'].offsetTop + rect.height
    this.element['suggestrap'].style.left = Math.round(x).toString() + 'px'
    this.element['suggestrap'].style.top = Math.round(y).toString() + 'px'
    this.element['suggestrap'].style.visibility = 'visible'
    this.state['isShow'] = true
    return this.state['isShow']
  }

  hide() {
    if (this.state['isShow']) {
      this.element['suggestrap'].style.visibility = 'hidden'
      this.state['isShow'] = false
      this.state['currentIndex'] = -1
    }
    return this.state['isShow']
  }

  moveUp() {
    if (this.state['isShow']) {
      if (this.state['currentIndex'] > -1) {
        this.state['currentIndex'] -= 1
      } else {
        this.state['currentIndex'] = this.element['suggestrap'].childNodes.length - 1
      }
      this._activeCurrentSuggest()
    }
    return this.state['currentIndex']
  }

  moveDown() {
    if (this.state['isShow']) {
      if (this.state['currentIndex'] == this.element['suggestrap'].childNodes.length - 1) {
        this.state['currentIndex'] = -1
      } else {
        this.state['currentIndex'] += 1
      }
      this._activeCurrentSuggest()
    }
    return this.state['currentIndex']
  }

  hasValues() {
    return (
      'values' in this.req &&
      typeof this.req.values == 'object' &&
      this.req.values.length > 0
    )
  }

  hasUrl() {
    return (
      ('values'in this.req &&
        typeof this.req.values == 'string' &&
        this._validateUrl(this.req.values)
      ) ||
      ('url' in this.req &&
        typeof this.req.url == 'string' &&
        this._validateUrl(this.req.url)
      )
    )
  }

  _isReadyToShow() {
    return (
      document.activeElement.id == this.req.target &&
      this.element.target.value.length >= this.option.minlength &&
      this.element.target.value != this.state.query
    )
  }

  _add(json) {
    this._remove()
    this.json = this._parseJson(json)
    let appendedCount = 0
    for (let val of this.json) {
      let item = document.createElement('li')
      item.setAttribute('value', val[this.req['key']])
      if (this.option['imageKey']) {
        let img = document.createElement('img')
        img.src = val[this.option['imageKey']]
        item.appendChild(img)
      }
      item.innerHTML += val[this.req['key']]
      item.addEventListener('click', (event) => {
        this.option['clickHandler'](event, val)
      })
      this.element['suggestrap'].appendChild(item)
      // Break this loop when appendCount reaches this.option['count']
      appendedCount += 1
      if (appendedCount >= this.option['count']) break
    }
    this.state['currentIndex'] = -1
  }

  _remove() {
    while (this.element['suggestrap'].firstChild) {
      this.element['suggestrap'].removeChild(this.element['suggestrap'].firstChild)
    }
    this._initializeState()
  }

  _activeCurrentSuggest() {
    for (let i = 0; i < this.element['suggestrap'].childNodes.length; i++) {
      this.element['suggestrap'].childNodes[i].classList.remove('suggestrap-active')
    }
    switch (this.state['currentIndex']) {
      case -1:
        break
      default:
        this.element['suggestrap'].childNodes[this.state['currentIndex']].classList.add('suggestrap-active')
        // Insert current suggest value into the target form
        this.element['target'].value = this.element['suggestrap'].childNodes[this.state['currentIndex']].getAttribute('value')
    }
  }

  _validateUrl(url) {
    return RegExp(/^https?:\/\//, 'i').test(url)
  }

  _parseJson(json) {
    if (typeof json === 'string') {
      return JSON.parse(json)
    } else if (typeof json == 'object') {
      return json
    } else {
      throw new Error('It must be JSON or Object.')
    }
  }

  async _fetchJson(callbackFunc) {
    let res = await request.get(this.jsonUrl)
    if (res.error) {
      console.error(res.error)
    } else {
      callbackFunc(res.text)
    }
  }

  _setEventListener() {
    let keyupHandler = (event) => {
      if (event.key == "ArrowUp") {
        this.moveUp()
      } else if (event.key == "ArrowDown") {
        this.moveDown()
      } else if (event.key == "Escape") {
        this.hide()
      } else if (event.key == "Enter") {
        this.option['pressEnterHandler'](event, this.json[this.state.currentIndex])
        this.hide()
      }
    }
    let textInputHandler = _.debounce((event) => {
      if (this._isReadyToShow()) {
        // Fetch suggetions and then show them
        this.state['query'] = event.target.value
        if (this.hasUrl()) {
          this._fetchJson((json) => {
            if (json.length > 0) {
              this._add(json)
              this.show()
            }
          })
        } else {
          if (this.req.values.length > 0) {
            this._add(this.suggestions)
            this.show()
          }
        }
      } else {
        // Hide suggestions
        this.state['query'] = ''
        this.hide()
        this._remove()
      }
    }, this.option['delay'])
    this.element['target'].addEventListener('keyup', keyupHandler)
    this.element['target'].addEventListener('textInput', textInputHandler)
    this.element['target'].addEventListener('focus', textInputHandler)
    this.element['target'].addEventListener('blur', (event) => {
      // Make it delay to give priority to the onClick event when a suggestion element is clicked
      _.delay(() => {
        this.hide()
      }, 200)
    })
    // Solve that the displacement of suggestion element's position occurs when resizing window
    window.onresize = () => {
      this.hide()
    }
  }

  _initializeReq(req) {
    // Necessary params
    if (!('target' in req)) {
      throw new Error('target is not found. This key is necessary.')
    } else if (typeof req['target'] != 'string') {
      throw new Error('target must be a string.')
    }
    if (!('key' in req)) {
      throw new Error('key is not found. This key is necessary.')
    } else if (typeof req['key'] != 'string') {
      throw new Error('key must be a string.')
    }
    if (!('values' in req) && !('url' in req)) {
      // When not having values and url
      throw new Error('values and url are not found. Either key is necessary.')
    } else if ('values' in req && typeof req['values'] != 'string' && typeof req['values'] != 'object') {
      // When having values but it isn't string or object
      throw new Error('values must be a string or an array that has hashes.')
    } else if ('values' in req && typeof req.values == 'string' && !this._validateUrl(req.values)) {
      // When having values as string but it isn't URL
      throw new Error(req.values + ' is not URL even if it is string.')
    } else if ('url' in req && typeof req['url'] != 'string') {
      // When having url but it isn't string
      throw new Error('url must be a string.')
    } else if ('url' in req && typeof req.url == 'string' && !this._validateUrl(req.url)) {
      // When having url but it isn't URL
      throw new Error(req.url + ' is not URL even if it is string.')
    }
    return req
  }

  _initializeOption(option) {
    // Set default options
    if (!('wildcard' in option)) option['wildcard'] = '%QUERY'
    if (!('minlength' in option)) option['minlength'] = 2
    if (!('delay' in option)) option['delay'] = 400
    if (!('count' in option)) option['count'] = 5
    if (!('id' in option)) option['id'] = 'suggestrap'
    if (!('imageKey' in option)) option['imageKey'] = null
    if (!('clickHandler' in option)) {
      option['clickHandler'] = (event, value) => {
        this.element['target'].value = event.target.getAttribute('value')
        this.hide()
      }
    }
    if (!('pressEnterHandler' in option)) {
      option['pressEnterHandler'] = (event, value) => {
        if (this.state['currentIndex'] != -1) this.hide()
      }
    }
    return option
  }

  _initializeState() {
    return this.state = { query: '', isShow: false, currentIndex: -1 }
  }

  _initializeElements() {
    let element = {
      target: document.getElementById(this.req['target']),
      suggestrap: document.createElement('ul'),
      style: document.createElement('style'),
    }
    // Check if target element exists
    if (!(element.target)) throw new Error(element.target + ' element is not found.')
    // Create an unique id of suggetrap element
    let suggestrapId
    if (document.getElementById(this.option['id'])) {
      // Add an unique suffix into the id when existing id
      let suffix = 2
      while (document.getElementById(this.option['id'] + '_' + suffix)) suffix++
      suggestrapId = this.option['id'] + '_' + suffix
    } else {
      suggestrapId = this.option['id']
    }
    let css = `
    ul#${suggestrapId}{
      position: absolute;
      z-index: 1000;
      padding: 0;
      margin: 0;
      line-height: 30px;
      list-style: none;
      background: #fff;
      border-radius: 3px;
      box-shadow: -2px 2px 7px rgba(0,0,0,0.3);
    }
    ul#${suggestrapId} li{
      white-space: nowrap;
      overflow: hidden;
      padding: 0 5px;
      display: flex;
      align-items: center;
      color: #333;
    }
    ul#${suggestrapId} li.suggestrap-active,
    ul#${suggestrapId} li:hover{
      cursor: pointer;
      background: #4b89bf;
      color: #fff;
    }
    ul#${suggestrapId} li img{
      max-width: 30px;
      max-height: 30px;
      margin-right: 3px;
    }
    `
    element['style'].appendChild(document.createTextNode(css))
    document.getElementsByTagName('head')[0].appendChild(element['style'])
    // Set the target form element
    element['target'].autocomplete = 'off'
    // Set the suggestion element
    element['suggestrap'].id = suggestrapId
    // Insert the suggestrap element in the next to target element
    element['target'].parentNode.insertBefore(element['suggestrap'], element['target'].nextSibling)
    return element
  }

}