const request = require('request');
const apiQueryString = require('querystring');

const OpenEAppController = {
    renderPage(req, res) {
        const userData = HelperService.getUserData(req, res);

        Application.find({
            where: { unique_app_id: req.params.unique_app_id },
        }).then((appResults) => {
            res.view('eApostilles/viewEApp.ejs', {
                results: appResults,
                user_data: userData,
            });
        });
    },

    _getApplicationDataFromCasebook(req) {
        const leg_app_stat_struc = {
            timestamp: new Date().getTime().toString(),
            applicationReference: req.params.unique_app_id,
        };
        const queryStr = apiQueryString.stringify(leg_app_stat_struc);
        const hash = crypto
            .createHmac('sha512', req._sails.config.hmacKey)
            .update(Buffer.from(queryStr, 'utf-8'))
            .digest('hex')
            .toUpperCase();

        request(
            {
                url: req._sails.config.customURLs.applicationStatusAPIURL,
                agentOptions: {
                    cert: req._sails.config.casebookCertificate,
                    key: req._sails.config.casebookKey,
                },
                method: 'GET',
                headers: {
                    hash,
                    'Content-Type': 'application/json; charset=utf-8',
                },
                json: true,
                useQuerystring: true,
                qs: leg_app_stat_struc,
            },
            (error, response) => {
                if (error) {
                    sails.log.error(error);
                    res.status(500).send(error);
                }
            }
        );
    },
};
module.exports = OpenEAppController;
