/**
 * UsersBasicDetailsController module.
 * @module Controller UsersBasicDetailsController
 */


const UsersBasicDetails = require('../models/index').UsersBasicDetails
const UserModels = require('../userServiceModels/models.js');
const ValidationService = require("../services/ValidationService");
const HelperService = require("../services/HelperService");

var mobilePattern = /^(\+|\d|\(|\#| )(\+|\d|\(| |\-)([0-9]|\(|\)| |\-){5,14}$/;
var phonePattern =  /^(\+|\d|\(|\#| )(\+|\d|\(| |\-)([0-9]|\(|\)| |\-){5,14}$/;
  //old phone pattern /([0-9]|[\-+#() ]){6,}/;

var UserBasicDetailsCtrl = {

  renderBasicUserDetailsPage: function (req, res) {
    res.redirect('/your-basic-details');
  },

  /**
   * Render the basic user details page depending on if this is an update or a new application
   * @param req
   * @param res
   */
  userBasicDetailsPage: function (req, res) {
    // If we just came from Standard journey's document checker, display important information first
    if(req.session.last_doc_checker_page != '/check-documents-important-information') {
      // Tell Important Info page we are not on the premium flow
      req.session.last_business_application_page = null;
      // Store the page before important information for backwards navigation
      req.session.doc_checker_page_before_important_information = req.session.last_doc_checker_page;
      // Set Important Info to be the last document checker page before the User Basic Details page
      req.session.last_doc_checker_page = '/check-documents-important-information';

      res.redirect('/check-documents-important-information');
    } else {
      //Initialise countryHasChanged
      req.session.countryHasChanged = false;

      UsersBasicDetails.findOne({
          where: {
            application_id: req.session.appId
          }
        }
      )
        .then(function (data) {
          if (data === null) {
            var user_data = HelperService.getUserData(req, res);
            if (user_data.loggedIn && user_data.account !== null && (req.session.useDetails || req.query.use_saved_details || req.session.last_user_details_page == 'saved')) {
              return UserModels.User.findOne({where: {email: req.session.email}}).then(function (user) {
                return UserModels.AccountDetails.findOne({where: {user_id: user.id}}).then(function (account) {
                  req.session.last_user_details_page = 'saved';
                  return res.view('applicationForms/savedDetails/savedBasicDetails.ejs', {
                    user: user,
                    account: account,
                    application_id: req.session.appId,
                    form_values: false,
                    answer: req.session.useDetails,
                    error_report: false,
                    update: false,
                    submit_status: req.session.appSubmittedStatus,
                    current_uri: req.originalUrl,
                    summary: req.session.summary,
                    last_doc_checker_page: req.session.last_doc_checker_page,
                    selected_docs: req.session.selectedDocuments,
                    user_data: HelperService.getUserData(req, res)
                  });
                });
              });
            } else {
              req.session.last_user_details_page = 'manual';
              return res.view('applicationForms/usersBasicDetails.ejs', {
                application_id: req.session.appId,
                form_values: false,
                error_report: false,
                update: false,
                submit_status: req.session.appSubmittedStatus,
                current_uri: req.originalUrl,
                last_doc_checker_page: req.session.last_doc_checker_page,
                selected_docs: req.session.selectedDocuments,
                summary: req.session.summary,
                user_data: HelperService.getUserData(req, res)
              });
            }
          }
          else {
            var nextPage = 'userAddressDetails';
            var anUpdate = false;
            return UserBasicDetailsCtrl.populateBasicDetailsForm(req, res, nextPage, anUpdate);
          }

        })
        .catch(function (error) {
          sails.log(error);
          console.log(error);
        });
    }

  },

  savedUserDetails: function (req, res) {

    function validateAndSanitiseInput(input) {
      // Ensure the input is a string representation of a boolean
      return input === "true" || input === "false" ? input : null;
    }

    const useDetailsInput = validateAndSanitiseInput(req.body.use_details);

    if (useDetailsInput !== null && JSON.parse(useDetailsInput)) {
      req.session.useDetails = true;
      UserModels.User.findOne({where: {email: req.session.email}}).then(function (user) {
        UserModels.AccountDetails.findOne({where: {user_id: user.id}}).then(function (account) {
          UsersBasicDetails.findOne({where: {application_id: req.session.appId}}).then(function (data) {
            var mobileValue;
            if(account.mobileNo != null) {
              mobileValue = account.mobileNo.replace(/\s/g, "");
            }
            else {
              mobileValue = account.mobileNo;
            }

            if (!mobileValue) {
              // forcing user to enter a mobile number
              req.session.useDetails = false;
              req.session.last_user_details_page = 'manual';

              const userFormData = {
                first_name: account.first_name,
                last_name: account.last_name,
                telephone: account.telephone,
                mobileNo: '',
                has_email: 'yes',
                email: req.session.email,
                confirm_email: req.session.email
              };

              const erroneousFields = ['mobileNo'];
              const error = {errors: [
                {
                  message: '[{"errInfo":"You have not provided a valid mobile phone number","errSoltn":"Enter a valid mobile phone number","questionId":"mobileNo"}]',
                }
              ]};

              return res.view('applicationForms/usersBasicDetails.ejs', {
                application_id: req.session.appId,
                form_values: userFormData,
                update: true,
                error_report: ValidationService.validateForm({error: error, erroneousFields: erroneousFields}),
                summary: req.session.summary,
                submit_status: req.session.appSubmittedStatus,
                current_uri: req.originalUrl,
                last_doc_checker_page: req.session.last_doc_checker_page,
                selected_docs: req.session.selectedDocuments,
                user_data: HelperService.getUserData(req, res)
              });
            }

            if (data) {
              UsersBasicDetails.update({
                first_name: account.first_name,
                last_name: account.last_name,
                telephone: account.telephone,
                mobileNo: mobileValue,
                has_email: true,
                email: user.email.trim(),
                confirm_email: user.email.trim()
              }, {
                where: {
                  application_id: req.session.appId
                }
              })
                .then(function () {
                    req.session.full_name = account.first_name + ' ' + account.last_name;
                    if (req.session.summary) {
                      return res.redirect('/review-summary');
                    }
                    else {
                      return res.redirect('/provide-your-address-details');
                    }
                  }
                )
                .catch(function (error) {
                  sails.log.error(error);
                  UserBasicDetailsCtrl.buildErrorArrays(error, req, res);
                });
            } else {
              UsersBasicDetails.create({
                application_id: req.session.appId,
                first_name: account.first_name,
                last_name: account.last_name,
                telephone: account.telephone,
                mobileNo: mobileValue,
                has_email: true,
                email: user.email.trim(),
                confirm_email: user.email.trim()
              })
                .then(function () {
                    req.session.full_name = account.first_name + ' ' + account.last_name;
                    if (req.session.summary) {
                      res.redirect('/review-summary');
                    }
                    else {
                      res.redirect('/provide-your-address-details');
                    }


                    return null;
                  }
                )
                .catch(function (error) {
                  sails.log.error(error);
                  UserBasicDetailsCtrl.buildErrorArrays(error, req, res);
                });
            }
          });

        });
      });
    } else {
      req.session.useDetails = false;
      req.session.last_user_details_page = 'manual';
      return res.redirect('/provide-your-details');

    }
  },

  /**
   * Send user entered information to the database
   * @param req
   * @param res
   */
  submitBasicDetails: function (req, res) {
    if (typeof (req.body.has_email) == 'undefined') {
      // has_email question has been removed so users are now required
      // to enter an email address. As the question is no longer asked,
      // it will always be undefined. So defaulting it to yes.
      req.body.has_email = 'yes';
    }
    var isemail = require('isemail');
    var emailValid = isemail.validate(req.body.email);

    /*
     * Find instance of Application ID
     * If found do an update to corresponding fields
     * If NOT found, create a new record instance for the Application ID
     */
    UsersBasicDetails.findOne(
      {
        where: {
          application_id: req.session.appId
        }
      }
    )
      .then(function (data) {
        if (data) {
          var update;
          if (req.body.has_email == "yes") {
            if (req.body.telephone != '') {
              update = {
                first_name: req.param('first_name'),
                last_name: req.param('last_name'),
                telephone: phonePattern.test(req.param('telephone')) ? req.param('telephone') : '',
                mobileNo: mobilePattern.test(req.param('mobileNo')) ? req.param('mobileNo') : '',
                has_email: req.body.has_email,
                email: emailValid ? req.param('email').trim() : 'INVALID',
                confirm_email: req.param('confirm_email') === req.param('email') ? req.param('confirm_email').trim() : 'INVALID'
              };
            }
            else {
              update = {
                first_name: req.param('first_name'),
                last_name: req.param('last_name'),
                telephone: null,
                mobileNo: mobilePattern.test(req.param('mobileNo')) ? req.param('mobileNo') : '',
                has_email: req.body.has_email,
                email: emailValid ? req.param('email').trim() : 'INVALID',
                confirm_email: req.param('confirm_email') === req.param('email') ? req.param('confirm_email').trim() : 'INVALID'
              };

            }
          } else {
            if (req.body.telephone != '') {
              update = {
                first_name: req.param('first_name'),
                last_name: req.param('last_name'),
                telephone: phonePattern.test(req.param('telephone')) ? req.param('telephone') : '',
                mobileNo: mobilePattern.test(req.param('mobileNo')) ? req.param('mobileNo') : '',
                has_email: req.body.has_email,
                email: null
              };
            }
            else {
              update = {
                first_name: req.param('first_name'),
                last_name: req.param('last_name'),
                telephone: null,
                mobileNo: mobilePattern.test(req.param('mobileNo')) ? req.param('mobileNo') : '',
                has_email: req.body.has_email,
                email: null
              };

            }

          }
          UsersBasicDetails.update(
            update,
            {
              where: {
                application_id: req.session.appId
              }
            }
          ).then(function () {
            req.session.full_name = req.param('first_name') + ' ' + req.param('last_name');
            if (!req.session.summary) {
              req.session.return_address = 'documentQuantity';
              res.redirect('/provide-your-address-details');
            }
            else {
              res.redirect('/review-summary');
            }

            return null;
          })
            .catch(function (error) {
              sails.log.error(error);
              UserBasicDetailsCtrl.buildErrorArrays(error, req, res);
            });

        } else {
          var create;
          if (req.body.has_email == "yes") {
            if (req.body.telephone != '') {
              create = {
                application_id: req.session.appId,
                first_name: req.param('first_name'),
                last_name: req.param('last_name'),
                telephone: phonePattern.test(req.param('telephone')) ? req.param('telephone') : '',
                mobileNo: mobilePattern.test(req.param('mobileNo')) ? req.param('mobileNo') : '',
                has_email: req.body.has_email,
                email: emailValid ? req.param('email').trim() : 'INVALID',
                confirm_email: req.param('confirm_email') === req.param('email') ? req.param('confirm_email').trim() : 'INVALID'
              };
            } else {
              create = {
                application_id: req.session.appId,
                first_name: req.param('first_name'),
                last_name: req.param('last_name'),
                mobileNo: mobilePattern.test(req.param('mobileNo')) ? req.param('mobileNo') : '',
                has_email: req.body.has_email,
                email: emailValid ? req.param('email').trim() : 'INVALID',
                confirm_email: req.param('confirm_email') === req.param('email') ? req.param('confirm_email').trim() : 'INVALID'
              }
            }
          } else {
            if (req.body.telephone != '') {
              create = {
                application_id: req.session.appId,
                first_name: req.param('first_name'),
                last_name: req.param('last_name'),
                telephone: phonePattern.test(req.param('telephone')) ? req.param('telephone') : '',
                mobileNo: mobilePattern.test(req.param('mobileNo')) ? req.param('mobileNo') : '',
                has_email: req.body.has_email
              };
            }
            else {
              create = {
                application_id: req.session.appId,
                first_name: req.param('first_name'),
                last_name: req.param('last_name'),
                mobileNo: mobilePattern.test(req.param('mobileNo')) ? req.param('mobileNo') : '',
                has_email: req.body.has_email
              };
            }
          }

          UsersBasicDetails.create(create)
            .then(function () {
                req.session.full_name = req.param('first_name') + ' ' + req.param('last_name');
                res.redirect('/provide-your-address-details');

                return null;
              }
            )
            .catch(function (error) {
              sails.log.error(error);
              UserBasicDetailsCtrl.buildErrorArrays(error, req, res);
            });
        }

        return null;
      }).catch(function (error) {
      sails.log(error);
      UserBasicDetailsCtrl.buildErrorArrays(error, req, res);
    });

  },

  /**
   * Populate the form controls with the previously entered user information as this is an update.
   * @param req
   * @param res
   */
  populateBasicDetailsForm: function (req, res, nextPage, anUpdate) {

    var summary = false;
    if (req.session.return_address != 'Summary') {
      req.session.return_address = 'AddressDetails';
    }
    else if (req.session.summary) {
      summary = true;
    }
    UsersBasicDetails.findOne({
      where: {
        application_id: req.session.appId
      }
    })
      .then(function (data) {
        var user_data = HelperService.getUserData(req, res);
          if (user_data.loggedIn && user_data.account !== null && (req.session.useDetails || req.query.use_saved_details || req.session.last_user_details_page == 'saved')) {
            UserModels.User.findOne({where: {email: req.session.email}}).then(function (user) {
              UserModels.AccountDetails.findOne({where: {user_id: user.id}}).then(function (account) {
                req.session.last_user_details_page = 'saved';
                return res.view('applicationForms/savedDetails/savedBasicDetails.ejs', {
                  user: user,
                  account: account,
                  application_id: req.session.appId,
                  form_values: false,
                  answer: req.session.useDetails,
                  error_report: false,
                  update: false,
                  submit_status: req.session.appSubmittedStatus,
                  summary: req.session.summary,
                  current_uri: req.originalUrl,
                  last_doc_checker_page: req.session.last_doc_checker_page,
                  selected_docs: req.session.selectedDocuments,
                  user_data: HelperService.getUserData(req, res)
                });
              });
            });
          } else {
            req.session.last_user_details_page = 'manual';
            return res.view('applicationForms/usersBasicDetails.ejs', {
              application_id: req.session.appId,
              form_values: data.dataValues,
              update: (anUpdate === true || typeof anUpdate == 'undefined') ? true : false,
              error_report: false,
              summary: req.session.summary,
              submit_status: req.session.appSubmittedStatus,
              current_uri: req.originalUrl,
              last_doc_checker_page: req.session.last_doc_checker_page,
              selected_docs: req.session.selectedDocuments,
              user_data: HelperService.getUserData(req, res)
            });
          }
        }
      )
      .catch(function (error) {
        sails.log(error);
      });

  },


  /**
   * Take user to the Modify Basic Details page, but via a redirect so the method used is a POST, thus allowing the browser
   * back button to be used without hte need for refreshing the page
   * @param req
   * @param res
   */
  renderModifyBasicDetailsPage: function renderModifyBasicDetailsPage(req, res) {
    res.redirect('/modify-your-basic-details');
  },

  /**
   * Build an array of errors to allow them to be reendered on screen if any form validation errors are detected.
   * @param error
   * @param req
   * @param res
   * @returns {*}
   */
  buildErrorArrays: function (error, req, res) {
    var validate = require('validator');
    //console.log(error);
    // Custom error array builder for email match confirmation
    var erroneousFields = [];
    var check_emails = true;

    if (req.param('first_name') === '') {
      erroneousFields.push('first_name');
    }
    if (req.param('last_name') === '') {
      erroneousFields.push('last_name');
    }

    if (req.param('telephone') !== '') {
      if (req.param('telephone').length < 6 || req.param('telephone').length > 25 || !phonePattern.test(req.param('telephone'))) {
        erroneousFields.push('telephone');
      }
    }

    if (req.param('mobileNo') === "" && typeof(req.param('mobileNo')) != 'undefined') {
      if (req.param('mobileNo') === '' || req.param('mobileNo').length < 6 || req.param('mobileNo').length > 25 || !mobilePattern.test(req.param('mobileNo'))) {
        erroneousFields.push('mobileNo');
      }
    }
    if (req.param('has_email') === '') {
      erroneousFields.push('has_email');
      check_emails = false;
    }
    if (req.param('has_email') === 'no') {
      check_emails = false;
    }
    if (check_emails) {
      if (req.param('email') === '' || !validate.isEmail(req.param('email'))) {
        erroneousFields.push('email');
      }
      if (req.param('confirm_email') === '' || req.param('confirm_email') !== req.param('email') || !validate.isEmail(req.param('email'))) {
        erroneousFields.push('confirm_email');
      }
    }

    dataValues = [];
    dataValues.push({
      first_name: req.param('first_name') !== '' ? req.param('first_name') : "",
      last_name: req.param('last_name') !== '' ? req.param('last_name') : "",
      telephone: req.param('telephone') !== '' ? req.param('telephone') : "",
      mobileNo: req.param('mobileNo') !== '' ? req.param('mobileNo') : "",
      has_email: req.param('has_email') !== '' ? req.param('has_email') : "",
      email: req.param('email') !== '' ? req.param('email').trim() : "",
      confirm_email: req.param('confirm_email') !== '' || req.param('confirm_email').trim() !== req.param('email').trim() ? req.param('confirm_email').trim() : ""
    });


    return res.view('applicationForms/usersBasicDetails.ejs', {
      application_id: req.session.appId,
      error_report: ValidationService.validateForm({error: error, erroneousFields: erroneousFields}),
      form_values: dataValues[0], update: false,
      submit_status: req.session.appSubmittedStatus,
      current_uri: req.originalUrl,
      last_doc_checker_page: req.session.last_doc_checker_page,
      selected_docs: req.session.selectedDocuments,
      user_data: HelperService.getUserData(req, res),
      summary: req.session.summary
    });
  }

};

module.exports = UserBasicDetailsCtrl;
