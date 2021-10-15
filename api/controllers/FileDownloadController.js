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
                sails.log.error(
                    'User is not authorised to download this document'
                );
                return res.forbidden('Unauthorised');
            }

            if (
                !FileDownloadController._doesApostilleRefBelongToApplication(req, res)
            ) {
                sails.log.error(
                    'Apostille ref does not belong to this application'
                );
                return res.forbidden('Unauthorised');
            } else {
                FileDownloadController._streamFileToClient(req, res);
            }
        } catch (err) {
            sails.log.error(err);
            return res.serverError();
        }
    },

    _prepareAPIOptions(kwargs) {
        const { runErrorChecks, uri, reference, json, req, res } = kwargs;

        if (runErrorChecks) {
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
        }

        const {
            hmacKey,
            casebookCertificate: cert,
            casebookKey: key,
        } = req._sails.config;
        const queryParamsObj = {
            timestamp: Date.now().toString(),
            ...reference,
        };
        const queryParams = new URLSearchParams(queryParamsObj);
        const queryStr = queryParams.toString();
        const hash = crypto
            .createHmac('sha512', hmacKey)
            .update(Buffer.from(queryStr, 'utf-8'))
            .digest('hex')
            .toUpperCase();

        return {
            uri,
            agentOptions: {
                cert,
                key,
            },
            headers: {
                hash,
            },
            json,
            qs: queryParamsObj,
        };
    },

    _doesApostilleRefBelongToApplication(req, res) {
        const appInfoApiOptions = FileDownloadController._prepareAPIOptions({
            json: true,
            reference: { applicationReference: req.params.unique_app_id },
            req,
            res,
            runErrorChecks: true,
            uri: req._sails.config.customURLs.applicationStatusAPIURL,
        });

        return request.get(
            appInfoApiOptions,
            (error, response, body) => {
                if (error) {
                    sails.log.error(error);
                    return false;
                }

                if (response.statusCode !== 200) {
                    sails.log.error(
                        `Application status API returned ${response.statusCode}`
                    );
                    return false;
                }

                const appInfo = body[0];
                if (appInfo) {
                    const apostilleRefs = appInfo.documents.map(
                        (document) => document.apostilleReference
                    );

                    for (let apostilleRef of apostilleRefs) {
                        if (apostilleRef === req.params.apostilleRef) {
                            sails.log.info('Apostille ref belongs to this application');
                            return true;
                        }
                    }
                }

                return false;
            }
        );

    },

    _streamFileToClient(req, res) {
        const downloadFileApiOptions =
            FileDownloadController._prepareAPIOptions({
                json: false,
                reference: { apostilleReference: req.params.apostilleRef },
                req,
                res,
                runErrorChecks: false,
                uri: req._sails.config.customURLs.apostilleDownloadAPIURL,
            });
        sails.log.info('Downloading file from Casebook');
        request
            .get(downloadFileApiOptions)
            .on('error', (err) => {
                throw new Error(err);
            })
            .on('response', (response) => {
                if (response.statusCode !== 200) {
                    throw new Error(
                        `Casebook returned ${response.statusCode}`)
                }
            })
            .pipe(res)
            .on('finish', () => {
                sails.log.info('File successfully downloaded');
            });
    },
};

module.exports = FileDownloadController;
