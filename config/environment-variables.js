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
var rabbitmq = JSON.parse(process.env.RABBITMQ);
var session = JSON.parse(process.env.THESESSION);
var customurls = JSON.parse(process.env.CUSTOMURLS);
var paths = JSON.parse(process.env.PATHS);
var casebookKey = process.env.CASEBOOKKEY
var casebookCertificate = process.env.CASEBOOKCERTIFICATE
var live_variables = JSON.parse(process.env.LIVEVARIABLES);
var mongoURL = JSON.parse(process.env.MONGOURL).mongoURL;
var standardServiceRestrictions = JSON.parse(process.env.STANDARDSERVICERESTRICTIONS)

var pgpassword = process.env.PGPASSWORD;
var hmacKey = process.env.HMACKEY;

var config = {
    "userServiceSequelize":new Sequelize(userservicesequelize.dbName, userservicesequelize.dbUser, userservicesequelize.dbPass, {
          'host': userservicesequelize.host,
          'port':userservicesequelize.port,
          'dialect': 'postgres',
          'logging': false
        }),
  payment: {"paymentStartPageUrl":payment.paymentStartPageUrl, "additionalPaymentStartPageUrl":payment.additionalPaymentStartPageUrl},
    connections:  {ApplicationDatabase: {
        adapter: 'sails-postgresql',
        host: applicationDatabase.host,
        user: applicationDatabase.user,
        password: applicationDatabase.password,
        database: applicationDatabase.database,
        dialect: 'postgres',
        options: {
              dialect: 'postgres',
              host: applicationDatabase.host,
              dialectOptions: {
                socketPath: ''
              },
              port: applicationDatabase.port,
              logging: true
            }
        }
    },
    "rabbitMQ": {
        "queueLocation": rabbitmq.queueLocation,
        "queueName": rabbitmq.queueName,
        "exchangeName": rabbitmq.exchangeName,
        "retryQueue": rabbitmq.retryQueue,
        "retryExchange": rabbitmq.retryExchange,
        "retryDelay": rabbitmq.retryDelay
    },
    // "session": {
    //         "secret": session.secret,
    //         "adapter": session.adapter,
    //         "url" :mongoURL,/*
    //         "host": session.host,
    //         "db": session.db,
    //         "port": session.port,
    //         "user": session.user,
    //         "password": session.password,*/
    //         "collection": session.collection,
    //         "key": session.key,
    //         "domain": session.domain,
    //         "cookie": {
    //             "maxAge": 1800000,
    //             "rolling": true
    //         }
    // },
  // "session": {
  //           "secret": session.secret,
  //           "adapter": 'redis',
  //           // "url" : 'redis://127.0.0.1:6379',
  //           host: 'localhost',
  //           port: 6379,
  //           db: 0,
  //           prefix: 'sess:',
  //           /*"host": session.host,
  //           "db": session.db,
  //           "port": session.port,
  //           "user": session.user,
  //           "password": session.password,*/
  //           // "collection": session.collection,
  //           // "key": session.key,
  //           // "domain": session.domain,
  //           "cookie": {
  //               "maxAge": 1800000,
  //               "rolling": true
  //           }
  //   },

    "views": {
        "locals":{
            piwikID: session.piwikId,
            feedbackURL:live_variables.Public ? live_variables.feedbackURL : "http://www.smartsurvey.co.uk/s/2264M/",
            service_public: live_variables.Public || false,
            start_url: live_variables.startPageURL || '/',
            govuk_url: live_variables.GOVUKURL || '/'

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
            "applicationStatusAPIURL": customurls.applicationStatusAPIURL
    },
    // the service restrictions only work if you have a user account.
    standardServiceRestrictions:{
      "enableRestrictions":standardServiceRestrictions.enableRestrictions || false,
      "maxNumOfDocumentsPerSubmission":standardServiceRestrictions.maxNumOfDocumentsPerSubmission || 10,
      "appSubmissionTimeFrameInDays":standardServiceRestrictions.appSubmissionTimeFrameInDays || 7,
      "maxNumOfAppSubmissionsInTimeFrame":standardServiceRestrictions.maxNumOfAppSubmissionsInTimeFrame || 1
    },
    pgpassword: pgpassword,
    paths: {
        "certificatePath":  paths.certificatePath,
        "keyPath": paths.keyPath
    },
    casebookKey: casebookKey,
    casebookCertificate: casebookCertificate,
    "hmacKey": hmacKey
};

module.exports = config;
