/**
 * Helper Service
 *
 * All Globally useful methods can go in here
 *
 * @type {{LoggedInStatus: Function}}
 */

var moment = require('moment');
var UserModels = require('../userServiceModels/models.js');

function getDocument(req, doc_id) {
    return sequelize.query('SELECT * FROM "AvailableDocuments" WHERE doc_id = :doc_id',
        {
            replacements: {
                doc_id: doc_id
            },
            type: sequelize.QueryTypes.SELECT
        });
}

var HelperService ={

    //No longer used
    validSession: function(req,res){
        if(req.cookies.LoggedIn && !req.session.passport){
            console.log('Logged in but passport has expired');
            return {valid:false};
        }
        else if(req.cookies.LoggedIn && req.session.passport && !req.session.appId){
            return {valid:true};
        }
        else if(req.session.appId){
            return {valid:true, appId:req.session.appId};
        }
        else{
            console.log('Expired within application');
            return {valid:false,appId:0};
        }
    },

    getUserData:function(req,res){
        var user_data ={
            loggedIn: false,
            user:false,
            account:false,
            url:sails.config.customURLs.userServiceURL,
            addressesChosen:false
        };
        if (req.session && req.session.passport && req.session.passport.user) {
            user_data.loggedIn= true;
            if(typeof req.session.account == 'undefined'){
                return res.redirect('/loading-dashboard');
            }
        }
        if (user_data.loggedIn){
            user_data.user = req.session.user;
            user_data.account = req.session.account;
            user_data.addressesChosen = req.session.savedAddressesChosen;

        }
        return user_data;
    },

    resetAddressSessionVariables: function(req,res){
        //Address session variables
        req.session.savedAddressesChosen = HelperService.getUserData(req,res).loggedIn ?[0, 0]: [-3,-3]; //0= not set -1 = Not using saved addresses, -2 = no saved addresses, -3= Not logged in,
        req.session.returnAddress= false;
        req.session.sameChosen = null; //Session variable for if the same address has been chosen
        req.session.country = null;
        req.session.user_addresses = null;
        req.session.postage_option = {send:null,return:null};
    },


    refreshUserData: function(req,res){
        return UserModels.User.findOne({where: {email: req.session.email}}).then(function (user) {
            UserModels.AccountDetails.findOne({where: {user_id: user.id}}).then(function (account) {
                req.session.user = user;
                req.session.account = account;
            });
        });

    },


    /**
     * Return true of false on authentication (loggedIn) status so templates can render the logout link correctly
     * @param req
     * @returns {boolean}
     */
    LoggedInStatus: function amILoggedIn(req) {
        if(req.session && req.session.passport && req.session.passport.user) {
            return true;
        }
        else {
            return false;
        }
    },

    /**
     * Get the email address of the current in User
     * @param req
     * @returns email {string}
     */
    LoggedInUserEmail: function whatsUsersEmail(req)
    {
        if (req.session && req.session.passport && req.session.passport.user && req.session.email && req.session.email !== null) {
            return req.session.email;
        } else {
            return 'Not Logged In';
        }
    },

    ApplicationFullName: function whatsFullName(app_id)
    {
        return new Promise(function (resolve, reject) {
            UsersBasicDetails.findOne(
                {
                    where: {
                        application_id: app_id
                    }
                })
                .then(function (results) {
                    if (results && results.dataValues && results.dataValues.first_name && results.dataValues.last_name) {
                        resolve(results.dataValues.first_name + ' ' + results.dataValues.last_name);
                    } else {
                        resolve('');
                    }
                    // Your code
                })
                .catch(function (err) {
                    sails.log(err);
                    resolve('');
                });
        });
    },

    /**
     * Create a random hex value to be used for the user's reference
     * @param len
     * @returns {Array.<T>|string|*|Blob}
     */
    randomValueHex: function randomValueHex(len) {
        var crypto = require('crypto');
        return crypto.randomBytes(Math.ceil(len / 2))
            .toString('hex') // convert to hexadecimal format
            .slice(0, len);   // return required number of characters
    },

    /**
     * Send the application data to the RabbitMQ queue
     * @param app_id
     */
    sendRabbitSubmissionMessage: function sendRabbitSubmissionMessage(app_id) {

        //rabbit message with application ID
        var rabbit = require('amqplib/callback_api');

        var queueLocation = sails.config.rabbitMQ.queueLocation;

        rabbit.connect(queueLocation, function (err, conn) {
            if (err){
                sails.log.error(err.message);
            }
            else {
                conn.createChannel(function (err, ch) {
                    if (err){
                        sails.log.error(err.message);
                    }
                    else {
                        var queueName = sails.config.rabbitMQ.queueName;
                        var exchangeName = sails.config.rabbitMQ.exchangeName;
                        var retryQueue = sails.config.rabbitMQ.retryQueue;
                        var retryExchange = sails.config.rabbitMQ.retryExchange;
                        ch.assertExchange(retryExchange, 'fanout', {durable: true}, function (err, ok) {
                            if (err){
                                sails.log.error(err.message);
                            }
                            else {
                                ch.assertQueue(retryQueue, {
                                    deadLetterExchange: exchangeName,
                                    messageTtl: sails.config.rabbitMQ.retryDelay,
                                    deadLetterRoutingKey: queueName
                                }, function (err, ok) {
                                    if (err){
                                        sails.log.error(err.message);
                                    }
                                    else {
                                        ch.bindQueue(retryQueue, retryExchange, '', null, function (err, ok) {
                                            ch.assertExchange(exchangeName, 'fanout', {durable: true}, function (err, ok) {
                                                //this document is very important for getting these options correct with the amqplib library
                                                //http://www.squaremobius.net/amqp.node/channel_api.html#channel_assertQueue
                                                ch.assertQueue(queueName, {
                                                    durable: true
                                                }, function (err, ok) {
                                                    if (err){
                                                        sails.log.error(err.message);
                                                    }
                                                    else {
                                                        ch.bindQueue(queueName, exchangeName, '', null, function (err, ok) {
                                                            sails.log.info('queueing ' + app_id);
                                                            ch.publish(exchangeName, queueName, new Buffer(app_id.toString()));
                                                            //update application status to 'queued'
                                                            Application.update({
                                                                submitted: 'queued'
                                                            }, {
                                                                where: {
                                                                    application_id: app_id
                                                                }
                                                            })
                                                                .then(function () {
                                                                    sails.log.info('queued ' + app_id);
                                                                })
                                                                .catch(Sequelize.ValidationError, function (error) {
                                                                    sails.log.error(error);
                                                                });
                                                        });
                                                    }
                                                });
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
          setTimeout(function() { conn.close(); }, 10000);
        });
    },

    /**
     * Simple method to force duplicates out of an array.
     * this should be moved to a helper file.
     * @param arr
     * @returns {*|Array.<T>|string}
     */
    uniqueArr: function uniqueArr(arr) {
        var a = arr.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    },

    /**
     * Get all HTML block partial identifiers for each certifiable document
     * @param application_id
     * @returns {*}
     */
    getUserDocs: function getUserDocs(application_id) {
        getUserDocsSQL = 'SELECT ud.user_doc_id, ad.doc_id, ad.doc_title,  ad.doc_title_start,  ad.doc_title_mid, ad.html_id, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, kind_of_document, accept_text FROM "AvailableDocuments" ad join "UserDocuments" ud on ud.doc_id=ad.doc_id WHERE ud.application_id=' + application_id + ' order by ud.user_doc_id asc';
        return sequelize.query(getUserDocsSQL)
            .catch( function(error) { sails.log(error); } );
    },

    /**
     * Build ar array of documents that have not had a format
     * selected on the "confirm document is eligible" page
     * @param req
     * @param res
     * @param usersDocs
     * @returns {Array}
     */
    buildArrayOfDocFormatOptionsNotSelected: function(req,res,usersDocs) {
        var parameters = req.params.all();

        if (req.body) {
            req.session.eligible_input = req.params.all();
        }
        else if(req.session.eligible_input) {
            parameters = req.session.eligible_input;
        }

        var eligibleOptionsNotSelected = [];
        for (var i=0;i < usersDocs.length; i++) {
            // if docid not in the params array
            var indexableString = JSON.stringify(parameters);
            if (indexableString.indexOf('docid_'+usersDocs[i].doc_id) === -1) {
                // push docid to array
                eligibleOptionsNotSelected.push('docid_'+usersDocs[i].doc_id);
            }
        }

        return  eligibleOptionsNotSelected;

    },

    /**
     * Build an array of documents that will require certification, based on the option selected
     * on the "confirm document is eligible" page
     * @param res
     * @param req
     * @param userDocs
     * @returns {Array}
     */
    buildArrayOfDocsToBeCertified: function(res,req,userDocs) {
        var parameters = req.params.all();
        if (!req.body) {
            if(req.session.eligible_input) {
                parameters = req.session.eligible_input;
            }
            else{
                return null;
            }
        }
        var arrOfDocsToBeCertified = [];
        userDocs.forEach(
            function (doc) {
                for (var key in parameters) {
                    var value = parameters[key];
                    if (value.indexOf('certReq') > -1 && arrOfDocsToBeCertified.indexOf(key.substring(6)) === -1 && key.length>3) {
                        arrOfDocsToBeCertified.push(key.substring(6));
                    } else if (key.length<4) {
                        arrOfDocsToBeCertified.push(key);
                    }
                }

                var passportDocToNOTcertify, drivingLicenseDocToNOTcertify;
                if (doc.doc_title.trim() == 'Passport') {
                    passportDocToNOTcertify = doc.doc_id;
                    arrOfDocsToBeCertified.splice(passportDocToNOTcertify);
                }
                if (doc.doc_title.trim() == 'Driving License') {
                    drivingLicenseDocToNOTcertify = doc.doc_id;
                    arrOfDocsToBeCertified.splice(drivingLicenseDocToNOTcertify);
                }

            });

        return arrOfDocsToBeCertified;


    },

    /**
     * Get document title based on the document id
     * @param docid
     * @returns {Promise}
     */
    getDocTitleByDocId: function(docid) {
        var docTitle = '';
        var sql = 'SELECT doc_title_mid FROM "AvailableDocuments" where doc_id = '+ docid;
        var docTitlePromise =  new Promise(function (resolve, reject) {
            sequelize.query(sql)
                .then( function(result) {
                    docTitle = result[0][0].doc_title_mid;
                    resolve(docTitle);
                });
        });

        return docTitlePromise;
    },

    /**
     * Manually build error array from "confirm document certified" page when validation fails
     * i.e. nothing has been asnwered, and redirect to the 'documentsCheckerCertifiedCheck'
     * page rendering the validation errors
     * @param req
     * @param res
     * @returns {*}
     */
    catchConfirmCertifiedErrors: function(req, res) {
        req.session.last_doc_checker_page = '/check-documents-eligible';
        var answeredNo = [];
        var answeredYes = [];
        var notAnswered = [];
        var destinationPage = "";
        var failedCerts = [];

        for(var key in req.params.all())
        {
            if (req.params.all()[key] === 'false' && JSON.stringify(notAnswered).indexOf(key) === -1) {
                /**
                 * unconfirmed certification status
                 * therefore do validation and highlight
                 * problem items
                 */
                notAnswered.push(key);
            } else {
                /**
                 * positive certification confirmation
                 * therefor can go to basic userdetail page
                 */
                if (req.params.all()[key].indexOf('yes') > -1 && JSON.stringify(answeredYes).indexOf(key) === -1) {
                    answeredYes.push(key);
                }
                /**
                 * negative certification confirmation
                 * therefore go to fail page
                 */
                if (req.params.all()[key].indexOf('no') > -1 && JSON.stringify(answeredNo).indexOf(key) === -1) {
                    answeredNo.push(key);
                }

            }
        }

        /**
         * Nothing answered so show the validation errors for each unanswered question
         */
        if (answeredNo.length===0 && answeredYes.length===0 || notAnswered.length>0) {
            var error_report = [];
            destinationPage = 'documentChecker/documentsCheckerCertifiedCheck.ejs';
            notAnswered.forEach(function(item) {
                req.session.selectedDocuments.documents.forEach( function(doc) {
                    if (item === doc.doc_id) {
                        var fieldSolution = 'Confirm whether the ' + doc.doc_title_mid + ' you plan to send in has been certified';
                        var fieldName = "docid_" + doc.doc_id;
                        var fieldError = 'Confirm the certification status of the ' + doc.doc_title_mid;
                        var questionId = "docid_" + doc.doc_id;
                        error_report.push(ValidationService.buildCustomError(fieldName, fieldError, fieldSolution, questionId));
                    }
                });
            });
        }

        // All or some answered YES, therefore go to basic details page
        if (answeredYes.length > 0) {

            if (answeredNo.length===0 && notAnswered.length===0) {
                req.session.last_doc_checker_page = '/check-documents-eligible';
                if (req.session.appType == 2) {
                  return res.redirect('/business-document-quantity?pk_campaign=Premium-Service&pk_kwd=Premium');
                }
                  else if (req.session.appType == 3) {
                    return res.redirect('/business-document-quantity?pk_campaign=DropOff-Service&pk_kwd=DropOff');
                }
              else {
                  return res.redirect('/your-basic-details');
                }
            } else {
                destinationPage = 'documentChecker/documentsCheckerCertifiedCheck.ejs';
            }
        }

        // All or some answered NO, therfore go to NOT certified page page
        if (answeredNo.length>0) {
            if (notAnswered.length===0) {
                req.session.failed_certs = [];
                // All answered NO, therefore go to basic details page
                answeredNo.forEach(function(item){
                    req.session.selectedDocuments.documents.forEach(function(doc) {
                        if (doc.doc_id==item && (JSON.stringify(failedCerts).indexOf(item) === -1 && JSON.stringify(failedCerts).indexOf(doc.doc_id) === -1)) {
                            failedCerts.push({doc_id: item, doc_title: doc.doc_title, doc_title_mid: doc.doc_title_mid});
                        }
                        req.session.failed_certs = failedCerts;
                    });
                });
                destinationPage = 'documentChecker/documentsCheckerNotCertified.ejs';
            } else {
                //error_report = [];
                destinationPage = 'documentChecker/documentsCheckerCertifiedCheck.ejs';
                notAnswered.forEach(function(item) {
                    req.session.selectedDocuments.documents.forEach(function (doc) {
                        if (item === doc.doc_id) {
                            var fieldSolution = 'Confirm whether the ' + doc.doc_title_mid + ' you plan to send in has been certified';
                            var fieldName = "docid_" + doc.doc_id;
                            var fieldError = 'Confirm the certification status of the ' + doc.doc_title_mid;
                            var questionId = "docid_" + doc.doc_id;
                            error_report.push(ValidationService.buildCustomError(fieldName, fieldError, fieldSolution, questionId));
                        }
                    });
                });

            }

        }

        HelperService.getUserDocs(req.session.appId)
            .then(function(results) {
                var usersDocs = results[0];
                // array of docs to be certified
                var arrOfDocsToBeCertified = HelperService.buildArrayOfDocsToBeCertified(res, req, usersDocs);
                return res.view(destinationPage, {
                    pageTitle: "Get your document certified",
                    application_id: req.session.appId,
                    failed_certs: req.session.failed_certs?req.session.failed_certs:false,
                    failed_certs_string: req.session.failed_certs?req.session.failed_certs:false,
                    form_values: [{yes: answeredYes, no: answeredNo}],
                    error_report: error_report,
                    docs_to_cert: arrOfDocsToBeCertified,
                    users_docs: usersDocs,
                    last_doc_checker_page: req.session.last_doc_checker_page,
                    update: false,
                    loggedIn: HelperService.LoggedInStatus(req),
                    usersEmail: HelperService.LoggedInUserEmail(req),
                    submit_status: req.session.appSubmittedStatus,
                    current_uri: req.originalUrl,
                    user_data: HelperService.getUserData(req, res),
                    search_term: !req.session.searchTerm?req.param('query') || req.query.searchTerm || '':req.session.searchTerm,
                    no_email_flash: req.flash('email_error')
                });
            })
            .catch(function(error) {
                console.log(error);
            });
    },

    buildArrayOfDocsDocsThatNotCertified: function(res,req,userDocs) {
        var answersSetAsNo = [];
        for (var i = 0; i < usersDocs.length; i++) {
            var indexableString = JSON.stringify(req.params.all());
            if (indexableString.indexOf('docid_' + usersDocs[i].doc_id) === -1) {
                answersSetAsNo.push('docid_' + usersDocs[i].doc_id);
            }
        }

        return answersSetAsNo;

    },

    hasCountryChanged: function hasCountryChanged(req, app_id) {

        return new Promise(function (resolve, reject) {
            var overallResult = '';
            AddressDetails.findOne(
                {
                    where: {
                        application_id: app_id
                    }
                }
            )
                .then(function (results) {
                    if (results !== null && results.country !== req.param('country')) {
                        overallResult = true;
                        resolve(overallResult);
                    } else {
                        overallResult = false;
                        resolve(overallResult);
                    }
                    // Your code
                })

                .catch(function (err) {
                    sails.log(err);
                    overallResult = false;
                    //overallResult;
                    resolve(overallResult);
                });
        });
    },

    checkIfArrContains: function(needle) {
        // Per spec, the way to identify NaN is that it is not equal to itself
        var findNaN = needle !== needle;
        var indexOf;

        if(!findNaN && typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function(needle) {
                var i = -1, index = -1;

                for(i = 0; i < this.length; i++) {
                    var item = this[i];

                    if((findNaN && item !== item) || item === needle) {
                        index = i;
                        break;
                    }
                }

                return index;
            };
        }

        return indexOf.call(this, needle) > -1;
    },

    getBusinessSendInformation: function(application_type){
        var htmlResult=[];
        if (application_type==2){
            htmlResult.push([ '<p>Bring your documents along with a printout of your cover sheet to:</p>' ]);
            htmlResult.push(['<p><span>Legalisation Office Premium Service<br>' +
            'Foreign and Commonwealth Office<br>' +
            'Sanctuary Buildings<br>' +
            '20 Great Smith Street<br>' +
            'London <br>' +
            'SW1P 3BT' +
            '</span></p>' ]);
        }
        else if(application_type==3){
            htmlResult.push([ '<p>Bring your documents along with a printout of your cover sheet to:</p>' ]);
            htmlResult.push(['<p><span>Legalisation Office drop-off service<br>' +
            '400-500 Silbury Boulevard<br>' +
            'Milton Keynes<br>' +
            'MK9 2AD<br>' +
            '</span></p>' ]);
        }

        return htmlResult;
    },

    getSendInformation: function(postage_options) {
      if (postage_options[0].type === 'return') {
        postage_send_details = postage_options[1];
      }
      else if (postage_options[1].type === 'return') {
        postage_send_details = postage_options[0];
      }
      var htmlResult = [];
      if (postage_send_details.title === "You'll post your documents from the UK") {
          htmlResult.push(['<p>Using <span style="">Royal Mail tracked delivery</span>, send us your documents with a printout of your application cover sheet or this email: </p>']);
          htmlResult.push(['<p><span>Legalisation Office<br/>' +
          'Foreign and Commonwealth Office<br/>' +
          'PO Box 6255<br/>' +
          'Milton Keynes<br/>' +
          'MK10 1XX' +
          '</span></p>']);
      }
      else {
        htmlResult.push(['<p>Using <span style="">Courier recorded delivery</span>, send us your documents with a printout of your application cover sheet or this email: </p>']);
        htmlResult.push(['<p><span>Legalisation Office<br/> ' +
        'Foreign and Commonwealth Office<br/>' +
        ' Hanslope Park <br/>' +
        'Hanslope  <br/>' +
        ' Milton Keynes<br/>' +
        ' MK19 7BH' +
        '</span></p> ']);
      }
        return htmlResult;

    },

  getSendInformationFastTrack: function(postage_options) {
    if (postage_options[0].type === 'return') {
      postage_send_details = postage_options[1];
    }
    else if (postage_options[1].type === 'return') {
      postage_send_details = postage_options[0];
    }
    var htmlResult = [];
    if (postage_send_details.title === "You'll post your documents from the UK") {
      htmlResult.push(['<p>Using <span style="">Royal Mail tracked delivery</span>, send us your documents with a printout of your application cover sheet or this email: </p>']);
      htmlResult.push(['<p><span>Legalisation Office / CSC<br/>' +
      'Foreign and Commonwealth Office<br/>' +
      'PO Box 6255<br/>' +
      'Milton Keynes<br/>' +
      'MK10 1XX' +
      '</span></p>']);
    }
    else {
      htmlResult.push(['<p>Using <span style="">Courier recorded delivery</span>, send us your documents with a printout of your application cover sheet or this email: </p>']);
      htmlResult.push(['<p><span>Legalisation Office / CSC<br/>' +
      'Foreign and Commonwealth Office<br/>' +
      ' Hanslope Park <br/>' +
      'Hanslope  <br/>' +
      ' Milton Keynes<br/>' +
      ' MK19 7BH' +
      '</span></p> ']);
    }
      return htmlResult;
  },
    getDocumentTitles: function(req, doc_ids) {
        return new Promise(function (resolve, reject) {
            if (req.session && req.session.docsNotCertified) {
                //just return this directly from session
                resolve(req.session.docsNotCertified);
            } else
            {
                return sequelize.query('SELECT "doc_title", "doc_title_start", "doc_title_mid", "html_id" FROM "AvailableDocuments" where "doc_id" = ANY(array['+doc_ids+'])')
                    .then(function (docs) {
                        req.session.docsNotCertified = docs[0];
                        resolve(docs);
                    })
                    .catch(function (error) {
                        reject(error);
                    });
            }
        });
    },

    getAllDocuments: function(req) {
        return new Promise(function (resolve, reject) {
            if (req.session && req.session.allDocuments) {
                //just return this directly from session
                resolve(req.session.allDocuments);
            }
            else {
                //populate session from db
                sequelize.query('SELECT * FROM "AvailableDocuments" order by doc_title')
                    .then(function (docs) {
                        req.session.allDocuments = docs;
                        resolve(docs);
                    })
                    .catch(function (error) {
                        reject(error);
                    });
            }
        });
    },

    buildSqlToGetAllUserDocInfo: function(req) {
        var selectedDocuments = req.session.selectedDocuments;
        var getSelectedDocInfoSql = 'SELECT u.user_doc_id, b.legislation_allowed, b.photocopy_allowed, b.certification_required, b.certification_notes, ' +
            ' b.doc_title, b.doc_title_start, b.doc_title_mid, b.doc_id, b.html_id, b.additional_detail, b.eligible_check_option_1, b.eligible_check_option_2, b.eligible_check_option_3, b.eligible_check_option_4,' +
            ' b.legalisation_clause, b.kind_of_document, b.accept_text, b.extra_title_text ' +
            ' from "AvailableDocuments" b inner join "UserDocuments" u on b.doc_id = u.doc_id where u.application_id = ' + req.session.appId;

        if (selectedDocuments && selectedDocuments.totalQuantity > 0) {
            getSelectedDocInfoSql += ' AND (';

            /**
             * Loop thru the json array of selected documents
             */
            selectedDocuments.documents.forEach(function (doc, index, array) {
                getSelectedDocInfoSql += " b.doc_id=" + doc.doc_id + " ";
                if (index < array.length - 1) {
                    getSelectedDocInfoSql += " OR ";
                }
            });
            getSelectedDocInfoSql += ') order by u.user_doc_id';
        }

        return getSelectedDocInfoSql;
    },

    getFilteredDocuments: function(query) {
        return sequelize.query('SELECT * FROM find_documents(:keywords)',
            {
                replacements: {
                    keywords: query
                },
                type: sequelize.QueryTypes.SELECT
            });
    },

    getSelectedDocuments: function(req) {
        if (req.session && req.session.selectedDocuments){
            return req.session.selectedDocuments;
        }
        else{
            return {
                totalDocCount: 0,
                documents: []
            };
        }
    },

    addSelectedDocId: function(req, doc_id, quantity) {
        var selectedDocuments;
        var totalQuantity = 0;
        var exists = false;
        return new Promise(function (resolve, reject) {
            if (req.session.selectedDocuments) {
                //check if the document is already there
                selectedDocuments = req.session.selectedDocuments;
                for (var i = 0; i < selectedDocuments.documents.length; i++) {
                    if (selectedDocuments.documents[i].doc_id == doc_id) {
                        //item is already there, just update the quantity
                        exists = true;
                        selectedDocuments.documents[i].quantity = quantity;
                    }
                    totalQuantity += selectedDocuments.documents[i].quantity;
                }
            }
            else {
                selectedDocuments = {
                    totalQuantity: 0,
                    documents: []
                };
            }

            if (!exists) {
                getDocument(req, doc_id).then(function (docDetails) {
                    var selectedDoc = {
                        doc_id: doc_id,
                        doc_title: docDetails[0].doc_title,
                        doc_title_start: docDetails[0].doc_title_start,
                        doc_title_mid: docDetails[0].doc_title_mid,
                        quantity: quantity,
                        html_id: docDetails[0].html_id,
                        timestamp:new Date().getTime()
                    };

                    selectedDocuments.totalQuantity = totalQuantity + quantity;
                    selectedDocuments.documents.push(selectedDoc);
                    req.session.selectedDocuments = selectedDocuments;
                    resolve(selectedDocuments);
                }).catch(function (error) {
                    console.log(error);
                    reject(error);
                });
            }
            else {
                req.session.selectedDocuments = selectedDocuments;
                resolve(selectedDocuments);
            }
        });

    },

    removeSelectedDocId: function(req, docId) {
        var  selectedDocuments = {
            totalQuantity: 0,
            documents: []
        };
        var totalQuantity = 0;
        return new Promise(function (resolve, reject) {
            if (req.session.selectedDocuments) {
                //check if the document is already there
                selectedDocuments = req.session.selectedDocuments;
                for (var i = selectedDocuments.documents.length-1; i >= 0; i--) {
                    if (selectedDocuments.documents[i].doc_id == docId) {
                        //remove the item
                        selectedDocuments.documents.splice(i, 1);
                    }
                    else {
                        totalQuantity += selectedDocuments.documents[i].quantity;
                    }
                }
            }
            selectedDocuments.totalQuantity = totalQuantity;
            req.session.selectedDocuments = selectedDocuments;
            resolve(selectedDocuments);
        });
    },

    updateSelectedDocQuantities: function(req) {
        var selectedDocuments;
        var totalQuantity = 0;
        var exists = false;
        return new Promise(function (resolve, reject) {
            if (req.session.selectedDocuments) {
                selectedDocuments = req.session.selectedDocuments;
                for (var i = 0; i < selectedDocuments.documents.length; i++) {
                    if (req.param(selectedDocuments.documents[i].doc_id)){
                        selectedDocuments.documents[i].quantity = parseInt(req.param(selectedDocuments.documents[i].doc_id));
                    }
                    totalQuantity += selectedDocuments.documents[i].quantity;
                }
            }
            else {
                selectedDocuments = {
                    totalQuantity: 0,
                    documents: []
                };
            }

            selectedDocuments.totalQuantity = totalQuantity;
            req.session.selectedDocuments = selectedDocuments;
            resolve(selectedDocuments);
        });
    },

    writeSelectedDocsToDb: function(req) {
        var selectedDocuments;
        var totalQuantity = 0;
        var exists = false;
        return new Promise(function (resolve, reject) {
            UserDocuments.destroy({where:{application_id: req.session.appId}}).then(function (done) {
                if (req.session.selectedDocuments) {
                    selectedDocuments = req.session.selectedDocuments;
                    var promises = [];
                    for (var i = 0; i < selectedDocuments.documents.length; i++) {
                        promises.push(UserDocuments.create({
                            application_id: req.session.appId,
                            doc_id: selectedDocuments.documents[i].doc_id,
                            certified: false,
                            this_doc_count: selectedDocuments.documents[i].quantity
                        }));
                    }
                    return Promise.all(promises)
                        .then(function () {
                            resolve(true);
                        })
                        .catch(function (err) {
                            reject(false);
                        });
                }
            }).catch(function (err) {
                reject(false);
            });
        });
    },

    generateNewApplicationId: function(data, selectedServiceType) {
        var output = data.lastUsedID + '';
        while (output.length < 4) {
            output = '0' + output;
        }
        var next;
        if (data.lastUsedID == 9999) {
            next = 0;
        }
        else {
            next = data.lastUsedID + 1;
        }
        data.updateAttributes({
            lastUsedID: next
        });

        //A-X-YY-MMDD-nnnn-ZZZZ
        //
        //A = always set to A
        //X = set to A, B or C depending on application type. A is premium, B is MK drop off, C is postal
        //YY = year e.g. 16
        //MMDD = month and day e.g. 0203
        //nnnn = sequence of numbers from 0000-9999.
        //ZZZZ  = random characters,

        var applicationType = '';
        switch (selectedServiceType) {
            case '1':
                applicationType = 'C';
                break;
            case '2':
                applicationType = 'A';
                break;
            case '3':
                applicationType = 'B';
                break;
        }

        var formattedDate = moment(new Date()).format("YY-MMDD");

        var uniqueApplicationId = 'A-' + applicationType + '-' + formattedDate + '-' + output + '-' + HelperService.randomValueHex(4).toUpperCase();

        return uniqueApplicationId;

    }
};

module.exports = HelperService;
