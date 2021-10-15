const sails = require('sails');
const request = require('request');
const requestPromise = require('request-promise');
const crypto = require('crypto');

const FileDownloadController = {
    async downloadFileHandler(req, res) {
        try {
            const apostilleRefBelongstoApp =
                await FileDownloadController._apostilleRefBelongToApplication(
                    req,
                    res
                );
            if (!apostilleRefBelongstoApp) {
                sails.log.error(
                    'Apostille ref does not belong to this application'
                );
                return res.serverError();
            }

            await FileDownloadController._checkSessionUserIdMatchesApp(req, res);
            FileDownloadController._streamFileToClient(req, res);

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

    _apostilleRefBelongToApplication(req, res) {
        const appInfoApiOptions = FileDownloadController._prepareAPIOptions({
            json: true,
            reference: { applicationReference: req.params.unique_app_id },
            req,
            res,
            runErrorChecks: true,
            uri: req._sails.config.customURLs.applicationStatusAPIURL,
        });

        return requestPromise
            .get(appInfoApiOptions)
            .then((response) => {
                const appInfo = response[0];
                if (appInfo) {
                    const apostilleRefs = appInfo.documents.map(
                        (document) => document.apostilleReference
                    );

                    for (let apostilleRef of apostilleRefs) {
                        if (apostilleRef === req.params.apostilleRef) {
                            sails.log.info(
                                'Apostille ref belongs to this application'
                            );
                            return true;
                        }
                    }
                }

                return false;
            })
            .catch((err) => {
                sails.log.error(err);
                res.serverError();
            });
    },

    async _checkSessionUserIdMatchesApp(req, res) {
        const applicationTableData = await Application.find({
            where: { unique_app_id: req.params.unique_app_id },
        });

        if (applicationTableData.user_id !== req.session.user.id) {
            sails.log.error('User is not authorised to download this document');
            res.serverError();
        }
    },

    _streamFileToClient(req, res) {
        let responseStatus;
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
                responseStatus = response.statusCode;
                if (responseStatus !== 200) {
                    sails.log.error(`Casebook returned ${response.statusCode}`);
                }
            })
            .pipe(res)
            .on('finish', () => {
                const msg =
                    responseStatus === 200 ? 'successfully' : 'unsuccessfully';
                sails.log.info(`File ${msg} downloaded`);
            });
    },
};

module.exports = FileDownloadController;
