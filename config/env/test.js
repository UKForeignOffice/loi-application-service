/**
 * Environment settings
 *
 * This file can include shared settings that override settings in indvidual files in the config folder,
 * Here we are using environment variables and the dotenv npm package to load sensitive information
 * that should not be included in the public repo
 *
 */

var Sequelize = require('sequelize');
var dotenv = require('dotenv');
var env = dotenv.config();
var userservicesequelize = JSON.parse(env.USERSERVICESEQUELIZE);
var applicationDatabase = JSON.parse(env.APPLICATIONDATABASE);
var payment = JSON.parse(env.PAYMENT);
var rabbitmq = JSON.parse(env.RABBITMQ);
var session = JSON.parse(env.THESESSION);
var customurls = JSON.parse(env.CUSTOMURLS);
var pgpassword = env.PGPASSWORD;

var config = {
    "userServiceSequelize":new Sequelize(userservicesequelize.dbName, userservicesequelize.dbUser, userservicesequelize.dbPass, {
        'host': userservicesequelize.host,
        'port':userservicesequelize.port,
        'dialect': 'postgres',
        'logging': false
    }),
    payment: {"paymentStartPageUrl":payment.paymentStartPageUrl},
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
    "session": {
        "secret": session.secret,
        "adapter": session.adapter,
        "host": session.host,
        "db": session.db,
        "port": session.port,
        "collection": session.collection,
        "key": session.key,
        "domain": session.domain,
        "cookie": {
            "maxAge": 1800000
        }
    },
    "customURLs": {
        "postcodeLookUpApiOptions" : {
            "uri":customurls.postcodeLookUpApiOptions.uri,
            "proxy":customurls.postcodeLookUpApiOptions.proxy
        },
        "logoutUrl" : customurls.logoutUrl,
        "userServiceURL": customurls.userServiceURL,
        "notificationServiceURL": customurls.notificationServiceURL,
        "mongoURL": customurls.mongoURL
    },
    pgpassword: pgpassword
};

module.exports = config;
