/**
 * Created by preciousr on 11/11/2015.
 */
describe.skip('ApplicationTypeModel', () => {
  describe('#Create', () => {
    it('should check that create function works', (done) => {
      ApplicationType.create({ id: 0, applicationType: 'Test', createdAt: null, updatedAt: null })
        .then((created) => {
          created.should.not.equal(null)
          done()
          return null
        })
        .catch((_error) => {
          done()
        })
    })
  })

  describe('#Find', () => {
    it('should check that find function works', (done) => {
      ApplicationType.findOne({ where: { id: 0 } })
        .then((found) => {
          found.applicationType.should.equal('Test')
          done()
          return null
        })
        .catch((_error) => {
          done()
        })
    })
  })

  describe('#Update', () => {
    it('should check that update function works', (done) => {
      ApplicationType.update({ applicationType: 'UNIT TEST' }, { where: { id: 0 } })
        .then(() => {
          ApplicationType.findOne({ where: { id: 0 } })
            .then((found) => {
              found.applicationType.should.equal('UNIT TEST')
              done()
              return null
            })
            .catch((_error) => {
              done()
            })
          return null
        })
        .catch((_error) => {
          done()
        })
    })
  })

  describe('#Destroy', () => {
    it('should check that destroy function works', (done) => {
      ApplicationType.destroy({ where: { id: 0 } })
        .then(() => {
          ApplicationType.findOne({ where: { id: 0 } }).then((_err, found) => {
            ;(typeof found).should.equal('undefined')
            done()
            return null
          })
          return null
        })
        .catch((_error) => {
          done()
        })
    })
  })
})
