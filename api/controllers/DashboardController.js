/**
 * DashboardController module.
 * @module Controller DashboardController
 */
const sails = require('sails');
const request = require('request');
const crypto = require('crypto');
const moment = require('moment');
const apiQueryString = require('querystring');

var summaryController = require('./SummaryController');

var dashboardController = {
    /**
     * Move all relevent Application data provided by the user into the Exports table.
     * This table can then be exported as a JSON object directly to the Submission API.
     * This will also keep a history of applications made.
     * @param req
     * @param res
     *
     */
    dashboard(req, res) {
        const userNotLoggedIn = !(
            req.session.passport && req.session.passport.user
        );
        if (userNotLoggedIn) {
            return res.redirect(
                req._sails.config.customURLs.userServiceURL + '/sign-in'
            );
        }
        Application.count({
            where: { user_id: req.session.passport.user },
        }).then((totalApplications) => {
            HelperService.refreshUserData(req, res).then(() => {
                const userData = HelperService.getUserData(req, res);
                if (!userData) {
                    sails.log.error('No user information found');
                    return res.serverError();
                }
                var pageSize = 20;
                var currentPage = req.query.page || 1;
                var offset = pageSize * (currentPage - 1);
                var sortOrder = req.query.sortOrder || -1;
                var direction = Math.sign(sortOrder) === 1 ? 'asc' : 'desc';
                var searchCriteria =
                    req.allParams().dashboardFilter ||
                    req.query.searchText ||
                    '';
                //If user has specifically selected to filter by date (sortOrder eq 1 or -1)
                //then we don't want to secondary sort by date again! But if a user filters by
                //reference number for example, then secondary sort on the date as well.
                var secondarySortOrder =
                    sortOrder === 1 || sortOrder === -1 ? null : '1';
                var secondaryDirection =
                    sortOrder === 1 || sortOrder === -1 ? null : 'desc';
                const storedProcedureArgs = {
                    replacements: {
                        userId: req.session.passport.user,
                        pageSize,
                        offset,
                        sortOrder: Math.abs(sortOrder).toString(),
                        direction,
                        queryString: '%' + searchCriteria + '%',
                        secondarySortOrder,
                        secondaryDirection,
                    },
                    type: sequelize.QueryTypes.SELECT,
                };
                const displayAppsArgs = {
                    userData,
                    totalApplications,
                    offset,
                    sortOrder,
                    currentPage,
                    searchCriteria,
                    pageSize,
                    req,
                    res,
                };

                dashboardController._getApplications(
                    storedProcedureArgs,
                    displayAppsArgs,
                    userData.user.electronicEnabled
                );
            });
        });
    },

    _getApplications(storedProcedureArgs, displayAppsArgs, electronicEnabled) {
        const { res } = displayAppsArgs;
        const applicationType = electronicEnabled
            ? 'electronic and paper'
            : 'paper';
        const queryApplications = dashboardController._chooseStoredProcedure(
            storedProcedureArgs.secondarySortOrder,
            electronicEnabled
        );

        sails.log.info(`Fetching ${applicationType} applications`);
        sequelize
            .query(queryApplications, storedProcedureArgs)
            .then((electronitApplications) => {
                dashboardController._displayApplications(
                    electronitApplications,
                    displayAppsArgs
                );
            })
            .catch((error) => {
                sails.log.error(error);
                return res.serverError();
            });
    },

    _chooseStoredProcedure(secondarySortOrder, electronicEnabled = false) {
        const procedureToUse = electronicEnabled
            ? 'dashboard_data_eapp'
            : 'dashboard_data';

        return secondarySortOrder === null
            ? `SELECT * FROM ${procedureToUse}(:userId, :pageSize, :offset, :sortOrder, :direction, :queryString)`
            : `SELECT * FROM ${procedureToUse}(:userId, :pageSize, :offset, :sortOrder, :direction, :queryString, :secondarySortOrder, :secondaryDirection)`;
    },

    _displayApplications(results, displayAppsArgs) {
        const {
            userData,
            totalApplications,
            offset,
            sortOrder,
            currentPage,
            searchCriteria,
            pageSize,
            req,
            res,
        } = displayAppsArgs;
        //redirect to 404 if user has manually set a page in the query string
        var resultCount = 0;
        let message;
        if (results.length === 0) {
            if (currentPage != 1) {
                return res.view('404.ejs');
            } else {
                message = 'No results found.';
            }
        } else {
            resultCount = results.length;
        }

        async.parallel(
            [
                // Make call to Casebook Status API for the application references in the results collection.

                function (callback) {

                    // Create status retrieval request object.

                    // First build array of application references to be passed to the Casebook Status API for this page. Can submit up to 20 at a time.
                    const applicationReferences = results.map(
                        (resultItem) => resultItem.unique_app_id
                    );

                    // Create Request Structure

                    var leg_app_stat_struc = {
                        timestamp: new Date().getTime().toString(),
                        applicationReference: applicationReferences,
                    };

                    var queryStr = apiQueryString.stringify(leg_app_stat_struc);

                    var certPath;
                    try {
                        certPath = req._sails.config.casebookCertificate;
                    } catch (err) {
                        sails.log.error('Null certificate path: [%s] ', err);
                        certPath = null;
                    }

                    var keyPath;
                    try {
                        keyPath = req._sails.config.casebookKey;
                    } catch (err) {
                        sails.log.error('Null key path: [%s] ', err);
                        keyPath = null;
                    }

                    // calculate HMAC string and encode in base64

                    var hash = crypto
                        .createHmac('sha512', req._sails.config.hmacKey)
                        .update(Buffer.from(queryStr, 'utf-8'))
                        .digest('hex')
                        .toUpperCase();

                    request(
                        {
                            url: req._sails.config.customURLs
                                .applicationStatusAPIURL,
                            agentOptions: {
                                cert: certPath,
                                key: keyPath,
                            },
                            method: 'GET',
                            headers: {
                                hash,
                                'Content-Type':
                                    'application/json; charset=utf-8',
                            },
                            json: true,
                            useQuerystring: true,
                            qs: leg_app_stat_struc,
                        },
                        function (error, response, body) {
                            if (error) {
                                sails.log.error(
                                    'Error returned from Casebook API call: ',
                                    error
                                );
                                callback(true);
                                return;
                            } else if (response.statusCode == 200) {
                                callback(false, body);
                            } else {
                                sails.log.error(
                                    'Invalid response from Casebook Status API call: ',
                                    response.statusCode
                                );
                                callback(true);
                                return;
                            }
                        }
                    );
                },
            ],

            // Collate results

            function (err, api_results) {
                if (results.length === 0) {
                    if (currentPage != 1) {
                        return res.view('404.ejs');
                    } else {
                        message = 'No results found.';
                    }
                } else {
                    resultCount = results.length;

                    // Add Casebook status to results array.
                    //Add tracking reference to results array
                    // Only update if there are matching values

                    if (err) {
                        sails.log.error(
                            'Casebook Status Retrieval API error: ',
                            err
                        );
                        return res.serverError();
                    } else if (api_results[0].length === 0) {
                        sails.log.error('No Casebook Statuses available');
                        return res.serverError();
                    }
                    // Build the application reference status obj. This contains the application reference and it's status
                    // as a key/value pair.

                    var appRef = {};
                    var trackRef = {};

                    for (let result of api_results[0]) {
                        appRef[result.applicationReference] = result.status;
                        trackRef[result.applicationReference] =
                            result.trackingReference;
                    }

                    // For each element in the database results array, add the application reference status
                    // if one exists.

                    for (let result of results) {
                        const appStatus = appRef[result.unique_app_id];
                        result.app_status =
                            dashboardController._userFriendlyStatuses(
                                appStatus,
                                result.applicationtype
                            );
                        result.tracking_ref =
                            trackRef[result.unique_app_id];
                    }

                }

                var pageUpperLimit = offset + pageSize;
                if (pageUpperLimit > resultCount) {
                    pageUpperLimit = resultCount;
                }
                var totalPages =
                    resultCount % pageSize === 0
                        ? resultCount / pageSize
                        : Math.floor(resultCount / pageSize) + 1;
                var paginationMessage;
                if (resultCount === 0) {
                    paginationMessage = 'No applications found';
                } else {
                    paginationMessage =
                        'Showing ' +
                        (offset + 1) +
                        ' &ndash; ' +
                        pageUpperLimit +
                        ' of ' +
                        resultCount +
                        ' applications submitted in the last 60 days';
                }
                const pageAttributes = {
                    message: req.flash('info'),
                    users_applications: results,
                    moment,
                    offset,
                    sortOrder,
                    paginationMessage,
                    currentPage,
                    totalPages,
                    searchCriteria,
                    user_data: userData,
                    application_total: totalApplications,
                };

                return dashboardController._redirectToPage(
                    pageAttributes,
                    req,
                    res
                );
            }
        );
    },

    _userFriendlyStatuses(casebookStatus, applicationtype) {
        const eAppStatuses = {
            Checked: {
                text: 'Completed',
                colorClass: '',
            },
            default: {
                text: 'In progress',
                colorClass: 'govuk-tag--blue',
            },
        };

        const standardStatuses = {
            Despatched: {
                text: 'Despatched',
                colorClass: '',
            },
            default: {
                text: casebookStatus,
            },
        };

        if (!casebookStatus) {
            return {
                text: 'Not avialable',
                colorClass: 'govuk-tag--grey',
            };
        }

        if (applicationtype === 'e-Apostille') {
            return eAppStatuses[casebookStatus] || eAppStatuses['default'];
        }
        return standardStatuses[casebookStatus] || standardStatuses['default'];
    },

    _redirectToPage(pageAttributes, req, res) {
        const { electronicEnabled } = pageAttributes.user_data.user;
        let view = electronicEnabled
            ? 'eApostilles/dashboard.ejs'
            : 'dashboard.ejs';

        if (req.query.ajax) {
            view = electronicEnabled
                ? 'partials/dashboardResultsEApp.ejs'
                : 'partials/dashboardResults.ejs';
            pageAttributes.layout = null;
        }

        return res.view(view, pageAttributes);
    },

    /**
     * @function openCoverSheet
     * @description Open the cover sheet
     * @param req {Array} - request object
     * @param res {Array} - response object
     * @return summary
     */
    openCoverSheet(req, res) {
        if (HelperService.LoggedInStatus(req)) {
            Application.find({
                where: { unique_app_id: req.params.unique_app_id },
            }).then((result) => {
                if (result && result.user_id === req.session.user.id) {
                    req.session.appId = result.application_id;
                    return summaryController.fetchAll(
                        req,
                        res,
                        true,
                        false,
                        true
                    );
                }
                res.view('404');
            });
        } else {
            res.view('404');
        }
    },
};
module.exports = dashboardController;
