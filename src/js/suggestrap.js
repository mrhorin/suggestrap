import _ from 'lodash'
import request from 'superagent'

export default class Suggestrap{

  constructor(req, option = {}) {
    this.req = this._reqInitialize(req)
    this.option = this._optionInitialize(option)
    this.state = this._stateInitialize()
    this.element = this._elementInitialize()
    this._setEventListener()    
    this.hide()
    this.keyUpHandler = _.debounce((event) => {
      if (document.activeElement.id == this.req['target'] &&
      event.target.value.length >= this.option['minlength'] &&
      event.target.value != this.state['query']) {
        this.state['query'] = event.target.value
        this._fetchSuggestJson((json) => {
          if (json.length > 0) {
            this.add(json)
            this.show()
          }
        })
      } else {
        this.state['query'] = ''
        this.hide()
        this.remove()
      }
    }, this.option['delay'])
  }

  get jsonUrl() {
    return this.req['url'].replace(this.option['wildcard'], this.state['query'])
  }

  show() {
    this.element['suggest'].style.display = 'block'
    this.state['isShow'] = true
  }

  hide() {
    this.element['suggest'].style.display = 'none'
    this.state['isShow'] = false
  }

  moveUpSuggest() {
    if (this.state['isShow']) {
      if (this.state['currentIndex'] > -1) {
        this.state['currentIndex'] -= 1
      } else {
        this.state['currentIndex'] = this.state['length'] - 1
      }
      this.activeCurrentSuggest()
    }
  }

  moveDownSuggest() {
    if (this.state['isShow']) {
      if (this.state['currentIndex'] == this.state['length'] - 1) {
        this.state['currentIndex'] = -1
      } else {
        this.state['currentIndex'] += 1
      }
      this.activeCurrentSuggest()
    }
  }

  activeCurrentSuggest() {
    for (let i = 0; i < this.element['suggest'].childNodes.length; i++) {
      this.element['suggest'].childNodes[i].className = ''
    }
    switch (this.state['currentIndex']) {
      case -1:
        break  
      default:
        this.element['suggest'].childNodes[this.state['currentIndex']].className = 'suggestrap-active'
        // Insert current suggest value into the target form
        this.element['target'].value = this.element['suggest'].childNodes[this.state['currentIndex']].innerHTML
    }
  }

  add(json) {
    this.remove()
    let appendedCount = 0
    for (let val of this._parseJson(json)) {
      let suggestItem = document.createElement('li')
      suggestItem.style.textAlign = 'left'
      suggestItem.style.whiteSpace = 'nowrap'
      suggestItem.style.overflow = 'hidden'
      suggestItem.style.padding = '1px 6px'
      suggestItem.innerHTML = val[this.req['key']]
      suggestItem.addEventListener('click', (event) => {
        this.element['target'].value = event.target.innerHTML
        this.hide()
      })
      this.element['suggest'].appendChild(suggestItem)
      // Break this loop when appendCount reaches this.option['count']
      appendedCount += 1
      if(appendedCount >= this.option['count']) break
    }
    this.state['length'] = this.element['suggest'].childNodes.length
    this.state['currentIndex'] = -1
  }

  remove() {
    while (this.element['suggest'].firstChild) {
      this.element['suggest'].removeChild(this.element['suggest'].firstChild)
    }
    this._stateInitialize()
  }

  _fetchSuggestJson(callbackFunc) {
    new Promise((resolve, reject) => {
      request
        .get(this.jsonUrl)
        .end((err, res) => {
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        })
    }).then((res) => {
      callbackFunc(res.text)
      }).catch((err) => {
      console.log(err)
    })
  }

  _setEventListener() {
    // Set event when input text in target
    this.element['target'].addEventListener('keyup', (event) => {
      let invalidKeyCode = [38, 40, 37, 39, 16, 17, 13]
      let keyCode = event.keyCode
      if (!invalidKeyCode.includes(keyCode)) {
        // When valid key
        this.keyUpHandler(event)
      } else if (keyCode == 38) {
        // When press Up key
        this.moveUpSuggest()
      } else if (keyCode == 40) {
        // When press Down key
        this.moveDownSuggest()
      } else if (keyCode == 13) {
        // When press Enter key
        if (this.state['isShow'] && this.state['currentIndex'] != -1) {
          this.hide()
        } else {
          this.keyUpHandler(event)
        }
      }   
    })
    // Set event when blur on target
    this.element['target'].addEventListener('blur', (event) => {
      // Do delay for give proprity to event that suggest is clicked
      _.delay(() => {
        this.hide()
      }, 200)
    })
    // Set event when focus on target
    this.element['target'].addEventListener('focus', (event) => {
      this.keyUpHandler(event)
    })
    // Solve that the target can't fire keyup event when do auto correct in Mobile Safari
    this.element['target'].addEventListener('textInput', (event) => {
      this.keyUpHandler(event)
    })
  }

  _parseJson(json) {
    if (typeof json === 'string') {
      return JSON.parse(json)
    } else if (typeof json == 'object') {
      return json
    } else {
      throw 'It is not JSON or Object.'
    }
  }

  _reqInitialize(req) {
    // Necessary params
    if (!('target' in req)) throw ('target is not found in the option. This argument is necessary.')
    if (!('url' in req)) throw ('url is not found in the option. This argument is necessary.')
    if (!('key' in req)) throw ('key is not found in the option. This argument is necessary.')
    return req
  }

  _optionInitialize(option) {
    // Set default options
    if (!('wildcard' in option)) option['wildcard'] = '%QUERY'
    if (!('minlength' in option)) option['minlength'] = 2
    if (!('delay' in option)) option['delay'] = 400
    if (!('count' in option)) option['count'] = 5
    return option
  }

  _stateInitialize() {
    return this.state = { query: '', isShow: false, length: 0, currentIndex: -1 }
  }

  _elementInitialize() {
    let element = {
      target: document.getElementById(this.req['target']),
      suggest: document.createElement('ul'),
      style: document.createElement('style'),      
    }
    // Set style element
    let _css = `
    ul#suggestrap{
      background: #fff;
      border-radius: 3px;
      box-shadow: -2px 2px 7px rgba(0,0,0,0.3);
      list-style: none;
      padding: 3px 0;
      margin: 0;
      position: absolute;
      z-index: 1000;
      width: auto;
      height: auto;
    }
    ul#suggestrap li{
      color: #333;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      padding: 1px 6px;
    }
    ul#suggestrap li.suggestrap-active{
      background: #0099ff;
      color: #fff;
    }
    ul#suggestrap li.suggestrap-active,
    ul#suggestrap li:hover{
      cursor: pointer;
      background: #4b89bf;
      color: #fff;
    }
    `
    element['style'].appendChild(document.createTextNode(_css))
    document.getElementsByTagName('head')[0].appendChild(element['style'])
    // Set target form element
    element['target'].autocomplete = 'off'
    // Set suggest element
    element['suggest'].id = 'suggestrap'
    // Insert suggest element in the next to target element
    element['target'].parentNode.insertBefore(element['suggest'], element['target'].nextSibling)
    return element
  }

}