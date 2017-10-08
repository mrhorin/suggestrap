import { assert } from 'chai'

import Suggestrap from 'js/suggestrap'

describe('Suggestrap', () => {
  let suggest, json
  suggest = new Suggestrap({
    target: "target",
    url: "http://localhost:3000/json/companies/%QUERY",
    key: "name",
  })

  context('when added JSON', () => {
    json = JSON.stringify([{ id: 1, name: 'Yamada', }, { id: 2, name: 'Kato' }])
    beforeEach((done) => {
      suggest.add(json)
      done()
    })

    describe('#add', () => {      
      it('should have 2 as state.length', () => {        
        assert.equal(suggest.state.length, 2)
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
    json

    it('should return Array when Array of JSON', () => {
      json = JSON.stringify([ { id: 1, name: 'Yamada', }, { id: 2, name: 'Kato' } ])
      assert.isArray(suggest._parseJson(json))
    })  

    it('should return Object when Hash of JSON', () => {
      json = JSON.stringify({ id: 1, name: 'Yamada', })
      assert.isObject(suggest._parseJson(json))
    })

    it('should return Array when Array', () => {
      json = [{ id: 1, name: 'Yamada', }, { id: 2, name: 'Kato', }]
      assert.isArray(suggest._parseJson(json))
    })

    it('should thrrow SyntaxError when wrong format string', () => {
      json = "[{ id: 1, name: 'Yamada', }, { id: 2, name: 'Kato', }]"
      assert.throws(() => { suggest._parseJson(json) }, SyntaxError, /in JSON/)
    })  
  })
})