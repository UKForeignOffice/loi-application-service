const sails = require('sails');
const stream = require('stream');
const util = require('util');
const CasebookService = require('../services/CasebookService');
const ExportedEAppData = require('../models/index').ExportedEAppData;
const Application = require('../models/index').Application;
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const HelperService = require("../services/HelperService");
dayjs.extend(duration);

const OpenEAppController = {
    async renderPage(req, res) {
        const userData = HelperService.getUserData(req, res);
        if (!userData.loggedIn) {
            sails.log.error('Users not logged in - redirect to sign in page');
            return res.redirect(`${req._sails.config.customURLs.userServiceURL}/sign-in?eappid=${req.params.unique_app_id}`);
        }

        try {
            if (req.params.unique_app_id === 'undefined') {
                throw new Error('renderPage: Missing application reference');
            }

            const applicationTableData = await Application.findOne({
                where: { unique_app_id: req.params.unique_app_id },
            });

            if (applicationTableData.user_id !== req.session.user.id) {
                sails.log.error('User not authorised to view this application');
                return res.forbidden('Unauthorised');
            }

            const { data: casebookResponse } =
                await OpenEAppController._getApplicationDataFromCasebook(
                    req,
                    res
                );
            const [casebookData] = casebookResponse;
            const casebookStatus = casebookData.status || 'Not available';
            const casebookDocuments = casebookData.documents || [];

            const pageData = OpenEAppController._formatDataForPage(
                applicationTableData,
                casebookData
            );
            const userRef = await OpenEAppController._getUserRef(
                casebookData,
                res
            );
            const daysLeftToDownload =
                casebookData.status === 'Completed'
                    ? OpenEAppController._calculateDaysLeftToDownload(
                          casebookData,
                          req
                      )
                    : 0;
            const applicationExpired =
                OpenEAppController._hasApplicationExpired(
                    casebookData,
                    daysLeftToDownload
                );

            const noOfRejectedDocs =
                OpenEAppController._calculateRejectedDocs(casebookData);

            res.view('eApostilles/openEApp.ejs', {
                ...pageData,
                userRef,
                user_data: userData,
                daysLeftToDownload,
                applicationExpired,
                applicationStatus: casebookStatus,
                allDocumentsRejected:
                    noOfRejectedDocs === casebookDocuments.length,
                someDocumentsRejected: noOfRejectedDocs > 0,
            });
        } catch (error) {
            sails.log.error(error);
            return res.view('eApostilles/viewEAppError.ejs', {
                user_data: userData,
                applicationId: req.params.unique_app_id,
            });
        }
    },

    async _getApplicationDataFromCasebook(req, res) {
        const applicationReference = req.params.unique_app_id;

        try {
            return await CasebookService.getApplicationStatus(
                applicationReference
            );
        } catch (error) {
            sails.log.error(error);
            return res.view('eApostilles/viewEAppError.ejs', {
                user_data: HelperService.getUserData(req, res),
                applicationId: applicationReference,
            });
        }
    },

    _formatDataForPage(applicationTableData, casebookResponse) {
        if (!casebookResponse) {
            throw new Error('No data received from Casebook');
        }
        if (!casebookResponse.documents) {
            throw new Error('No documents found from Casebook');
        }
        if (!casebookResponse.payment) {
            throw new Error('No payment info found from Casebook');
        }
        if (
            !casebookResponse.payment.transactions ||
            casebookResponse.payment.transactions.length === 0
            ) {
            throw new Error('No payment transactions found from Casebook');
        }

        return {
            applicationId: applicationTableData.unique_app_id,
            dateSubmitted: OpenEAppController._formatDate(
                applicationTableData.createdAt
            ),
            dateCompleted: OpenEAppController._formatDate(casebookResponse.completedDate),
            documents: casebookResponse.documents,
            originalCost: HelperService.formatToUKCurrency(
                casebookResponse.payment.transactions[0].amount || 0
            ),
            paymentRef: casebookResponse.payment.transactions[0].reference || '',
        };
    },

    _getUserRef(casebookResponse, res) {
        if (!casebookResponse.applicationReference) {
            throw new Error('No application reference from Casebook');
        }

        return ExportedEAppData.findOne({
            where: {
                unique_app_id: casebookResponse.applicationReference,
            },
        })
            .then((data) => {
                return data.dataValues.user_ref;
            })
            .catch((err) => {
                sails.log.error(err);
                return res.serverError();
            });
    },

    _formatDate(date) {
        return dayjs(date).format('DD MMMM YYYY');
    },

    _calculateDaysLeftToDownload(applicationData, req) {
        if (!applicationData.completedDate) {
            throw new Error('No date value found');
        }

        const todaysDate = dayjs(Date.now());
        const timeSinceCompletedDate = todaysDate.diff(
            applicationData.completedDate
        );
        const maxDaysToDownload = dayjs.duration({
            days: Number(req._sails.config.upload.max_days_to_download),
        });
        const timeDifference = dayjs.duration(timeSinceCompletedDate);
        return maxDaysToDownload.subtract(timeDifference).days();
    },

    _hasApplicationExpired(casebookResponse, daysLeftToDownload) {
        if (
            !casebookResponse.documents ||
            casebookResponse.documents.length === 0
        ) {
            throw new Error('No documents found');
        }
        const { documents } = casebookResponse;
        let expired = false;

        for (let document of documents) {
            const documentDownloadExpired = document.downloadExpired || false;
            if (documentDownloadExpired) {
                expired = true;
                break;
            }
        }

        if (daysLeftToDownload < 0) {
            expired = true;
        }

        return expired;
    },

    async downloadReceipt(req, res) {
        try {
            await OpenEAppController._streamReceiptToClient(req, res);
        } catch (err) {
            sails.log.error(err);
            return res.serverError();
        }
    },

    async _streamReceiptToClient(req, res) {
        try {
            await OpenEAppController._errorChecks(req, res);
            sails.log.info('Downloading receipt from Casebook');

            const response = await CasebookService.getApplicationReceipt(
                req.params.applicationRef
            );
            response.data.pipe(res);

            const streamFinished = util.promisify(stream.finished);
            return streamFinished(res);
        } catch (err) {
            throw new Error(`downloadReceipt Error: ${err}`);
        }
    },

    async _errorChecks(req, res) {
        const userData = HelperService.getUserData(req, res);
        const applicationTableData = await Application.findOne({
            where: { unique_app_id: req.params.applicationRef },
        });

        if (!userData.loggedIn) {
            throw new Error('User is not logged in');
        }

        if (req.params.applicationRef === 'undefined') {
            throw new Error('downloadReceipt: Missing application reference');
        }

        if (applicationTableData.user_id !== req.session.user.id) {
            throw new Error('User not authorised to download this receipt');
        }
    },

    _calculateRejectedDocs(casebookResponse) {
        let rejectedDocs = 0;
        if (!casebookResponse.documents) {
            throw new Error('No documents found from Casebook');
        }
        for (const document of casebookResponse.documents) {
            const documentStatus = document.status || '';

            if (documentStatus === 'Rejected') {
                rejectedDocs++;
            }
        }
        return rejectedDocs;
    },
};

module.exports = OpenEAppController;
