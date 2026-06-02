// Skipped because tests need postgres server to work
describe.skip('UsersBasicDetailsModel', () => {
  describe('#Create', () => {
    it('should check that create function works', (done) => {
      UsersBasicDetails.create({
        application_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        telephone: '01904548245',
        has_email: true,
        email: 'myemail@email.com',
        confirm_email: 'myemail@email.com',
      }).then((results) => {
        results.first_name.should.equal('John')
        done()
        return null
      })
    })
  })
  describe('#find()', () => {
    it('should check find function works', (done) => {
      UsersBasicDetails.findOne({ where: { application_id: 1 } }).then((found) => {
        found.first_name.should.equal('John')
        done()
        return null
      })
    })
  })

  describe('#update()', () => {
    it('should check update function works', (done) => {
      UsersBasicDetails.update(
        {
          first_name: 'Jane',
          last_name: 'Doe',
          telephone: '078414721454',
          email: 'jane.doe@gmail.com',
        },
        {
          where: {
            application_id: 1,
          },
        },
      ).then(() => {
        UsersBasicDetails.findOne({ where: { application_id: 1 } }).then((found) => {
          found.first_name.should.equal('Jane')
          done()
          return null
        })
        return null
      })
    })
  })
  describe('#Destroy', () => {
    it('should check that destroy function works', (done) => {
      UsersBasicDetails.destroy({ where: { application_id: 1 } }).then((_error) => {
        UsersBasicDetails.findOne({ where: { application_id: 1 } }).then((_err, found) => {
          ;(typeof found).should.equal('undefined')
          done()
          return null
        })
        return null
      })
    })
  })
})
