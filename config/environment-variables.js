/**
 * Environment settings
 *
 * This file can include shared settings that override settings in indvidual files in the config folder,
 * Here we are using environment variables and the dotenv npm package to load sensitive information
 * that should not be included in the public repo
 *
 */

var Sequelize = require('sequelize');
require('dotenv').config();
// var env = dotenv.config({path: process.env.DOTENV || '.env'});
var userservicesequelize = JSON.parse(process.env.USERSERVICESEQUELIZE);
var applicationDatabase = JSON.parse(process.env.APPLICATIONDATABASE);
var payment = JSON.parse(process.env.PAYMENT);
// var additionalPayments = JSON.parse(env.ADDITIONALPAYMENTS);
// var rabbitmq = JSON.parse(process.env.RABBITMQ);
var session = JSON.parse(process.env.THESESSION);
var customurls = JSON.parse(process.env.CUSTOMURLS);
var casebookKey = process.env.CASEBOOKKEY
var casebookCertificate = process.env.CASEBOOKCERTIFICATE
var live_variables = JSON.parse(process.env.LIVEVARIABLES);
var standardServiceRestrictions = JSON.parse(process.env.STANDARDSERVICERESTRICTIONS)
var upload = JSON.parse(process.env.UPLOAD);

var pgpassword = process.env.PGPASSWORD;
var hmacKey = process.env.HMACKEY;

var config = {
  "userServiceSequelize":new Sequelize(userservicesequelize.database, userservicesequelize.user, userservicesequelize.password, {
          'host': userservicesequelize.host,
          'port':userservicesequelize.port,
          'dialect': 'postgres',
          'logging': false
        }),
  payment: {"paymentStartPageUrl":payment.paymentStartPageUrl, "additionalPaymentStartPageUrl":payment.additionalPaymentStartPageUrl},
  "views": {
        "locals":{
            piwikID: session.piwikId,
            feedbackURL:live_variables.feedbackURL,
            doneSurveyStandard:live_variables.doneSurveyStandard,
            doneSurveyPremium:live_variables.doneSurveyPremium,
            doneSurveyEapostille:live_variables.doneSurveyEapostille,
            service_public: live_variables.Public || false,
            start_url: live_variables.startPageURL || '/',
            govuk_url: live_variables.GOVUKURL || '/',
            numOfWorkingDays: live_variables.numOfWorkingDays || '10',
            showPremiumServiceWarningMessage: live_variables.showPremiumServiceWarningMessage || false,
            premiumServiceWarningMessageTextLine1: live_variables.premiumServiceWarningMessageTextLine1 || '',
            premiumServiceWarningMessageTextLine2: live_variables.premiumServiceWarningMessageTextLine2 || ''
        }
    },
    "customURLs": {
            "postcodeLookUpApiOptions" : {
                "uri":customurls.postcodeLookUpApiOptions.uri,
                "proxy":customurls.postcodeLookUpApiOptions.proxy,
                "timeout":customurls.postcodeLookUpApiOptions.timeout
            },
            "logoutUrl" : customurls.logoutUrl,
            "userServiceURL": customurls.userServiceURL,
            "notificationServiceURL": customurls.notificationServiceURL,
            "mongoURL": customurls.mongoURL,
            "casebookBaseUrl": customurls.casebookBaseUrl,
    },
    // the service restrictions only work if you have a user account.
    standardServiceRestrictions:{
      "enableRestrictions":standardServiceRestrictions.enableRestrictions || false,
      "maxNumOfDocumentsPerSubmission":standardServiceRestrictions.maxNumOfDocumentsPerSubmission || 10,
      "appSubmissionTimeFrameInDays":standardServiceRestrictions.appSubmissionTimeFrameInDays || 7,
      "maxNumOfAppSubmissionsInTimeFrame":standardServiceRestrictions.maxNumOfAppSubmissionsInTimeFrame || 1
    },
    pgpassword: pgpassword,
    casebookKey: casebookKey,
    casebookCertificate: casebookCertificate,
    "hmacKey": hmacKey,
    upload
};

module.exports = config;
