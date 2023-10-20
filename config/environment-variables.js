const Sequelize = require('sequelize');
require('dotenv').config();
// var env = dotenv.config({path: process.env.DOTENV || '.env'});
const userservicesequelize = JSON.parse(process.env.USERSERVICESEQUELIZE);
const applicationDatabase = JSON.parse(process.env.APPLICATIONDATABASE);
const payment = JSON.parse(process.env.PAYMENT);
// var additionalPayments = JSON.parse(env.ADDITIONALPAYMENTS);
// var rabbitmq = JSON.parse(process.env.RABBITMQ);
const session = JSON.parse(process.env.THESESSION);
const customurls = JSON.parse(process.env.CUSTOMURLS);
const casebookKey = process.env.NODE_ENV !== 'development' ? process.env.CASEBOOKKEY : process.env.CASEBOOKKEY.replace(/\\n/gm, '\n');
const casebookCertificate = process.env.NODE_ENV !== 'development' ? process.env.CASEBOOKCERTIFICATE : process.env.CASEBOOKCERTIFICATE.replace(/\\n/gm, '\n');
const live_variables = JSON.parse(process.env.LIVEVARIABLES);
const standardServiceRestrictions = JSON.parse(process.env.STANDARDSERVICERESTRICTIONS)
const upload = JSON.parse(process.env.UPLOAD);
const pgpassword = process.env.PGPASSWORD;
const hmacKey = process.env.HMACKEY;
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
            verifyPdfSignature: live_variables.verifyPdfSignature || false,
            showNotificationBanner: live_variables.showNotificationBanner || false,
            notificationBannerText: live_variables.notificationBannerText || ''
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
