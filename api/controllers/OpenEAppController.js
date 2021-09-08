const sails = require('sails');
const request = require('request-promise');
const crypto = require('crypto');
const dayjs = require('dayjs');

const MAX_DAYS_TO_LEGALISE = 21;

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
            const casebookResponse =
                await OpenEAppController._getApplicationDataFromCasebook(
                    req,
                    res
                );
            const pageData = OpenEAppController._formatDataForPage(
                applicationTableData,
                casebookResponse[0]
            );
            const daysLeftToDownload =
                OpenEAppController._calculateDaysLeftToDownload(req);

            res.view('eApostilles/openEApp.ejs', {
                ...pageData,
                user_data: userData,
                daysLeftToDownload,
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

    _formatDate(date) {
        return dayjs(date).format('DD MMMM YYYY');
    },

    _calculateDaysLeftToDownload(req) {
        const urlObj = new URL(
            `${req.protocol}://${req.headers.host}${req.originalUrl}`
        );
        const queryParams = new URLSearchParams(urlObj.search);
        if (!queryParams.has('completedDate')) {
            throw new Error('No date value found in url');
        }
        const completedDate = queryParams.get('completedDate');
        const currentDate = dayjs();
        const differenceBetweenCurrentAndCompletedDate =
            currentDate.diff(completedDate);
        const formattedDifference = dayjs(
            differenceBetweenCurrentAndCompletedDate
        ).format('DD');
        const daysLeftToDownloadDoc =
            MAX_DAYS_TO_LEGALISE - Number(formattedDifference);
        const isNumberNegative = Math.sign(daysLeftToDownloadDoc) === -1;

        if (isNumberNegative) {
            throw new Error('Application has expired');
        }
        return daysLeftToDownloadDoc;
    },
};

module.exports = OpenEAppController;
