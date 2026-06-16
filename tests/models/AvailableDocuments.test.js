/**
 * Created by preciousr on 11/11/2015.
 */

// TODO Tests are failing
describe.skip('AvailableDocumentsModel', () => {
  describe('#Create', () => {
    it('should check that create function works', (done) => {
      AvailableDocuments.create({ doc_id: 999, doc_title: 'Birth Certificate', doc_type_id: 1, html_id: '1' }).then(
        (created) => {
          created.should.not.equal(null)
          done()
          return null
        },
      )
    })
  })

  describe('#Find', () => {
    it('should check that find function works', (done) => {
      AvailableDocuments.findOne({ where: { doc_type_id: '1', html_id: '1' } }).then((found) => {
        found.doc_title.should.equal('Birth Certificate')
        done()
        return null
      })
    })
  })

  describe('#Update', () => {
    it('should check that update function works', (done) => {
      AvailableDocuments.update({ doc_title: 'Doctors Note' }, { where: { doc_type_id: '1', html_id: '1' } }).then(
        () => {
          AvailableDocuments.findOne({ where: { doc_type_id: '1', html_id: '1' } }).then((found) => {
            found.doc_title.should.equal('Doctors Note')
            done()
            return null
          })
          return null
        },
      )
    })
  })

  describe('#Destroy', () => {
    it('should check that destroy function works', (done) => {
      AvailableDocuments.destroy({ where: { doc_type_id: '1', html_id: '1' } }).then(() => {
        AvailableDocuments.findOne({ where: { doc_type_id: '1', html_id: '1' } }).then((_err, found) => {
          ;(typeof found).should.equal('undefined')
          done()
          return null
        })
        return null
      })
    })
  })
})
