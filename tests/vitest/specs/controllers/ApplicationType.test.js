/**
 * Created by preciousr on 11/11/2015.
 *
 *
 * ApplicationTypeController----------------------------------------------------
 *  This controller only has a single function 'new-application()' we test this
 *  under a standard service scenario, a business service scenario and an
 *  erroneous one.
 *
 */
const session = require('supertest-session')
const ApplicationTypeController = require('../../../../api/controllers/ApplicationTypeController')
const UserModels = require('../../../../api/userServiceModels/models')
const ApplicationReference = require('../../../../api/models/index').ApplicationReference
const sequelize = require('../../../../api/models/index').sequelize
const Application = require('../../../../api/models/index').Application
const HelperService = require('../../../../api/services/HelperService')

let testSession = null
testSession = session('test')

const testEmail = 'mark.barlow@digital.fco.gov.uk'
const testApplication_id = 7888

describe('ApplicationTypeController', () => {
  /**
   * Render the service selector page
   */
  describe.skip('[FUNCTION: serviceSelectorPage()]', () => {
    it('should load the the Service Selector page and populate session vars with empty data if a new application, or current data if an application update ', (done) => {
      UserModels.User.findOne({ where: { email: testEmail } }).then((user) => {
        UserModels.AccountDetails.findOne({ where: { user_id: user.id } }).then((account) => {
          testSession.user = user
          testSession.account = account
          testSession.appId = 0 // reset the appId so a new session is used
          // set initial submit status to false, meaning it application has not yet been submitted
          testSession.appSubmittedStatus = false

          assert.isOk(account !== null, `Successfully found account details for user ${testEmail}`)
          assert.isOk(testSession.appSubmittedStatus === false, 'appSubmittedStatus successfully reset')
          assert.isOk(
            sails.config.customURLs.userServiceURL === 'http://localhost:3001/api/user',
            'Successfully found Service URL',
          )

          /**
           * tempate find test is in next section
           */
          // res.view('applicationForms/applicationType.ejs', {
          //     application_id: 0,
          //     userServiceURL: sails.config.customURLs.userServiceURL,
          //     error_report: false,
          //     changing: false,
          //     form_values: false,
          //     submit_status: req.session.appSubmittedStatus,
          //     current_uri: req.originalUrl,
          //     user_data: HelperService.getUserData(req,res)
          // });
          done()
        })
      })
    })

    it('should find the applicationType template view', (done) => {
      var fs = require('node:fs')
      //TODO:: fix this so relative path can be used
      fs.stat('views/applicationForms/applicationType.ejs', (err, stat) => {
        if (err === null) {
          assert.isOk(stat, 'Successfully found applicationType template')
          done()
        } else {
          assert.isNotOk(err, 'Failed to find applicationType template')
          done(err)
        }
      })
    })
  })

  /**
   * Generate Application id and find the appropriate route for a new application
   */
  describe.skip('[FUNCTION: newApplication()]', () => {
    it('should use a generated a unique applicationId and successfully check it is unique, ', (done) => {
      var uniqueApplicationId = 'A-A-16-0203-1234-5842'
      // gets latest Application Reference from db
      ApplicationReference.findOne().then((data) => {
        if (data !== null) {
          assert.isOk(data, 'Successfully retrieved most current ApplicationReference for this new application')

          sequelize
            .query(`SELECT unique_app_id FROM "Application" WHERE unique_app_id = '${uniqueApplicationId}';`, {
              type: sequelize.QueryTypes.SELECT,
            })
            .then((result) => {
              if (result.length !== 0) {
                assert.isNotOk(result.length === 0, 'Failed to find unique application reference.')
              } else {
                assert.isOk(result.length === 0, 'Successfully found unique application reference.')

                Application.create({
                  serviceType: 1,
                  unique_app_id: uniqueApplicationId,
                  all_info_correct: '-1',
                  user_id: 100001,
                  submitted: 'draft',
                  feedback_consent: true,
                })
                  .then((created) => {
                    assert.isOk(created, 'Successfully created new Application record.')
                    done()
                  })
                  .catch((error) => {
                    assert.isNotOk(error, 'Failed to create new Application record.')
                    done()
                  })
              }
            })
        } else {
          assert.isNotOk(data, 'Failed to retrieve most current ApplicationReference for this new application')
          done()
        }
      })
    })

    // cant test because controller looks for parameter obtained form helperService
    // it('should find the business-document-quantity route', function(done) {
    //     request(sails.hooks.http.app)
    //         .post('/business-document-quantity')
    //         .send({application_id:1001})
    //         .expect(302)
    //         .end(function(err,res){
    //             if (err){
    //                 console.log(err)
    //             }

    //             res.res.connection._httpMessage.path.should.equal('/business-document-quantity');

    //             done();
    //         })
    // });

    // it('should find the choose-documents-or-skip route', function(done) {
    //     request(sails.hooks.http.app)
    //         .post('/choose-documents-or-skip')
    //         .expect(302)
    //         .end(function(err,res){
    //             if (err){
    //                 console.log(err)
    //             }

    //             res.res.connection._httpMessage.path.should.equal('/choose-documents-or-skip');

    //             done();
    //         })
    // })
  })

  /**
   * Populate the form with data when editing the page (from the summary page or by clicking the in-page back link)
   */
  describe.skip('[FUNCTION: populateApplicationType()]', () => {
    it('should retrieve the previously submitted data and populate the form successfully.', (done) => {
      Application.findOne({
        where: {
          application_id: testApplication_id,
        },
      })
        .then((data) => {
          assert.isOk(
            data,
            'Successfully found previous record, so ApplicationType form can be populated for editing.',
          )
          done()
        })
        .catch((error) => {
          assert.isNotOk(error, 'Failed to populate the ApplicationType form.')
          done(err)
        })
    })
  })

  describe('serviceSelectorPage()', () => {
    let reqStub
    let resStub

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('renders page error message if present', async () => {
      reqStub = {
        body: {
          'choose-a-service': 'eApostille',
        },
        session: {
          startBackLink: '',
          appSubmittedStatus: false,
        },
        flash: () => 'You must select a service.',
        originalUrl: 'test.com',
        _sails: {
          config: {
            customURLs: {
              userServiceURL: 'http://localhost:3001/api/user',
            },
            userServiceSequelize: {
              host: 'loi-postgres',
              database: 'FCO-LOI-User',
              user: 'postgres',
              password: 'password',
              port: 5432,
              define: () => {},
            },
          },
        },
      }

      resStub = {
        view: vi.fn(),
        redirect: vi.fn(),
      }

      const userModelsStub = {
        User: {
          findOne: vi.fn().mockResolvedValue({ id: 1234 }),
        },
        AccountDetails: {
          findOne: () => ({
            findOne: vi.fn().mockResolvedValue({ id: 5678 }),
          }),
        },
      }

      // when
      vi.spyOn(HelperService, 'LoggedInStatus').mockImplementation(() => true)
      vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({}))
      vi.spyOn(sequelize, 'query').mockResolvedValue()

      await ApplicationTypeController._renderServiceSelectionPage(reqStub, resStub, userModelsStub)

      // then
      expect(resStub.view.mock.calls[0][1].errorMessage).to.equal('You must select a service.')
    })
  })

  describe('handleServiceChoice()', () => {
    let reqStub
    let resStub

    beforeEach(() => {
      reqStub = {
        body: {
          'choose-a-service': 'eApostille',
        },
        session: {
          startBackLink: '',
        },
        flash: () => [false],
        _sails: {
          config: {
            customURLs: {
              userServiceURL: 'http://localhost:3001/api/user',
            },
            userServiceSequelize: {
              host: 'loi-postgres',
              database: 'FCO-LOI-User',
              user: 'postgres',
              password: 'password',
              port: 5432,
            },
          },
        },
      }

      resStub = {
        view: vi.fn(),
        redirect: vi.fn(),
      }
      vi.spyOn(HelperService, 'getUserData').mockReturnValue({})
      vi.spyOn(sails.log, 'error')
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('redirects user to correct page based on their selection', () => {
      // when
      vi.spyOn(HelperService, 'LoggedInStatus').mockImplementation(() => true)
      const services = ['eApostille', 'standard', 'premium']
      const expectedUrls = [
        '/new-application?app_type_group=4',
        '/new-application?app_type_group=1',
        '/new-application?app_type_group=2',
      ]

      // then
      services.forEach((service, index) => {
        reqStub.body['choose-a-service'] = service
        ApplicationTypeController.handleServiceChoice(reqStub, resStub)
        expect(resStub.redirect.mock.calls[index][0]).to.equal(expectedUrls[index])
      })
    })
  })
})
