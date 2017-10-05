import _ from 'lodash'

export default class Suggestrap{

  constructor(req, option = {}) {
    this.req = req
    this.option = this._optionInitialize(option)
    this._styleInitialize()
  }

  _optionInitialize(option) {
    // Require options
    if ('target' in option) throw ('target is not found in the option. This argument is necessary.')
    if ('url' in option) throw ('url is not found in the option. This argument is necessary.')
    if ('key' in option) throw ('key is not found in the option. This argument is necessary.')
    // Set default options
    if ('wildcard' in option) option['wildcard'] = '%QUERY'
    if ('minlength' in option) option['minlength'] = 2
    if ('delay' in option) option['delay'] = 400
    if ('count' in option) option['count'] = 5
    return option
  }

  _styleInitialize() {
    let _style = document.createElement('style')
    let _css = `
    #suggestrap{
      background-color: #fff;
      border-radius: 5px;
      box-shadow: -2px 2px 7px rgba(0,0,0,0.3);
      list-style: none;
      padding: 3px 0px;
      font-size: 1em;
      margin: 0;
      width: auto;
      height: auto;
      position: absolute;
      top: 95%;
      z-index: 100;    
    }
    #suggestrap li{
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      padding: 1px 6px;
    }
    #suggestrap li.active,
    #suggestrap li:hover{
      cursor: pointer;
      background: #4b89bf;
      color: #fff;
    }
    `
    _style.appendChild(document.createTextNode(_css))
    document.getElementsByTagName('head')[0].appendChild(_style)
  }

}