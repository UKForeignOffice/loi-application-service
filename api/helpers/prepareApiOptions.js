const crypto = require('crypto');
const apiQueryString = require('querystring');
/**
 *
 * @param {{
 *   req: Request,
 *   useApiQueryString: boolean,
 *   refParam: string,
 * }} prepareRequest
 */
function prepareAPIOptions(prepareRequest) {
    const { req, useApiQueryString = false, refParam } = prepareRequest;
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
        agentOptions: {
            cert,
            key,
        },
        headers: {
            hash,
        },
        qs: queryParamsObj,
    };
}

module.exports = prepareAPIOptions;
