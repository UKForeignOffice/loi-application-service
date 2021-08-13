const request = require('request-promise');
const crypto = require('crypto');
const moment = require('moment');

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

            res.view('eApostilles/openEApp.ejs', {
                ...pageData,
                user_data: userData,
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
                if (response.length === 0) {
                    return OpenEAppController._dummyData();
                } else {
                    return response;
                }
            })
            .catch((err) => {
                sails.log.error(err);
                res.serverError();
            });
    },

    _formatDataForPage(applicationTableData, casebookResponse) {
        return {
            applicationId: applicationTableData.unique_app_id,
            dateSubmitted: OpenEAppController._formatDate(applicationTableData.createdAt),
            documents: casebookResponse.documents,
            originalCost: OpenEAppController._formatToUKCurrency(casebookResponse.payment.netAmount),
            paymentRef: casebookResponse.payment.transactions[0].reference,
        };
    },

    _formatDate(date) {
        return moment(date).format('DD MMMM YYYY')
    },

    _formatToUKCurrency(number) {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(number);
    },

    // TODO: delete when Casebook works
    _dummyData() {
        return [
            {
                applicationReference: 'A-D-21-0809-2034-C968',
                status: 'In progress',
                payment: {
                    netAmount: 30.0,
                    transactions: [
                        {
                            amount: 30.0,
                            method: 'Credit/Debit Card',
                            reference: '8516285240123586',
                            transactionAmount: 30.0,
                            transactionDate: '',
                            type: 'Initial Incoming',
                        },
                    ],
                },
                documents: [
                    {
                        name: 'client_document_1.pdf',
                        status: 'Submitted',
                        apostilleReference: '',
                    },
                ],
            },
        ];
    },
};

module.exports = OpenEAppController;
