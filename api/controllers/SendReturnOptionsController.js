/**
 * SendReturnOptionsController module.
 * @module Controller SendReturnOptionsController
 */

var applicationController   = require('./ApplicationController');
var helptext = require('../../config/helptext');

var sendReturnOptionsController={
    /**
     * ShowSendOptions - Display send options
     * This displays send options - Address where the user should send the documents depends on this answer
     * @returns view sendOptions
     */
    ShowSendOptions : function(req,res){
        var sendOptionsSQL = 'SELECT DISTINCT * '  +
            'FROM "PostagesAvailable" ' +
            'WHERE "PostagesAvailable".type=\'send\' ';


        sequelize.query(sendOptionsSQL)
            .spread(function (send_options, metadata) {
                return res.view('applicationForms/sendOptions.ejs', {
                    application_id: req.session.appId,
                    send_postages: send_options,
                    form_values: req.session.postage_option.send,
                    error_report: req.flash('send_error').length > 0,
                    submit_status: req.session.appSubmittedStatus,
                    user_data: HelperService.getUserData(req,res),
                    summary: req.session.summary
                });
            });
    },

    /**
     * SubmitSendOptions - Add/Submit send options to database
     * 1. First checks that user has selected a choice - throw error if not.
     * 2. Check if user has already added a send options.
     * 3.1. If user hasn't : Create send postage details then call redirect()
     * 3.2. If user has : Update send postage details then call redirect()
     * 4. Redirect to relevant page
     * @returns redirect to relevant page
     */
    SubmitSendOptions : function(req,res){
        if(typeof(req.param('send_postage')) == 'undefined'){
            req.flash('send_error','Choose an option below');
            return res.redirect('/postage-send-options');
        }
        UserPostageDetails.find({where: {application_id: req.session.appId, postage_type:'send'}})
            .then(function(data){
                if(data === null){
                    UserPostageDetails.create({
                        application_id: req.session.appId,
                        postage_available_id : req.param('send_postage'),
                        postage_type : 'send'
                    }).then(function(){
                        redirect();
                    })
                        .catch(function(error){
                            console.log(error);
                        });
                }else{
                    UserPostageDetails.update({
                        postage_available_id : req.param('send_postage')}, {
                        where:{
                            application_id: req.session.appId,
                            postage_type : 'send'
                        }
                    }).then(function(){
                        redirect();
                    });

                }
            });
        function redirect(){
            req.session.postage_option.send = req.param('send_postage');
            if(req.session.summary){
                return res.redirect('/review-summary');
            }else{
                return res.redirect('/postage-return-options');
            }
        }
    },

    /**
     * ShowReturnOptions - Display return options
     * This displays return options.
     * 1. Bring in countries
     * 2. Figure out whether to show UK options, EU option or INT option
     * 3. Fetch send options using the send_country (UK, EU or INT)
     * 4. return view Return Options
     *
     * @returns view returnOptions
     */
    ShowReturnOptions : function(req,res){
        if(req.session.user_addresses !== null && req.session.user_addresses.main.submitted === true){
            var countriesSQL = 'SELECT  name, "in_EU" FROM "country" ORDER BY name ASC ';

            var send_country = '';
            sequelize.query(countriesSQL).then(function (countries) {

                if (req.session.user_addresses.main.address.country == 'United Kingdom') {
                    send_country = 'UK';
                }
                else if (findCountry(countries[0]).in_EU) {
                    send_country = 'EU';
                }
                else {
                    send_country = 'INT';
                }
                var sendOptionsSQL = 'SELECT DISTINCT * ' +
                    'FROM "PostagesAvailable"  ' +
                    'WHERE "PostagesAvailable".type=\'return\' ' +
                    'AND "PostagesAvailable".send_country=\'' + send_country + '\'' +
                    'ORDER BY id';


                sequelize.query(sendOptionsSQL)
                    .spread(function (return_options, metadata) {
                        return res.view('applicationForms/returnOptions.ejs', {
                            application_id: req.session.appId,
                            return_postages: return_options,
                            form_values: req.session.postage_option.return,
                            error_report: req.flash('return_error').length > 0,
                            submit_status: req.session.appSubmittedStatus,
                            user_data: HelperService.getUserData(req, res),
                            summary: req.session.summary,
                            countryHasChanged: req.session.countryHasChanged,
                            helptext: helptext
                        });
                    });
            });

        }
        else{
            //IF user has tried to access page via url instead of following normal route.
            return res.redirect('/provide-your-address-details');
        }

        function findCountry(countries) {
            for (var i = 0; i < countries.length; i++) {
                if (countries[i].name == req.session.user_addresses.main.address.country) {

                    return countries[i];
                }
            }
        }
    },

    /**
     * SubmitReturnOptions - Add/Submit return options to database
     * 1. First checks that user has selected a choice - throws error if not.
     * 2. Check if user has already added a return options.
     * 3.1. If user hasn't : Create return postage details then call redirect()
     * 3.2. If user has : Update return postage details then call redirect()
     * 4. Redirect to relevant page
     * @returns redirect to relevant page
     */
    SubmitReturnOptions : function(req,res){
        if(typeof(req.param('return_postage')) == 'undefined'){
            req.flash('return_error','Choose an option below');
            return res.redirect('/postage-return-options');
        }
        UserPostageDetails.find({where: {application_id: req.session.appId, postage_type:'return'}})
            .then(function(data){
                if(data === null){
                    UserPostageDetails.create({
                        application_id: req.session.appId,
                        postage_available_id : req.param('return_postage'),
                        postage_type : 'return'
                    }).then(function(){
                        redirect();
                    });
                }else{
                    UserPostageDetails.update({
                        postage_available_id : req.param('return_postage')}, {
                        where:{
                            application_id: req.session.appId,
                            postage_type : 'return'
                        }
                    }).then(function(){
                        redirect();
                    });

                }
            });
        function redirect(){
            req.session.postage_option.return = req.param('return_postage');
            if(req.session.summary){
                return res.redirect('/review-summary');
            }else{
                return res.redirect('/additional-information');
            }
        }
    }
};
module.exports = sendReturnOptionsController;
