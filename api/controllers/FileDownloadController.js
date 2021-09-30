const sails = require('sails');
const request = require('request');
const crypto = require('crypto');

const FileDownloadController = {
    downloadFileHandler(req, res) {
        try {
            const apiOptions = FileDownloadController._prepareAPIOptions(req);
            FileDownloadController._streamFileToClient(apiOptions, res);
        } catch (err) {
            sails.log.error(err);
            return res.serverError();
        }
    },

    _prepareAPIOptions(req) {
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
            timestamp: Date.now().toString(),
            apostilleReference: req.params.apostilleRef,
        };
        const queryParams = new URLSearchParams(queryParamsObj);
        const queryStr = queryParams.toString();
        const hash = crypto
            .createHmac('sha512', hmacKey)
            .update(Buffer.from(queryStr, 'utf-8'))
            .digest('hex')
            .toUpperCase();

        return {
            uri: customURLs.apostilleDownloadAPIURL,
            agentOptions: {
                cert,
                key,
            },
            headers: {
                hash,
            },
            qs: queryParamsObj,
        };
    },

    _streamFileToClient(options, res) {
        sails.log.info('Downloading file from Casebook');
        request
            .get(options)
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