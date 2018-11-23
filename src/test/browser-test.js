import { assert } from 'chai'

import Suggestrap from 'js/index'

describe('Suggestrap', () => {
  let suggest, languages, countriesJsonUrl, json
  countriesJsonUrl = "http://localhost:8080/countries.json?keyword=%QUERY"
  languages = [
    { id: 1, name: 'English' },
    { id: 2, name: 'Chinese' },
    { id: 3, name: 'Hindustani' },
    { id: 4, name: 'Spanish' },
    { id: 5, name: 'Arabic' },
    { id: 6, name: 'French' },
    { id: 7, name: 'Malay' },
    { id: 8, name: 'Russian' },
    { id: 9, name: 'Bengali' },
    { id: 10, name: 'Portuguese' },
    { id: 11, name: "German" },
    { id: 12, name: "Japanese" }
  ]
  json = JSON.stringify(languages)
  suggest = new Suggestrap({
    target: "target-country",
    values: countriesJsonUrl,
    key: "name",
  })

  describe('#add', () => {
    it('element.suggest.childNodes.length should have 5 after adding JSON when option.count is 5', () => {
      suggest.add(json)
      assert.equal(suggest.element.suggest.childNodes.length, 5)
    })
  })

  describe('#remove', () => {
    it('element.suggest.childNodes.length should have 0 after adding JSON and then executing remove()', () => {
      suggest.add(json)
      suggest.remove()
      assert.equal(suggest.element.suggest.childNodes.length, 0)
    })
  })

  describe('#show', () => {      
    it('state.isShow should have true after executing show()', () => {     
      suggest.show()
      assert.isTrue(suggest.state.isShow)
    })
  })

  describe('#hide', () => {      
    it('state.isShow should have true after executing hide()', () => {        
      suggest.hide()
      assert.isFalse(suggest.state.isShow)
    })
  })

  describe('#_parseJson', () => {
    it('should return an Array when inputed an Array of JSON', () => {
      json = JSON.stringify(languages)
      assert.isArray(suggest._parseJson(json))
    })  

    it('should return an Object when inputed a Hash of JSON', () => {
      json = JSON.stringify(languages[0])
      assert.isObject(suggest._parseJson(json))
    })

    it('should return an Array when inputed an Array', () => {
      assert.isArray(suggest._parseJson(languages))
    })

    it('should throw exception when inputed a wrong format JSON', () => {
      let wrongJson = "[{ id: 1, name: 'Yamada', }, { id: 2, name: 'Kato', }]"
      assert.throws(() => suggest._parseJson(wrongJson) , Error)
    })  
  })

  describe('#_reqInitialize', () => {
    it('should throw an exception when values and url are empty', () => {
      let req = { target: "target-country", key: "name" }
      assert.throws(() => new Suggestrap(req), Error)
    })

    it('should throw an exception when url is object', () => {
      let req = { target: "target-language", key: "name", url: languages}
      assert.throws(() => new Suggestrap(req), Error)
    })

    it('should not throw any exception when url is string', () => {
      let req = { target: "target-country", key: "name", url: countriesJsonUrl}
      assert.doesNotThrow(() => new Suggestrap(req))
    })

    it('should throw an exception when values is not object or string', () => {
      let req = { target: "target-country", key: "name", values: 1234567890 }
      assert.throws(() => new Suggestrap(req), Error)
    })

    it('should not throw an exception when values is string', () => {
      let req = { target: "target-country", key: "name", values: countriesJsonUrl}
      assert.doesNotThrow(() => new Suggestrap(req))
    })

    it('should not throw an exception when values is object', () => {
      let req = { target: "target-language", key: "name", values: languages}
      assert.doesNotThrow(() => new Suggestrap(req))
    })
  })
})