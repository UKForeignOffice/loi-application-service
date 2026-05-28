/**
 * Created by preciousr on 11/11/2015.
 */
// Skipped because tests need postgres server to work
describe.skip('UserDocumentCount', () => {
  describe('#Create', () => {
    it('should check that create function works', (done) => {
      UserDocumentCount.create({ application_id: 0, doc_count: 3, country: 'UK', price: 30 }).then((created) => {
        created.should.not.equal(null)
        done()
        return null
      })
    })
  })

  describe('#Find', () => {
    it('should check that find function works', (done) => {
      UserDocumentCount.findOne({ where: { application_id: 0 } }).then((found) => {
        found.doc_count.should.equal(3)
        done()
        return null
      })
    })
  })

  describe('#Update', () => {
    it('should check that update function works', (done) => {
      UserDocumentCount.update({ doc_count: 4 }, { where: { application_id: 0 } }).then(() => {
        UserDocumentCount.findOne({ where: { application_id: 0 } }).then((found) => {
          found.doc_count.should.equal(4)
          done()
          return null
        })
        return null
      })
    })
  })

  describe('#Destroy', () => {
    it('should check that destroy function works', (done) => {
      UserDocumentCount.destroy({ where: { application_id: 0 } }).then(() => {
        UserDocumentCount.findOne({ where: { application_id: 0 } }).then((_err, found) => {
          ;(typeof found).should.equal('undefined')
          done()
          return null
        })
        return null
      })
    })
  })
})
