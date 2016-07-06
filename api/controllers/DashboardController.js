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
            var searchCriteria = req.allParams().dashboardFilter || req.query.searchText || '';
            var direction = Math.sign(sortOrder) === 1 ? 'asc' : 'desc';
            var userApplicationsSql = 'SELECT * FROM dashboard_data(:userId, :pageSize, :offset, :sortOrder, :direction, :queryString)';

            sequelize.query(userApplicationsSql,
                {
                    replacements: {
                        userId: req.session.passport.user,
                        pageSize: pageSize,
                        offset: offset,
                        sortOrder: Math.abs(sortOrder).toString(),
                        direction: direction,
                        queryString: '%' + searchCriteria + '%'
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
                        application_total : resultCount
                    };
                    if(req.query.ajax){
                        view = 'partials/dashboardResults.ejs';
                        attributes.layout= null;
                    }


                    return res.view(view,attributes);
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
