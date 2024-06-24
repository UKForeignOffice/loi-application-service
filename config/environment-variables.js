const Sequelize = require('sequelize');
require('dotenv').config();

var userservicesequelize = JSON.parse(process.env.USERSERVICESEQUELIZE);
var applicationDatabase = JSON.parse(process.env.APPLICATIONDATABASE);
var payment = JSON.parse(process.env.PAYMENT);
var session = JSON.parse(process.env.THESESSION);
var customurls = JSON.parse(process.env.CUSTOMURLS);
var live_variables = JSON.parse(process.env.LIVEVARIABLES);
var standardServiceRestrictions = JSON.parse(process.env.STANDARDSERVICERESTRICTIONS)
var upload = JSON.parse(process.env.UPLOAD);
var edmsHost = process.env.EDMS_HOST;
var edmsBearerToken = JSON.parse(process.env.EDMS_BEARER_TOKEN);
var edmsAuthHost = process.env.EDMS_AUTH_HOST;
var edmsAuthScope = process.env.EDMS_AUTH_SCOPE;
var pgpassword = process.env.PGPASSWORD;
const userServiceSequelize = new Sequelize(
  userservicesequelize.database,
  userservicesequelize.user,
  userservicesequelize.password,
  {
    host: userservicesequelize.host,
    port: userservicesequelize.port,
    dialect: 'postgres',
    logging: process.env.NODE_ENV !== 'development' ? false : console.log,
    dialectOptions: {
      'connectTimeout': 15000 // 15 seconds timeout
    },
    retry: {
      base: 1000,
      multiplier: 2,
      max: 5000,
    }
  }
);

var config = {
  userServiceSequelize,
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
            numOfWorkingDaysStandard: live_variables.numOfWorkingDaysStandard || '10',
            numOfWorkingDaysEapp: live_variables.numOfWorkingDaysEapp || '2',
            showPremiumServiceWarningMessage: live_variables.showPremiumServiceWarningMessage || false,
            premiumServiceWarningMessageTextLine1: live_variables.premiumServiceWarningMessageTextLine1 || '',
            premiumServiceWarningMessageTextLine2: live_variables.premiumServiceWarningMessageTextLine2 || '',
            caseManagementSystem: live_variables.caseManagementSystem,
            verifyPdfSignature: live_variables.verifyPdfSignature || false,
            showNotificationBanner: live_variables.showNotificationBanner || false,
            notificationBannerText: live_variables.notificationBannerText || '',
            showPremiumServiceAmendedOpeningHours: live_variables.showPremiumServiceAmendedOpeningHours || false,
            standardAppPrice: live_variables.standardAppPrice,
            urgentAppPrice: live_variables.urgentAppPrice,
            dropOffAppPrice: live_variables.dropOffAppPrice
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
    edmsHost: edmsHost,
    edmsBearerToken,
    upload,
    edmsAuthHost,
    edmsAuthScope
};

module.exports = config;
