/**
 * Created by amacmillan on 25/01/2016.
 *
 * AuthController----------------------------------------------------
 *
 *
 */
const sails = require('sails')
const AuthController = require('../../api/controllers/AuthController')
const UserModels = require('../../api/userServiceModels/models.js')

describe('AuthController:', () => {
  /* FUNCTION: fromSignInPage ---------------------------------------------------------
   *
   */
  //describe.skip('[Function: fromSignInPage]', function() {
  //    it('should not error', function (done) {
  //
  //        async.series({
  //                session : function getSession(callback) {
  //                    var MongoClient = require('mongodb').MongoClient;
  //
  //                    var url = sails.config.customURLs.mongoURL+'User_Service';
  //                    console.log('Attempting to connect to ', url)
  //
  //                    var session;
  //                    MongoClient.connect(url, function (err, db) {
  //                        if (err) {
  //                            console.log(err);
  //                            assert.notOk('There was an error trying to connect to the Mongo DB ', err);
  //                        }
  //
  //                        var collection = db.collection('sessions');
  //
  //                        if (collection.length < 1) {
  //                            assert.notOk('There sessions collection could not be set ', collection);
  //                        }
  //
  //                        collection.find().toArray()
  //                            .then(function (result) {
  //                                if (result.length<0) {
  //                                    assert.notOk('There was a problem with the found sessions collection ', result);
  //                                }
  //                                session = result[0].session;
  //                                callback(null, session);
  //                        });
  //                    });
  //                }
  //
  //            },
  //            function (err, results) {
  //                if(err) {
  //                    assert.notOk('There was a problem with the authentication', err, results);
  //                }
  //                assert.ok('The authentication process went smoothly');
  //            });
  //        done();
  //    });
  //});

  /* FUNCTION: logout ---------------------------------------------------------
   *
   */
  //describe.skip('[Function: logout]', function() {
  //        it('should successfully destroy the users session, and redirect the user to the non-logged in homepage', function (done) {
  //            request(sails.hooks.http.app)
  //                .post('/logout')
  //                .expect(302)
  //                .end(function(err,res, req){
  //                    if (err) {
  //                        assert.notOk('There was a problem with the authentication logging out ', err);
  //                    }
  //
  //                    res.res.connection._httpMessage.path.should.equal('/logout');
  //
  //                    done();
  //                })
  //
  //
  //        });
  //});

  describe('fromSignInPage', () => {
    const reqStub = {
      session: {
        email: 'foo@bar.com',
        passport: {
          user: 123,
        },
      },
      _sails: {
        config: {
          session: {
            cookie: {
              maxAge: 1800000,
            },
          },
        },
      },
      query: {
        name: '',
      },
    }

    const resStub = {
      forbidden: () => {},
      cookie: () => {},
      serverError: () => {},
      redirect: vi.fn(),
      view: vi.fn(),
    }

    beforeEach(() => {
      vi.spyOn(UserModels.User, 'findOne').mockResolvedValue({
        id: 123,
        premiumServiceEnabled: false,
      })
      vi.spyOn(UserModels.AccountDetails, 'findOne').mockResolvedValue({})
      vi.spyOn(UserModels.SavedAddress, 'findAll').mockResolvedValue([])
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('redirects to the upload page if continueEAppFlow is true in session', async () => {
      // when
      reqStub.session.continueEAppFlow = true
      await AuthController.fromSignInPage(reqStub, resStub)

      // then
      expect(resStub.redirect.mock.calls[0][0]).to.equal('/upload-files')
    })

    it('redirect to upload page if continueEAppFlow is true & no "name" query param exists', async () => {
      // when
      reqStub.session.continueEAppFlow = true
      reqStub.query.name = null
      await AuthController.fromSignInPage(reqStub, resStub)

      // then
      expect(resStub.redirect.mock.calls[0][0]).to.equal('/upload-files')
    })

    it("redirects to fallback page if there's nowhere to redirect", async () => {
      // when
      reqStub.session.continueEAppFlow = false
      reqStub.query.name = 'premiumCheck'
      await AuthController.fromSignInPage(reqStub, resStub)

      // then
      expect(resStub.view.mock.calls[0][0]).to.equal('upgrade.ejs')
    })
  })

  describe('sessionExpired', () => {
    const reqStub = {
      query: {
        LoggedIn: true,
      },
      _sails: {
        config: {
          upload: {
            s3_bucket: 'test_bucket',
          },
          customURLs: {
            userServiceURL: 'test_url',
          },
        },
      },
    }
    const resStub = {
      clearCookie: vi.fn(),
      view: vi.fn(),
    }

    beforeEach(() => {
      vi.spyOn(sails.log, 'info')
      vi.spyOn(sails.log, 'error')
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should redirect to session-expired page', () => {
      // when
      AuthController.sessionExpired(reqStub, resStub)

      // then
      expect(resStub.view.mock.calls[0][0]).to.equal('session-expired.ejs')
    })

    it('should pass loggedIn value to page', () => {
      // when
      AuthController.sessionExpired(reqStub, resStub)

      // then
      const expectedData = {
        LoggedIn: true,
        special_case: false,
        userServiceURL: 'test_url',
      }
      expect(resStub.view.mock.calls[0]).to.deep.equal(['session-expired.ejs', expectedData])
    })
  })
})
