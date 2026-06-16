/**
 * Created by preciousr on 11/11/2015.
 */
// Skipped because tests need postgres server to work
describe.skip('ApplicationModel', () => {
  let applicationID
  describe('#Create', () => {
    it('should check that create function works', (done) => {
      Application.create({
        serviceType: -1,
        all_info_correct: -1,
        feedback_consent: false,
      }).then((created) => {
        created.should.not.equal(null)
        applicationID = created.application_id
        done()
        return null
      })
    })
  })

  describe('#Find', () => {
    it('should check that find function works', (done) => {
      Application.findOne({ where: { application_id: applicationID } }).then((found) => {
        found.application_id.should.equal(applicationID)
        done()
        return null
      })
    })
  })

  describe('#Update', () => {
    it('should check that update function works', (done) => {
      Application.update({ submitted: true }, { where: { application_id: applicationID } }).then(() => {
        Application.findOne({ where: { application_id: applicationID } }).then((found) => {
          found.submitted.should.equal('true')
          done()
          return null
        })
        return null
      })
    })
  })

  describe('#Destroy', () => {
    it('should check that destroy function works', (done) => {
      Application.destroy({ where: { application_id: applicationID } }).then(() => {
        Application.findOne({ where: { application_id: applicationID } }).then((_err, found) => {
          ;(typeof found).should.equal('undefined')
          done()
          return null
        })
        return null
      })
    })
  })
})
