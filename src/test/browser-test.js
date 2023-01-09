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

  describe('#getter suggestion', () => {
    it('should return an empty array when values or url is URL', () => {
      assert.equal(suggest.suggestions.length, 0)
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

  describe('#_add', () => {
    it('element.suggest.childNodes.length should have 5 after adding JSON when option.count is 5', () => {
      suggest._add(json)
      assert.equal(suggest.element.suggestrap.childNodes.length, 5)
    })
  })

  describe('#_remove', () => {
    it('element.suggest.childNodes.length should have 0 after adding JSON and then executing _remove()', () => {
      suggest._add(json)
      suggest._remove()
      assert.equal(suggest.element.suggestrap.childNodes.length, 0)
    })
  })

  describe('#_parseJson', () => {
    it('should return an Array when inputed an Array of JSON', () => {
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
    it('should throw an exception when not having target')

    it('should throw an exception when not having key')

    it('should throw an exception when not having values and url', () => {
      let req = { target: "target-country", key: "name" }
      assert.throws(() => new Suggestrap(req), Error)
    })

    it('should throw an exception when url is object', () => {
      let req = { target: "target-language", key: "name", url: languages}
      assert.throws(() => new Suggestrap(req), Error)
    })

    it('should throw an exception when url is string but not URL', () => {
      let req = { target: "target-country", key: "name", url: 'abcdifg'}
      assert.throw(() => new Suggestrap(req))
    })

    it('should not throw any exception when url is string', () => {
      let req = { target: "target-country", key: "name", url: countriesJsonUrl}
      assert.doesNotThrow(() => new Suggestrap(req))
    })

    it('should throw an exception when values is not object or string', () => {
      let req = { target: "target-country", key: "name", values: 1234567890 }
      assert.throws(() => new Suggestrap(req), Error)
    })

    it('should throw an exception when values is string but not URL', () => {
      let req = { target: "target-country", key: "name", values: 'abcdifg'}
      assert.throws(() => new Suggestrap(req), Error)
    })

    it('should not throw an exception when values is object', () => {
      let req = { target: "target-language", key: "name", values: languages}
      assert.doesNotThrow(() => new Suggestrap(req))
    })
  })
})