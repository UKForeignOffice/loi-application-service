/**
 * DashboardController module.
 * @module Controller DashboardController
 */
const sails = require('sails');
const dayjs = require('dayjs');
const OrbitService = require('../services/OrbitService');
// @ts-check
const HelperService = require("../services/HelperService");
const Application = require('../models/index').Application
const sequelize = require('../models/index').sequelize


const DashboardController = {
    /**
     * Move all relevant Application data provided by the user into the Exports table.
     * This table can then be exported as a JSON object directly to the Submission API.
     * This will also keep a history of applications made.
     * @param req
     * @param res
     *
     */
    dashboard(req, res) {
        const userNotLoggedIn = !HelperService.LoggedInStatus(req)
        if (userNotLoggedIn) {
            req.flash('error', 'You have to be logged in to access the page.');
            return res.redirect(
                req._sails.config.customURLs.userServiceURL + '/sign-in'
            );
        }
        Application.count({
            where: { user_id: req.session.passport.user },
        })
            .then((totalApplications) => {
                return HelperService.refreshUserData(req, res).then(() => {
                    const userData = HelperService.getUserData(req, res);
                    if (!userData) {
                        sails.log.error('No user information found');
                        return res.serverError();
                    }
                    const { storedProcedureArgs, displayAppsArgs } =
                        DashboardController._calculateSortParams(
                            req,
                            res,
                            userData,
                            totalApplications
                        );

                    return DashboardController._getApplications(
                        storedProcedureArgs,
                        displayAppsArgs
                    );
                });
            })
            .catch((err) => {
                sails.log.error(`dashboard Error: ${err}`);
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

    _getApplications(storedProcedureArgs, displayAppsArgs) {
        const queryApplications = DashboardController._chooseStoredProcedure(
            storedProcedureArgs.secondarySortOrder
        );

        sails.log.info('Fetching electronic and paper applications');
        sequelize
            .query(queryApplications, storedProcedureArgs)
            .then((applications) => {
                DashboardController._displayApplications(
                    applications,
                    displayAppsArgs
                );
            })
            .catch((error) => {
                throw new Error(error);
            });
    },

    _chooseStoredProcedure(secondarySortOrder) {
        return secondarySortOrder === null
            ? 'SELECT * FROM dashboard_data_eapp(:userId, :pageSize, :offset, :sortOrder, :direction, :queryString)'
            : 'SELECT * FROM dashboard_data_eapp(:userId, :pageSize, :offset, :sortOrder, :direction, :queryString, :secondarySortOrder, :secondaryDirection)';
    },

    async _displayApplications(results, displayAppsArgs) {
        try {
            const { currentPage, res } = displayAppsArgs;
            //redirect to 404 if user has manually set a page in the query string
            if (results.length === 0) {
                if (currentPage !== 1) {
                    return res.view('404.ejs');
                } else {
                    sails.log.error('No results found.');
                }
            }

            const submittedApps = results.filter(object => object.submitted === 'submitted');

            let orbitPromise = null;

            // Only create the promise if there are submitted Orbit apps
            if (submittedApps.length > 0) {
              orbitPromise = Promise.race([
               DashboardController._getDataFromOrbit(submittedApps),
                new Promise((resolve) => setTimeout(resolve, 5000, null))
              ]);
            }

            // Await the promise if it exists, otherwise set orbitData to null
            const orbitData = orbitPromise ? await orbitPromise : null;

            return DashboardController._addStatusesToApplications(
                orbitData,
                {
                  ...displayAppsArgs,
                  results,
                }
             );

        } catch (err) {
            sails.log.error('Status Retrieval API error');
            console.log(err)
            return DashboardController._renderApplicationsWithoutStatuses(
                results,
                displayAppsArgs
            );
        }
    },

    async _getDataFromOrbit(results) {
      try {
        return await OrbitService.getApplicationsStatusesFromOrbit(results);
      } catch (error) {
        throw new Error(error);
      }
    },

    _addStatusesToApplications(apiResponse, displayAppsArgs) {
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
            DashboardController._paginationAndPageTotal(
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
            let applicationDocuments = {};

            if (apiResponse) {
                for (let result of apiResponse) {
                    appRef[result.applicationReference] = result.status;
                    trackRef[result.applicationReference] =
                        result.trackingReference;
                    applicationDocuments[result.applicationReference] =
                        result.hasOwnProperty('documents')
                            ? result.documents
                            : null;
                }
            }

            // For each element in the database results array, add the application reference status
            // if one exists.
            for (const result of results) {
                const uniqueAppId = result.unique_app_id;
                const appStatus = appRef[uniqueAppId];
                let viewUrlPrefix = "open-paper-app";
                let rejectedDocs = 0;

                applicationDocuments[uniqueAppId] &&
                    applicationDocuments[uniqueAppId].forEach((document) => {
                        if (document.status === 'Rejected') {
                            rejectedDocs++;
                        }
                    });

                result.app_status = DashboardController._userFriendlyStatuses(
                    appStatus,
                    result.applicationtype
                );
                result.tracking_ref = trackRef[uniqueAppId];
                result.rejected_docs = rejectedDocs;

                if (result.applicationtype === 'e-Apostille') {
                    viewUrlPrefix = "open-eapp"
                }

                result.view_app_url = `/${viewUrlPrefix}/${uniqueAppId}`;
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

        return DashboardController._redirectToPage(pageAttributes, req, res);
    },

    _renderApplicationsWithoutStatuses(results, displayAppsArgs) {
        return DashboardController._addStatusesToApplications(null, {
            ...displayAppsArgs,
            results,
        });
    },

    _userFriendlyStatuses(orbitStatus, applicationType) {
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
                text: orbitStatus,
                colorClass: 'govuk-tag--blue',
            },
        };

        if (!orbitStatus) {
            return {
                text: 'Not available',
                colorClass: 'govuk-tag--grey',
            };
        }

        if (applicationType === 'e-Apostille') {
            return eAppStatuses[orbitStatus] || eAppStatuses['default'];
        }
        return standardStatuses[orbitStatus] || standardStatuses['default'];
    },

    _redirectToPage(pageAttributes, req, res) {

        let view = 'dashboard.ejs';

        if (req.query.ajax) {
            view = 'partials/dashboardResults.ejs';
            pageAttributes.layout = null; // prevents parent layout from being added to partial
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
                ' – ' +
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
};
module.exports = DashboardController;
