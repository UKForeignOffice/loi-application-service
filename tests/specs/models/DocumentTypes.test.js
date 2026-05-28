/**
 * Created by preciousr on 11/11/2015.
 */
// Skipped because tests need postgres server to work
describe.skip('DocumentTypes', () => {
  describe('#Create', () => {
    it('should check that create function works', (done) => {
      DocumentTypes.create({ doc_type_id: 0, doc_type: 'Test', doc_type_title: 'TEST' }).then((created) => {
        created.should.not.equal(null)
        done()
        return null
      })
    })
  })

  describe('#Find', () => {
    it('should check that find function works', (done) => {
      DocumentTypes.findOne({ where: { doc_type_id: 0 } }).then((found) => {
        found.doc_type_title.should.equal('TEST')
        done()
        return null
      })
    })
  })

  describe('#Update', () => {
    it('should check that update function works', (done) => {
      DocumentTypes.update({ doc_type_title: 'UNIT TEST' }, { where: { doc_type_id: 0 } }).then(() => {
        DocumentTypes.findOne({ where: { doc_type_id: 0 } }).then((found) => {
          found.doc_type_title.should.equal('UNIT TEST')
          done()
          return null
        })
        return null
      })
    })
  })

  describe('#Destroy', () => {
    it('should check that destroy function works', (done) => {
      DocumentTypes.destroy({ where: { doc_type_id: 0 } }).then(() => {
        DocumentTypes.findOne({ where: { doc_type_id: 0 } }).then((_err, found) => {
          ;(typeof found).should.equal('undefined')
          done()
          return null
        })
        return null
      })
    })
  })
})
