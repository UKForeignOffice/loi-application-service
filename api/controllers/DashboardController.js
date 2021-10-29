/**
 * DashboardController module.
 * @module Controller DashboardController
 */
const sails = require('sails');
const dayjs = require('dayjs');
const summaryController = require('./SummaryController');
const CasebookService = require('../services/CasebookService');

const dashboardController = {
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
            return HelperService.refreshUserData(req, res).then(() => {
                const userData = HelperService.getUserData(req, res);
                if (!userData) {
                    sails.log.error('No user information found');
                    return res.serverError();
                }
                const { storedProcedureArgs, displayAppsArgs } =
                    dashboardController._calculateSortParams(
                        req,
                        res,
                        userData,
                        totalApplications
                    );

                return dashboardController._getApplications(
                    storedProcedureArgs,
                    displayAppsArgs,
                    userData.user.electronicEnabled
                );
            });
        });
    },

    _calculateSortParams(req, res, userData, totalApplications) {
        const pageSize = 20;
        const currentPage = req.query.page || 1;
        const offset = pageSize * (currentPage - 1);
        const sortOrder = Number(req.query.sortOrder) || -1;
        const isNumberPositive = Math.sign(sortOrder) === 1;
        const direction = isNumberPositive ? 'asc' : 'desc';
        const searchCriteria =
            req.allParams().dashboardFilter || req.query.searchText || '';
        //If user has specifically selected to filter by date (sortOrder eq 1 or -1)
        //then we don't want to secondary sort by date again! But if a user filters by
        //reference number for example, then secondary sort on the date as well.
        let secondarySortOrder = null;
        let secondaryDirection = null;
        const hasSortOrder = sortOrder === 1 || sortOrder === -1;

        if (!hasSortOrder) {
            secondarySortOrder = '1';
            secondaryDirection = 'desc';
        }
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

        return { storedProcedureArgs, displayAppsArgs };
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
            .then((applications) => {
                dashboardController._displayApplications(
                    applications,
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

    async _displayApplications(results, displayAppsArgs) {
        const { currentPage, req, res } = displayAppsArgs;
        //redirect to 404 if user has manually set a page in the query string
        if (results.length === 0) {
            if (currentPage != 1) {
                return res.view('404.ejs');
            } else {
                sails.log.error('No results found.');
            }
        }
        const apiResponse = await dashboardController._getDataFromCasebook(
            req,
            results
        );
        return dashboardController._addCasebookStatusesToResults(apiResponse, {
            ...displayAppsArgs,
            results,
        });
    },

    _getDataFromCasebook(req, results) {
        const applicationReferences = results.map(
            (resultItem) => resultItem.unique_app_id
        );

        const queryParamsObj = {
            timestamp: Date.now().toString(),
            applicationReference: applicationReferences,
        };

        return CasebookService.get({
            uri: req._sails.config.customURLs.applicationStatusAPIURL,
            json: true,
            useQuerystring: true,
            promise: true,
            qs: queryParamsObj,
        })
            .then((response) => {
                const responseHasErrors = response.hasOwnProperty('errors');
                if (responseHasErrors) {
                    sails.log.error(
                        `Invalid response from Casebook Status API call:  ${response.message}`
                    );
                    return response.status(500);
                }
                return response;
            })
            .catch((err) => {
                sails.log.error(
                    `Error returned from Casebook API call: ${err}`
                );
            });
    },

    _addCasebookStatusesToResults(apiResponse, displayAppsArgs) {
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
            results,
        } = displayAppsArgs;
        const { totalPages, paginationMessage } =
            dashboardController._paginationAndPageTotal(
                results,
                offset,
                pageSize
            );
        if (results.length === 0) {
            if (currentPage != 1) {
                return res.view('404.ejs');
            } else {
                sails.log.error('No results found.');
            }
        } else {
            let appRef = {};
            let trackRef = {};

            if (apiResponse) {
                for (let result of apiResponse) {
                    appRef[result.applicationReference] = result.status;
                    trackRef[result.applicationReference] =
                        result.trackingReference;
                }
            }

            // For each element in the database results array, add the application reference status
            // if one exists.

            for (let result of results) {
                const uniqueAppId = result.unique_app_id;
                const appStatus = appRef[uniqueAppId];

                result.app_status = dashboardController._userFriendlyStatuses(
                    appStatus,
                    result.applicationtype
                );
                result.tracking_ref = trackRef[uniqueAppId];
            }
        }

        const pageAttributes = {
            message: req.flash('info'),
            users_applications: results,
            dayjs,
            offset,
            sortOrder,
            paginationMessage,
            currentPage,
            totalPages,
            searchCriteria,
            user_data: userData,
            application_total: totalApplications,
        };

        return dashboardController._redirectToPage(pageAttributes, req, res);
    },

    _userFriendlyStatuses(casebookStatus, applicationtype) {
        const eAppStatuses = {
            Completed: {
                text: 'Completed',
                colorClass: '', // dark blue
            },
            default: {
                text: 'In progress',
                colorClass: 'govuk-tag--blue',
            },
        };

        const standardStatuses = {
            Despatched: {
                text: 'Despatched',
                colorClass: '', // dark blue
            },
            default: {
                text: casebookStatus,
                colorClass: 'govuk-tag--blue',
            },
        };

        if (!casebookStatus) {
            return {
                text: 'Not available',
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

    _paginationAndPageTotal(results, offset, pageSize) {
        let paginationMessage;
        let pageUpperLimit = offset + pageSize;
        const resultCount = results.length === 0 ? 0 : results[0].result_count;
        const totalPages =
            resultCount % pageSize === 0
                ? resultCount / pageSize
                : Math.floor(resultCount / pageSize) + 1;

        if (pageUpperLimit > resultCount) {
            pageUpperLimit = resultCount;
        }

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

        return {
            totalPages,
            paginationMessage,
        };
    },

    _totalRejectedDocuments(application) {
        const applicationHasDocuments = application.hasOwnProperty('documents') && application.documents.length > 0;

        return (applicationHasDocuments)
            ? application.documents.filter(document => document.status === 'Rejected').length
            : 0;
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
