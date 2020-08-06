/**
 * DashboardController module.
 * @module Controller DashboardController
 */

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
    dashboard: function (req, res) {
        if (!(req.session.passport && req.session.passport.user)){
            return res.redirect(sails.config.customURLs.userServiceURL + '/sign-in');
        }
        Application.count({where:{user_id:req.session.passport.user}}).then(function(c) {
        HelperService.refreshUserData(req,res).then(function() {

            var pageSize = 20;
            var currentPage = req.query.page || 1;
            var offset = pageSize * (currentPage - 1);
            var sortOrder = req.query.sortOrder || -1;
            var direction = Math.sign(sortOrder) === 1 ? 'asc' : 'desc';
            var searchCriteria = req.allParams().dashboardFilter || req.query.searchText || '';
            //If user has specifically selected to filter by date (sortOrder eq 1 or -1)
            //then we don't want to secondary sort by date again! But if a user filters by
            //reference number for example, then secondary sort on the date as well.
            var secondarySortOrder = sortOrder === 1 || sortOrder === -1 ? null : '1';
            var secondaryDirection = sortOrder === 1 || sortOrder === -1 ? null : 'desc';

            if (secondarySortOrder === null){
              var userApplicationsSql = 'SELECT * FROM dashboard_data(:userId, :pageSize, :offset, :sortOrder, :direction, :queryString)';
            }
            else {
              var userApplicationsSql = 'SELECT * FROM dashboard_data(:userId, :pageSize, :offset, :sortOrder, :direction, :queryString, :secondarySortOrder, :secondaryDirection)';
            }

            //console.log(req.session.passport.user, pageSize, offset,Math.abs(sortOrder).toString(),direction, '%' + searchCriteria + '%', secondarySortOrder, secondaryDirection);
            sequelize.query(userApplicationsSql,
                {
                    replacements: {
                        userId: req.session.passport.user,
                        pageSize: pageSize,
                        offset: offset,
                        sortOrder: Math.abs(sortOrder).toString(),
                        direction: direction,
                        queryString: '%' + searchCriteria + '%',
                        secondarySortOrder: secondarySortOrder,
                        secondaryDirection: secondaryDirection
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (results) {
                    //redirect to 404 if user has manually set a page in the query string
                    var resultCount = 0;
                    if (results.length === 0) {
                        if (currentPage != 1) {
                            return res.view('404.ejs');
                        }
                        else {
                            message = 'No results found.';
                        }
                    }
                    else {
                        resultCount = results[0].result_count;
                    }

                    async.parallel ([
                        // Make call to Casebook Status API for the application references in the results collection.

                        function(callback){

                            var request = require('request');
                            var fs = require('fs');
                            var crypto = require('crypto');
                            var apiQueryString = require('querystring');

                            // Create status retrieval request object.

                            // First build array of application references to be passed to the Casebook Status API for this page. Can submit up to 20 at a time.

                            var applicationReferences = [];

                            for ( var i=0; i < results.length; i++ ) {
                                applicationReferences.push(results[i].unique_app_id);
                            }

                            // Create Request Structure

                            var leg_app_stat_struc = {
                                    "timestamp": (new Date()).getTime().toString(),
                                    "applicationReference": applicationReferences
                                };

                            var queryStr = apiQueryString.stringify(leg_app_stat_struc);

                            var certPath;
                            try {
                                certPath = sails.config.paths.casebookCertificate;
                            }
                            catch (err) {
                                console.error('Null certificate path: [%s] ', err);
                                certPath = null;
                            };

                            var keyPath;
                            try {
                                keyPath = sails.config.paths.casebookKey
                            }
                            catch (err) {
                                console.error('Null key path: [%s] ', err);
                                keyPath = null;
                            };

                            // calculate HMAC string and encode in base64

                            var hash = crypto.createHmac('sha512', sails.config.hmacKey).update(new Buffer(queryStr, 'utf-8')).digest('hex').toUpperCase();

                            // DEBUG
                            //console.log("HMAC String: ", hash);
                            //console.log("queryString: ", queryStr);
                            //console.log("KeyPath: ", keyPath);
                            //console.log("CertPath: ", certPath);
                            //console.log("CertPath: ", sails.config.customURLs.applicationStatusAPIURL);

                            request({
                                url: sails.config.customURLs.applicationStatusAPIURL,
                                agentOptions: {
                                    cert: certPath,
                                    key: keyPath
                                },
                                method: 'GET',
                                headers: {
                                    'hash': hash,
                                    'Content-Type': "application/json; charset=utf-8"
                                },
                                json: true,
                                useQuerystring: true,
                                qs: leg_app_stat_struc
                            }, function(error, response, body){
                                 if ( error ) {
                                     console.log("Error returned from Casebook API call: ", error);
                                   callback(true);
                                     return;
                                 } else if ( response.statusCode == 200 ) {
                                     obj = body;
                                     callback(false, obj);
                                 } else {
                                     console.log("Invalid response from Casebook Status API call: ", response.statusCode);
                                     callback(true);
                                     return;
                                 }
                            });
                        }],

                        // Collate results

                        function(err, api_results){

                            var resultCount = 0;
                            if (results.length === 0) {
                                if (currentPage != 1) {
                                    return res.view('404.ejs');
                                }
                                else {
                                    message = 'No results found.';
                                }
                            }
                            else {
                                resultCount = results[0].result_count;

                                // Add Casebook status to results array.
                                //Add tracking reference to results array
                                // Only update if there are matching values

                                if (err) {
                                    console.log("Casebook Status Retrieval API error: ", err);
                                } else if (api_results[0].length === 0){
                                    console.log("No Casebook Statuses available");
                                } else {

                                  // Build the application reference status obj. This contains the application reference and it's status
                                    // as a key/value pair.

                                    var appRef = {};
                                    var trackRef = {};


                                    for ( var k=0; k < api_results[0].length; k++ ) {
                                       appRef[ api_results[0][k].applicationReference ] = api_results[0][k].status;
                                       trackRef[ api_results[0][k].applicationReference ] = api_results[0][k].trackingReference;

                                    }

                                    // For each element in the database results array, add the application reference status
                                    // if one exists.

                                    for (var i = 0; i < results.length; i++) {
                                        results[i].app_status = appRef[results[i].unique_app_id];
                                        results[i].tracking_ref = trackRef[results[i].unique_app_id];
                                    }
                                }
                            }

                            var moment = require('moment');
                            var pageUpperLimit = (offset + pageSize);
                            if (pageUpperLimit > resultCount) {
                                pageUpperLimit = resultCount;
                            }
                            var totalPages = resultCount%pageSize===0? resultCount / pageSize: Math.floor(resultCount / pageSize) + 1;
                            var paginationMessage;
                            if (resultCount === 0) {
                                paginationMessage = 'No applications found';
                            }
                            else {
                                paginationMessage = 'Showing ' + (offset + 1) + ' &ndash; ' + pageUpperLimit + ' of ' + resultCount + ' applications submitted in the last 60 days';
                            }


                            var view ='dashboard.ejs';
                            var attributes = {
                                message: req.flash('info'),
                                users_applications: results,
                                moment: moment,
                                offset: offset,
                                sortOrder: sortOrder,
                                paginationMessage: paginationMessage,
                                currentPage: currentPage,
                                totalPages: totalPages,
                                searchCriteria: searchCriteria,
                                user_data: HelperService.getUserData(req, res),
                                application_total : c
                            };
                            if(req.query.ajax){
                                view = 'partials/dashboardResults.ejs';
                                attributes.layout= null;
                            }


                            return res.view(view,attributes);
                        }
                    );

                })
                .catch(function (error) {
                    sails.log(error);
                });

            //return res.view('dashboard.ejs', {users_applications: false, user:req.session.user});
        });
        });
    },
    /**
     * @function openCoverSheet
     * @description Open the cover sheet
     * @param req {Array} - request object
     * @param res {Array} - response object
     * @return summary
     */
    openCoverSheet: function(req, res) {
        if (HelperService.LoggedInStatus(req)) {
            Application.find({ where: { unique_app_id: req.params.unique_app_id } })
                .then(function(result) {
                    if (result) {
                        if(result.user_id == req.session.user.id) {
                            req.session.appId = result.application_id;
                            return summaryController.fetchAll(req, res, true, false, true);
                        }else{
                            res.view('404');
                        }
                    }
                    else {
                        res.view('404');
                    }

                });
        } else {
            res.view('404');
        }
    }


};
module.exports = dashboardController;
