const crypto = require('crypto');
const axios = require('axios');
const https = require('https');

const config = require('../../config/environment-variables')
const {
    hmacKey,
    casebookCertificate: cert,
    casebookKey: key,
    customURLs,
} = config;

const CasebookService = axios.create({
    baseURL: customURLs.casebookBaseUrl,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'api-version': '4',
    },
    httpsAgent: new https.Agent({
        cert,
        key,
        keepAlive: true,
    }),
    paramsSerializer: queryParamObjToStr,
    transformRequest: [addHmacToQueryParam],
});

function queryParamObjToStr(queryParamsObj) {
    const params = new URLSearchParams();

    Object.entries(queryParamsObj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            for (const val of value) {
                params.append(key, val);
            }
        } else {
            params.append(key, value.toString());
        }
    });

    return params.toString();
}

function addHmacToQueryParam(data, _headers) {
    data = {
        hmac: hmacKey
    };
    return JSON.stringify(data);
}

CasebookService.interceptors.request.use(addHashToHeader);

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

module.exports = CasebookService;
