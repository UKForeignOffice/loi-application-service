const crypto = require('crypto');
const axios = require('axios');
const https = require('https');

const queryParamObjToStr = require('../helper/queryParamObjToStr');
const config = require('../../config/environment-variables');

const {
    hmacKey,
    casebookCertificate: cert,
    casebookKey: key,
    customURLs,
} = config;

const baseRequest = axios.create({
    baseURL: customURLs.casebookBaseUrl,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'api-version': '4',
    },
    httpsAgent: new https.Agent({
        cert,
        key,
        keepAlive: false,
    }),
    paramsSerializer: queryParamObjToStr,
    transformRequest: [addHmacToQueryParam],
});

baseRequest.interceptors.request.use(addHashToHeader);

function getApplicationStatus(applicationReference) {
    const queryParamsObj = {
        timestamp: Date.now().toString(),
        applicationReference,
    };

    return baseRequest.get('/getApplicationStatusUpdate', {
        params: queryParamsObj,
    });
}

function getApplicationsStatuses(results) {
    if (!Array.isArray(results)) {
        throw new Error('results argument must be an array');
    }

    const applicationReferences = results.map((result) => result.unique_app_id);

    return getApplicationStatus(applicationReferences);
}

function getApostilleDownload(apostilleReference) {
    const queryParamsObj = {
        timestamp: Date.now().toString(),
        apostilleReference,
    };

    return baseRequest.get('/downloadApostille', {
        params: queryParamsObj,
        responseType: 'stream',
    });
}

function addHashToHeader(config) {
    const queryStr = queryParamObjToStr(config.params);
    const hash = crypto
        .createHmac('sha512', hmacKey)
        .update(Buffer.from(queryStr, 'utf-8'))
        .digest('hex')
        .toUpperCase();

    config.headers.hash = hash;
    return config;
}

function addHmacToQueryParam(data, _headers) {
    data = {
        hmac: hmacKey,
    };
    return JSON.stringify(data);
}

function getApplicationReceipt(applicationReference) {
    const queryParamsObj = {
        timestamp: Date.now().toString(),
        applicationReference,
    };

    return baseRequest.get('/downloadReceipt', {
        params: queryParamsObj,
        responseType: 'stream',
    });
}

module.exports = {
    getApplicationStatus,
    getApostilleDownload,
    getApplicationReceipt,
    getApplicationsStatuses,
};
