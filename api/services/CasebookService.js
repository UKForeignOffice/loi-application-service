const crypto = require('crypto');
const axios = require('axios');
const https = require('https');

const config = require('../../config/environment-variables');
const {
    hmacKey,
    casebookCertificate: cert,
    casebookKey: key,
    customURLs,
} = config;

const CasebookService = {
    getApplicationStatus(paramsObj) {
        const casebookRequestBase =
            CasebookService._createBaseRequest(paramsObj);

        return casebookRequestBase.get(customURLs.applicationStatusAPIURL, {
            params: paramsObj,
        });
    },

    getApostilleDownload(paramsObj) {
        const casebookRequestBase =
            CasebookService._createBaseRequest(paramsObj);

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
            paramsSerializer: CasebookService._queryParamObjToStr,
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
        const queryStr = CasebookService._queryParamObjToStr(paramsObj);
        const hash = crypto
            .createHmac('sha512', hmacKey)
            .update(Buffer.from(queryStr, 'utf-8'))
            .digest('hex')
            .toUpperCase();

        return hash;
    },

    _queryParamObjToStr(queryParamsObj) {
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
    },

    _addHmacToQueryParam(data, _headers) {
        data = {
            hmac: hmacKey,
        };
        return JSON.stringify(data);
    },
};

module.exports = CasebookService;
