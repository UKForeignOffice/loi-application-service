const sails = require('sails');
const request = require('request');
const crypto = require('crypto');

const FileDownloadController = {
    async downloadFileHandler(req, res) {
        try {
            const applicationTableData = await Application.find({
                where: { unique_app_id: req.params.unique_app_id },
            });

            if (applicationTableData.user_id !== req.session.user.id) {
                return res.forbidden('Unauthorised');
            }

            const apiOptions = FileDownloadController._prepareAPIOptions(req, res);
            FileDownloadController._streamFileToClient(apiOptions, res);
        } catch (err) {
            sails.log.error(err);
            return res.serverError();
        }
    },

    _prepareAPIOptions(req, res) {
        if (req.params.apostilleRef === 'undefined') {
            throw new Error('Missing apostille reference');
        }

        const userData = HelperService.getUserData(req, res);
        if (!userData.loggedIn) {
            throw new Error('User is not logged in');
        }

        if (!req.params.unique_app_id) {
            throw new Error('Application ID not found');
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
