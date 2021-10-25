const crypto = require('crypto');
const apiQueryString = require('querystring');
/**
 *
 * @param {{
 *   url: string,
 *   req: Request,
 *   apiOptions: Object,
 *   useApiQueryString: boolean,
 *   refParam: string,
 * }} kwargs
 */
function prepareAPIOptions(kwargs) {
    const { url, req, apiOptions, useApiQueryString, refParam } = kwargs;
    const {
        hmacKey,
        casebookCertificate: cert,
        casebookKey: key,
    } = req._sails.config;
    const queryParamsObj = {
        timestamp: Date.now().toString(),
        ...refParam,
    };
    let queryStr;

    if (useApiQueryString) {
        queryStr = apiQueryString.stringify(queryParamsObj);
    } else {
        const queryParams = new URLSearchParams(queryParamsObj);
        queryStr = queryParams.toString();
    }

    const hash = crypto
        .createHmac('sha512', hmacKey)
        .update(Buffer.from(queryStr, 'utf-8'))
        .digest('hex')
        .toUpperCase();

    return {
        uri: url,
        agentOptions: {
            cert,
            key,
        },
        headers: {
            hash,
        },
        qs: queryParamsObj,
        ...apiOptions,
    };
}

module.exports = prepareAPIOptions;
