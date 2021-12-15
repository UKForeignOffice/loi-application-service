const axios = require('axios');
const sails = require('sails');
const stream = require('stream');
const util = require('util');
const CasebookService = require('../services/CasebookService');

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

            await FileDownloadController._checkSessionUserIdMatchesApp(
                req,
                res
            );
            await FileDownloadController._streamFileToClient(req, res);
        } catch (err) {
            sails.log.error(err);
            return res.serverError();
        }
    },

    _urlErrorChecks(req, res) {
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
    },

    _apostilleRefBelongToApplication(req, res) {
        FileDownloadController._urlErrorChecks(req, res);
        const applicationRef = req.params.unique_app_id;

        return CasebookService.getApplicationStatus(applicationRef)
            .then((response) => {
                const appInfo = response.data[0];
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

    async _streamFileToClient(req, res) {
        try {
            const apostilleReference = req.params.apostilleRef;

            sails.log.info(`Downloading file from Casebook, apostille Ref: ${apostilleReference}`);

            const response = await CasebookService.getApostilleDownload(
                apostilleReference
            );
            response.data.pipe(res);

            const streamFinished = util.promisify(stream.finished);
            return streamFinished(res);
        } catch (err) {
            throw new Error(`_streamFileToClient Error: ${err}`);
        }
    },

    async testDownload(_req, _res) {
        try {
            const response = await axios.get('https://ec3a-212-59-65-160.ngrok.io/api/user/test-download');
            sails.log.info(response.data, 'Guess this worked');
        } catch (err) {
            sails.log.error(err);
        }
    }
};

module.exports = FileDownloadController;
