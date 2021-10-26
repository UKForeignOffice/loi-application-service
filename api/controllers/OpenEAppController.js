const sails = require('sails');
const request = require('request-promise');
const crypto = require('crypto');
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
            const applicationTableData = await Application.find({
                where: { unique_app_id: req.params.unique_app_id },
            });

            if (applicationTableData.user_id !== req.session.user.id) {
                sails.log.error('User not authorised to view this application');
                return res.forbidden('Unauthorised');
            }

            const casebookResponse =
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

            res.view('eApostilles/openEApp.ejs', {
                ...pageData,
                userRef,
                user_data: userData,
                daysLeftToDownload,
                applicationExpired,
                applicationStatus: casebookResponse[0].status,
            });
        } catch (error) {
            sails.log.error(error);
            return res.serverError();
        }
    },

    _getApplicationDataFromCasebook(req, res) {
        const { hmacKey, customURLs, casebookCertificate, casebookKey } =
            req._sails.config;
        const queryParamsObj = {
            timestamp: new Date().getTime().toString(),
            applicationReference: req.params.unique_app_id,
        };
        const queryParams = new URLSearchParams(queryParamsObj);
        const queryStr = queryParams.toString();
        const hash = crypto
            .createHmac('sha512', hmacKey)
            .update(Buffer.from(queryStr, 'utf-8'))
            .digest('hex')
            .toUpperCase();
        const options = {
            uri: customURLs.applicationStatusAPIURL,
            agentOptions: {
                cert: casebookCertificate,
                key: casebookKey,
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
                return response;
            })
            .catch((err) => {
                sails.log.error(err);
                res.serverError();
            });
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
                casebookResponse.payment.netAmount
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
            days: req._sails.config.upload.max_days_to_download,
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

        if (daysLeftToDownload <= 0) {
            expired = true;
        }

        return expired;
    },
};

module.exports = OpenEAppController;
