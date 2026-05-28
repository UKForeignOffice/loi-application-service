/**
 * Created by preciousr on 11/11/2015.
 */
// Skipped because tests need postgres server to work
describe.skip('AdditionalApplicationInfoModel', () => {
  describe('#Create', () => {
    it('should check that create function works', (done) => {
      AdditionalApplicationInfo.create({ application_id: 0, user_ref: '3', special_instructions: 'TEST' }).then(
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
      AdditionalApplicationInfo.findOne({ where: { application_id: 0 } }).then((found) => {
        found.user_ref.should.equal('3')
        done()
        return null
      })
    })
  })

  describe('#Update', () => {
    it('should check that update function works', (done) => {
      AdditionalApplicationInfo.update({ user_ref: '4' }, { where: { application_id: 0 } }).then(() => {
        AdditionalApplicationInfo.findOne({ where: { application_id: 0 } }).then((found) => {
          found.user_ref.should.equal('4')
          done()
          return null
        })

        return null
      })
    })
  })

  describe('#Destroy', () => {
    it('should check that destroy function works', (done) => {
      AdditionalApplicationInfo.destroy({ where: { application_id: 0 } }).then(() => {
        AdditionalApplicationInfo.findOne({ where: { application_id: 0 } }).then((_err, found) => {
          ;(typeof found).should.equal('undefined')
          done()
          return null
        })

        return null
      })
    })
  })
})
