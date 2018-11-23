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
  suggest = new Suggestrap({
    target: "target-country",
    values: countriesJsonUrl,
    key: "name",
  })

  context('when added JSON', () => {
    json = JSON.stringify(languages)
    beforeEach((done) => {
      suggest.add(json)
      done()
    })

    describe('#add', () => {
      it('should have 2 as state.length when option.count is 5', () => {
        assert.equal(suggest.state.length, 5)
      })
    })
  
    describe('#remove', () => {      
      it('should have 0 as state.length', () => {
        suggest.remove()
        assert.equal(suggest.state.length, 0)
      })
    })      

    describe('#show', () => {      
      it('should have true as state.isShow', () => {     
        suggest.show()
        assert.isTrue(suggest.state.isShow)
      })
    })

    describe('#hide', () => {      
      it('should have false as state.isShow', () => {        
        suggest.hide()
        assert.isFalse(suggest.state.isShow)
      })
    })
  })

  describe('#_parseJson', () => {
    it('should return an Array when input an Array of JSON', () => {
      json = JSON.stringify(languages)
      assert.isArray(suggest._parseJson(json))
    })  

    it('should return an Object when input a Hash of JSON', () => {
      json = JSON.stringify(languages[0])
      assert.isObject(suggest._parseJson(json))
    })

    it('should return an Array when input an Array', () => {
      assert.isArray(suggest._parseJson(languages))
    })

    it('should throw SyntaxError when input a wrong format string', () => {
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

    it('should not throw an exception when url is string', () => {
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