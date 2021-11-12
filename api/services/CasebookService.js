const crypto = require('crypto');
const axios = require('axios');
const https = require('https');

const queryParamObjToStr = require('../helpers/queryParamObjToStr');
const config = require('../../config/environment-variables');

const {
    hmacKey,
    casebookCertificate: cert,
    casebookKey: key,
    customURLs,
} = config;

const CasebookService = {
    getApplicationStatus(applicationReference) {
        const queryParamsObj = {
            timestamp: Date.now().toString(),
            applicationReference,
        };
        const casebookRequestBase =
            CasebookService._createBaseRequest(queryParamsObj);

        return casebookRequestBase.get(customURLs.applicationStatusAPIURL, {
            params: paramsObj,
        });
    },

    getApostilleDownload(apostilleReference) {
        const queryParamsObj = {
            timestamp: Date.now().toString(),
            apostilleReference,
        };

        const casebookRequestBase =
            CasebookService._createBaseRequest(queryParamsObj);

        return casebookRequestBase.get(customURLs.apostilleDownloadAPIURL, {
            params: paramsObj,
            responseType: 'stream',
        });
    },

    _createBaseRequest(paramsObj) {
        const casebookRequestBase = axios.create({
            baseURL: customURLs.casebookBaseUrl,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'api-version': '4',
                hash: CasebookService._addHashToHeader(paramsObj),
            },
            httpsAgent: new https.Agent({
                cert,
                key,
                keepAlive: true,
            }),
            paramsSerializer: queryParamObjToStr,
            transformRequest: [CasebookService._addHmacToQueryParam],
        });

        casebookRequestBase.interceptors.response.use(
            (response) => {
                if (response.status !== 200) {
                    throw new Error(`Casebook returned ${response.statusCode}`);
                }
                return response;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        return casebookRequestBase;
    },

    _addHashToHeader(paramsObj) {
        const queryStr = queryParamObjToStr(paramsObj);
        const hash = crypto
            .createHmac('sha512', hmacKey)
            .update(Buffer.from(queryStr, 'utf-8'))
            .digest('hex')
            .toUpperCase();

        return hash;
    },

    _addHmacToQueryParam(data, _headers) {
        data = {
            hmac: hmacKey,
        };
        return JSON.stringify(data);
    },
};

module.exports = CasebookService;
