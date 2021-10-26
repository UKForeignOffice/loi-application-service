const crypto = require('crypto');
const apiQueryString = require('querystring');
const request = require('request');
const requestPromise = require('request-promise');
const sails = require('sails');

const CasebookService = {
    get(options) {
        return CasebookService._returnRequestMethods('get', options);
    },

    post(options) {
        return CasebookService._returnRequestMethods('post', options);
    },

    _returnRequestMethods(method, options) {
        const requestType = options.promise ? requestPromise : request;
        delete options.promise;

        const authParams = CasebookService._createAuthParams(options.qs);
        const optionsWithAuthParams = { ...options, ...authParams };

        return requestType[method](optionsWithAuthParams);
    },

    _createAuthParams(queryParamsObj) {
        const {
            hmacKey,
            casebookCertificate: cert,
            casebookKey: key,
        } = sails.config;

        const queryStr = apiQueryString.stringify(queryParamsObj);

        const hash = crypto
            .createHmac('sha512', hmacKey)
            .update(Buffer.from(queryStr, 'utf-8'))
            .digest('hex')
            .toUpperCase();

        return {
            agentOptions: {
                cert,
                key,
            },
            headers: {
                hash,
            },
        };
    },
};

module.exports = CasebookService;
