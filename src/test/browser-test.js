import { assert } from 'chai'

import Suggestrap from 'js/suggestrap'

describe('Suggestrap', () => {
  let req = {
    target: "target",
    url: "http://localhost:3000/json/companies/%QUERY",
    key: "name",
  }
  let s, json
  beforeEach((done) => {
    s = new Suggestrap(req)
    done()
  })

  context('when added JSON', () => {
    json = JSON.stringify([{ id: 1, name: 'Yamada', }, { id: 2, name: 'Kato' }])
    beforeEach((done) => {
      s.add(json)
      done()
    })

    describe('#add', () => {      
      it('should have 2 as state.length', () => {        
        assert.equal(s.state.length, 2)
      })
    })
  
    describe('#remove', () => {      
      it('should have 0 as state.length', () => {
        s.remove()
        assert.equal(s.state.length, 0)
      })
    })      

    describe('#show', () => {      
      it('should have true as state.isShow', () => {     
        s.show()
        assert.isTrue(s.state.isShow)
      })
    })

    describe('#hide', () => {      
      it('should have false as state.isShow', () => {        
        s.hide()
        assert.isFalse(s.state.isShow)
      })
    })
  })

  describe('#_parseJson', () => {
    json

    it('should return Array when Array of JSON', () => {
      json = JSON.stringify([ { id: 1, name: 'Yamada', }, { id: 2, name: 'Kato' } ])
      assert.isArray(s._parseJson(json))
    })  

    it('should return Object when Hash of JSON', () => {
      json = JSON.stringify({ id: 1, name: 'Yamada', })
      assert.isObject(s._parseJson(json))
    })

    it('should return Array when Array', () => {
      json = [{ id: 1, name: 'Yamada', }, { id: 2, name: 'Kato', }]
      assert.isArray(s._parseJson(json))
    })

    it('should thrrow SyntaxError when wrong format string', () => {
      json = "[{ id: 1, name: 'Yamada', }, { id: 2, name: 'Kato', }]"
      assert.throws(() => { s._parseJson(json) }, SyntaxError, /in JSON/)
    })  
  })
})