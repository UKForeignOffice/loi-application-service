const sails = require('sails');
const request = require('request-promise');
const crypto = require('crypto');
const fs = require('fs');

const FileDownloadController = {
    async downloadFileHandler(req, res) {
        const streamOfFile =
            await FileDownloadController._getStreamOfFileFromCasebook(req, res);
        FileDownloadController._downloadStream(streamOfFile);
    },

    _getStreamOfFileFromCasebook(req, res) {
        const {
            hmacKey,
            customURLs,
            casebookCertificate: cert,
            casebookKey: key,
        } = req._sails.config;
        const queryParamsObj = {
            timestamp: new Date().getTime().toString(),
            apostilleReferenece: req.params.apostilleRef,
        };
        const queryParams = new URLSearchParams(queryParamsObj);
        const queryStr = queryParams.toString();
        const hash = crypto
            .createHmac('sha512', hmacKey)
            .update(Buffer.from(queryStr, 'utf-8'))
            .digest('hex')
            .toUpperCase();

        const options = {
            uri: customURLs.apostilleDownloadAPIURL,
            agentOptions: {
                cert,
                key,
            },
            method: 'GET',
            headers: {
                hash,
                'Content-Type': 'application/json; charset=utf-8',
            },
            json: true,
            qs: queryParamsObj,
        };

        return request(options)
            .then((response) => {
                const isErrorResponse =
                    typeof response === 'object' &&
                    response.hasOwnProperty('errors');
                if (isErrorResponse) {
                    sails.log.error(response.message);
                    return res.serverError();
                }
                return {
                    fileName: response.headers['content-disposition'],
                    fileBuffer: response,
                };
            })
            .catch((err) => {
                sails.log.error(err);
                res.serverError();
            });
    },

    _downloadStream(streamOfFile) {
        const { fileName, fileBuffer } = streamOfFile;
        sails.log.info(`File downloaded: ${fileName}`);
        fs.writeFileSync(fileName, fileBuffer);
    },
};
