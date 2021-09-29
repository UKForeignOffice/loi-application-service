const sails = require('sails');
const request = require('request');
const crypto = require('crypto');

const FileDownloadController = {
    downloadFileHandler(req, res) {
        try {
            FileDownloadController._getStreamOfFileFromCasebook(req, res);
        } catch (err) {
            sails.log.error(err);
            res.serverError();
        }
    },

    _getStreamOfFileFromCasebook(req, res) {
        if (req.params.apostilleRef === 'undefined') {
            throw new Error('Missing apostille reference');
        }

        const {
            hmacKey,
            customURLs,
            casebookCertificate: cert,
            casebookKey: key,
        } = req._sails.config;
        const queryParamsObj = {
            timestamp: new Date().getTime().toString(),
            apostilleReference: req.params.apostilleRef,
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
            },
            qs: queryParamsObj,
        };

        sails.log.info('Downloading file from Casebook');

        request(options)
            .on('error', (err) => {
                throw new Error(err);
            })
            .pipe(res)
            .on('finish', () => {
                sails.log.info('File successfully downloaded');
            });
    },
};

module.exports = FileDownloadController;
