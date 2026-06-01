const Sequelize = require('sequelize')
require('dotenv').config()

const applicationDatabase = process.env.APPLICATIONDATABASE
  ? JSON.parse(process.env.APPLICATIONDATABASE)
  : {
      host: 'localhost',
      user: 'postgres',
      password: 'password',
      database: 'FCO-LOI-Service',
      port: 5432,
      ssl: 'disable',
    }
const userservicesequelize = process.env.USERSERVICESEQUELIZE
  ? JSON.parse(process.env.USERSERVICESEQUELIZE)
  : {
      host: 'localhost',
      database: 'FCO-LOI-User',
      user: 'postgres',
      password: 'password',
      port: 5432,
      ssl: 'disable',
    }
const payment = process.env.PAYMENT
  ? JSON.parse(process.env.PAYMENT)
  : {
      paymentStartPageUrl: 'http://localhost:3003/api/payment/submit-payment',
      additionalPaymentStartPageUrl: 'http://localhost:3003/api/payment/submit-additional-payment',
    }
const session = process.env.THESESSION
  ? JSON.parse(process.env.THESESSION)
  : {
      secret: 'fake-secret',
      adapter: 'connect-redis',
      host: 'localhost',
      port: 6379,
      password: '',
      prefix: 'sess:',
      key: 'express.sid',
      domain: 'http://localhost/',
      cookie: { cookieMaxAge: 1800000, timeoutWarning: 300000 },
      piwikId: 999,
    }
const customurls = process.env.CUSTOMURLS
  ? JSON.parse(process.env.CUSTOMURLS)
  : {
      postcodeLookUpApiOptions: { uri: 'http://localhost:3004/api/address/', timeout: 5000 },
      logoutUrl: 'http://localhost:3001/api/user/logout',
      userServiceURL: 'http://localhost:3001/api/user',
      notificationServiceURL: 'http://localhost:3002/api/notification',
      mongoURL: 'mongodb://localhost:27017/',
    }
const live_variables = process.env.LIVEVARIABLES
  ? JSON.parse(process.env.LIVEVARIABLES)
  : {
      Public: false,
      startPageURL: 'https://www.gov.uk/get-document-legalised',
      GOVUKURL: 'https://www.gov.uk/',
      feedbackURL: 'https://www.smartsurvey.co.uk/s/legalisation/',
      doneSurveyStandard: 'https://www.gov.uk/done/get-document-legalised-standard',
      doneSurveyPremium: 'https://www.gov.uk/done/get-document-legalised-premium',
      doneSurveyEapostille: 'https://www.gov.uk/done/get-document-legalised-eapostille',
      numOfWorkingDaysStandard: '5',
      numOfWorkingDaysEapp: '2',
      showPremiumServiceAmendedOpeningHours: false,
      showPremiumServiceWarningMessage: false,
      premiumServiceWarningMessageTextLine1: '',
      premiumServiceWarningMessageTextLine2: '',
      caseManagementSystem: 'ORBIT',
      verifyPdfSignature: true,
      showNotificationBanner: false,
      notificationBannerText: '',
      standardAppPrice: 45,
      urgentAppPrice: 100,
      dropOffAppPrice: 40,
    }
const standardServiceRestrictions = process.env.STANDARDSERVICERESTRICTIONS
  ? JSON.parse(process.env.STANDARDSERVICERESTRICTIONS)
  : {
      enableRestrictions: false,
      maxNumOfDocumentsPerSubmission: 10,
      appSubmissionTimeFrameInDays: 7,
      maxNumOfAppSubmissionsInTimeFrame: 1,
    }
const upload = process.env.UPLOAD
  ? JSON.parse(process.env.UPLOAD)
  : {
      s3_bucket: 'leg-demo-upload-d4szp8',
      clamav_host: 'localhost',
      clamav_port: '3310',
      clamav_enabled: 'true',
      clamav_debug_enabled: 'false',
      file_upload_size_limit: '200',
      s3_url_expiry_hours: '24',
      cost_per_document: '35',
      max_files_per_application: '50',
      max_days_to_download: '21',
    }
const edmsHost = process.env.EDMS_HOST
const edmsBearerToken = process.env.EDMS_BEARER_TOKEN
  ? JSON.parse(process.env.EDMS_BEARER_TOKEN)
  : { 'EDMS-Web-Submissions-Token': 'fake-token' }
const edmsAuthHost = process.env.EDMS_AUTH_HOST
const edmsAuthScope = process.env.EDMS_AUTH_SCOPE
const pgpassword = process.env.PGPASSWORD
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
      connectTimeout: 15000, // 15 seconds timeout
    },
    retry: {
      base: 1000,
      multiplier: 2,
      max: 5000,
    },
  },
)

const config = {
  applicationDatabase,
  userserviceDatabase: userservicesequelize,
  userServiceSequelize,
  session,
  payment: {
    paymentStartPageUrl: payment.paymentStartPageUrl,
    additionalPaymentStartPageUrl: payment.additionalPaymentStartPageUrl,
  },
  views: {
    locals: {
      piwikID: session.piwikId,
      feedbackURL: live_variables.feedbackURL,
      doneSurveyStandard: live_variables.doneSurveyStandard,
      doneSurveyPremium: live_variables.doneSurveyPremium,
      doneSurveyEapostille: live_variables.doneSurveyEapostille,
      service_public: live_variables.Public || false,
      start_url: live_variables.startPageURL || '/',
      govuk_url: live_variables.GOVUKURL || '/',
      numOfWorkingDaysStandard: live_variables.numOfWorkingDaysStandard || '10',
      numOfWorkingDaysEapp: live_variables.numOfWorkingDaysEapp || '2',
      caseManagementSystem: live_variables.caseManagementSystem,
      verifyPdfSignature: live_variables.verifyPdfSignature || false,
      showNotificationBanner: live_variables.showNotificationBanner || false,
      notificationBannerText: live_variables.notificationBannerText || '',
      standardAppPrice: live_variables.standardAppPrice,
      urgentAppPrice: live_variables.urgentAppPrice,
      dropOffAppPrice: live_variables.dropOffAppPrice,
    },
  },
  customURLs: {
    postcodeLookUpApiOptions: {
      uri: customurls.postcodeLookUpApiOptions.uri,
      proxy: customurls.postcodeLookUpApiOptions.proxy,
      timeout: customurls.postcodeLookUpApiOptions.timeout,
    },
    logoutUrl: customurls.logoutUrl,
    userServiceURL: customurls.userServiceURL,
    notificationServiceURL: customurls.notificationServiceURL,
  },
  // the service restrictions only work if you have a user account.
  standardServiceRestrictions: {
    enableRestrictions: standardServiceRestrictions.enableRestrictions || false,
    maxNumOfDocumentsPerSubmission: standardServiceRestrictions.maxNumOfDocumentsPerSubmission || 10,
    appSubmissionTimeFrameInDays: standardServiceRestrictions.appSubmissionTimeFrameInDays || 7,
    maxNumOfAppSubmissionsInTimeFrame: standardServiceRestrictions.maxNumOfAppSubmissionsInTimeFrame || 1,
  },
  pgpassword,
  edmsHost,
  edmsBearerToken,
  upload,
  edmsAuthHost,
  edmsAuthScope,
}

module.exports = config
