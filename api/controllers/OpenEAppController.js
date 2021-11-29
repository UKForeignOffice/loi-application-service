const sails = require('sails');
const stream = require('stream');
const util = require('util');
const CasebookService = require('../services/CasebookService');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

const OpenEAppController = {
    async renderPage(req, res) {
        const userData = HelperService.getUserData(req, res);
        if (!userData.loggedIn) {
            sails.log.error('Users not logged in');
            return res.serverError();
        }

        try {
            if (req.params.unique_app_id === 'undefined') {
                throw new Error('renderPage: Missing application reference');
            }

            const applicationTableData = await Application.find({
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
            const pageData = OpenEAppController._formatDataForPage(
                applicationTableData,
                casebookResponse[0]
            );
            const userRef = await OpenEAppController._getUserRef(
                casebookResponse[0],
                res
            );
            const daysLeftToDownload =
                casebookResponse[0].status === 'Completed'
                    ? OpenEAppController._calculateDaysLeftToDownload(
                          casebookResponse[0],
                          req
                      )
                    : 0;
            const applicationExpired =
                OpenEAppController._hasApplicationExpired(
                    casebookResponse[0],
                    daysLeftToDownload
                );

            const noOfRejectedDocs = OpenEAppController._calculateRejectedDocs(
                casebookResponse[0]
            );

            res.view('eApostilles/openEApp.ejs', {
                ...pageData,
                userRef,
                user_data: userData,
                daysLeftToDownload,
                applicationExpired,
                applicationStatus: casebookResponse[0].status,
                allDocumentsRejected:
                    noOfRejectedDocs == casebookResponse[0].documents.length,
            });
        } catch (error) {
            sails.log.error(error);
            return res.serverError();
        }
    },

    async _getApplicationDataFromCasebook(req, res) {
        try {
            const applicationReference = req.params.unique_app_id;
            return await CasebookService.getApplicationStatus(
                applicationReference
            );
        } catch (error) {
            sails.log.error(error);
            return res.serverError();
        }
    },

    _formatDataForPage(applicationTableData, casebookResponse) {
        if (!casebookResponse) {
            throw new Error('No data received from Casebook');
        }
        return {
            applicationId: applicationTableData.unique_app_id,
            dateSubmitted: OpenEAppController._formatDate(
                applicationTableData.createdAt
            ),
            documents: casebookResponse.documents,
            originalCost: HelperService.formatToUKCurrency(
                casebookResponse.payment.transactions[0].amount
            ),
            paymentRef: casebookResponse.payment.transactions[0].reference,
        };
    },

    _getUserRef(casebookResponse, res) {
        return ExportedEAppData.find({
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
            if (document.downloadExpired) {
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
        const applicationTableData = await Application.find({
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
        for (const document of casebookResponse.documents) {
            if (document.status === 'Rejected') {
                rejectedDocs++;
            }
        }
        return rejectedDocs;
    },
};

module.exports = OpenEAppController;
