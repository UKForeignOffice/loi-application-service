const crypto = require('crypto');
const apiQueryString = require('querystring');
const axios = require('axios');
const https = require('https');
const sails = require('sails');
// ---
const request = require('request');
const requestPromise = require('request-promise');

const CasebookService = {
    get(options) {
        return CasebookService._returnRequestMethods('get', options);
    },

    post(options) {
        return CasebookService._returnRequestMethods('post', options);
    },

    _returnRequestMethods(method, options) {
        const authParams = CasebookService._createAuthParams(
            options.url,
            options.params,
            sails
        );
        delete options.url;
        delete options.params;

        const optionsWithAuthParams = {
            ...options,
            ...authParams,
            method,
        };

        return axios(optionsWithAuthParams);
    },

    _createAuthParams(url,queryParamsObj, sails) {
        const {
            hmacKey,
            casebookCertificate: cert,
            casebookKey: key,
        } = sails.config;

        const httpsAgent = new https.Agent({
            cert,
            key,
            keepAlive: true,
        });

        const queryStr = apiQueryString.stringify(queryParamsObj);

        const hash = crypto
            .createHmac('sha512', hmacKey)
            .update(Buffer.from(queryStr, 'utf-8'))
            .digest('hex')
            .toUpperCase();

        return {
            url: `${url}?${queryStr}&hmac=${hash}`,
            httpsAgent,
            headers: {
                hash,
                'Content-Type': 'application/json; charset=utf-8',
                'api-version': '4',
            },
        };
    },
};

module.exports = CasebookService;
