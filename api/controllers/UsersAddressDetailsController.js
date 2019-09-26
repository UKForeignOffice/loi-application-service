/**
 * UsersAddressDetailsController module.
 * @module Controller UsersAddressDetailsController
 */

var applicationController   = require('./ApplicationController'),
    summaryController       = require('./SummaryController'),
    UserModels = require('../userServiceModels/models.js');

/**
 * Boolean to denote the users country in the address details page has been changed, meaning the Return Postage type
 * will need updating to a method that is permitted in the new country.
 * @type {boolean}
 */
var countryHasChanged= false;

var UsersAddressDetailsCtrl = {
    /**
     * addressStart -
     * 1. Sets the user_addresses session variable if not already set.
     * 2. Creates redirect link either to saved addresses or standard address input
     *
     * @return redirect to relevant page
     */
    addressStart: function(req,res){
        if(typeof (req.session.full_name)=='undefined'){
            //IF user has tried to access page via url instead of following normal route.
            return res.redirect('/provide-your-details');
        }
        if(req.session.user_addresses === null) {
            req.session.user_addresses = {
                started: true,
                main: {
                    submitted: false,
                    uk: null,
                    manual: null,
                    address: {
                        full_name: req.session.full_name,
                        postcode: null,
                        organisation: null,
                        house_name: null,
                        street: null,
                        county: null,
                        country: null,
                        telephone: null,
                        mobileNo: null,
                        email: null
                    },
                    addresses: null,             //From Postcode search
                    last_address_chosen: null   //From select address

                },
                alternative: {
                    submitted: false,
                    uk: null,
                    manual: null,
                    address: {
                        full_name: req.session.full_name,
                        postcode: null,
                        house_name: null,
                        organisation: null,
                        street: null,
                        county: null,
                        country: null,
                        telephone: null,
                        mobileNo: null,
                      email: null
                    },
                    addresses: null,             //From Postcode search
                    last_address_chosen: null   //From select address
                }

            };
        }

        var redirectLink = HelperService.getUserData(req,res).loggedIn && req.session.savedAddressesChosen[0]!=-3?  'your-saved-addresses':'/your-main-address-details';

        return res.redirect(redirectLink);
    },

    /**
     * showUKQuestion - Displays UK question page
     * @return UKQuestion view
     */
    showUKQuestion: function(req,res){
        var address_type = req.path == '/your-main-address-details' ? 'main' : 'alternative';
        var options = {
            user_data       : HelperService.getUserData(req,res),
            error_report    : req.flash('error'),
            address_type    : address_type,
            user_address    : req.session.user_addresses[address_type],
            summary         : req.session.summary
        };

        return res.view("applicationForms/address/UKQuestion.ejs", options);
    },

    /**
     * submitUKQuestion - Deals with UK question response
     * @param req.param('is_uk') - UK question response true or false
     * 1. Checks if response given, if not return erroneous response
     * 2. Prepares options
     * 3.1. If UK AND an address has been found using postcode lookup:
     *      @return redirect straight to UK address view
     * 3.2. If UK AND address hasn't been chosen yet:
     *      @return postcode entry view
     * 3.3. If international:
     *      @return redirect to international address endpoint
     */
    submitUKQuestion: function(req,res){
        var address_type = req.path === '/your-main-address-uk' ? 'main' : 'alternative';
        var valid_input = typeof(req.body) !== 'undefined' && typeof(req.body.is_uk) !== 'undefined';
        valid_input = typeof(req.query.is_uk) == 'undefined' ? valid_input : true;
        if(!valid_input){
            // ERROR HANDLING
            req.flash('error','Confirm whether the return address is in the UK');
            var error_redirect = '/your-'+address_type+'-address-details';
            return res.redirect(error_redirect);
        }
        else {

          // set up variables to aid with telephone
          // and email pre-population
          var contact_telephone = '';
          var contact_mobileNo = ';'
          var contact_email = '';

          var uk;

          // get user telephone and email address
          // from user basic details so it can be
          // used to pre-populate address telephone
          // and email fields
          UsersBasicDetails.findOne({where: {
              application_id:req.session.appId
            }}
          ).then(function(data) {

            if (data !== null){
              contact_telephone = data.telephone;
              contact_mobileNo = data.mobileNo;
              contact_email = data.email;
            }

            var options = {
              user_data: HelperService.getUserData(req, res),
              error_report: req.flash('error'),
              address_type: address_type,
              user_address: req.session.user_addresses[address_type],
              summary: req.session.summary,
              contact_telephone: contact_telephone,
              contact_mobileNo: contact_mobileNo,
              contact_email: contact_email
            };
            if (typeof(req.query.is_uk) !== 'undefined') {
              uk = JSON.parse(req.query.is_uk);
            } else {
              uk = req.body.is_uk !== null ? JSON.parse(req.body.is_uk) : true; //Convert string to boolean
            }

            if(uk){
              if( req.session.user_addresses[address_type].address.country==='United Kingdom' && req.session.user_addresses[address_type].last_address_chosen !== null) {
                return res.redirect('/modify-your-address-details?address_type='+address_type);
              }else{
                return res.view('applicationForms/address/UKAddressPostcodeEntry.ejs', options);
              }
            }else{
              return res.redirect('/international-'+address_type+'-address');
            }


          }).catch( function(error) {
              sails.log(error);
              console.log(error);
            });

        }
    },

    /**
     * findPostcode - Takes a postcode input and returns addresses
     * 1. function compileAddresses():
     *      1.1. Uses LocationService.postcodeLookup function
     *      1.2. Organises the resulting list
     * 2. Adds addresses to user_addresses session variable- for use later
     * 3. Prepare options and return UK address select view
     * @return view UKAddressSelect
     */
    findPostcode: function(req,res) {
        var Postcode = require("postcode");
        var postcode = '';

        var address_type = req.path == '/find-your-main-address' ? 'main' : 'alternative';
        if(!req.body && !req.query){
            return res.redirect('your-'+address_type+'-address-uk?is_uk=true');
        }else if(req.query && req.query.postcode){
            postcode = new Postcode(req.query.postcode.replace(/ /g,''));
        }else{
            postcode = new Postcode(req.body['find-postcode'].replace(/ /g,''));
        }


        if(!postcode.valid()){
            req.flash('error', 'Enter a valid postcode');
            var options = {
                user_data: HelperService.getUserData(req, res),
                error_report: req.flash('error'),
                address_type: address_type,
                user_address: req.session.user_addresses[address_type],
                addresses: false,
                postcode: req.param('find-postcode'),
                summary: req.session.summary
            };

            return  res.view("applicationForms/address/UKAddressSelect.ejs",options);
        }else {
            LocationService.postcodeLookup( postcode.normalise()).then(function (results) {
                function compileAddresses() {
                    var addresses = [];
                    if (JSON.parse(results).message == 'No matching address found: no response') {
                        req.flash('error', 'No addresses found');
                        addresses = false;
                    } else {
                        var jsonResults = JSON.parse(results);
                        addresses = [];
                        jsonResults.forEach(function (address) {


                            var fullAddress = '';
                            fullAddress += address.organisation ? address.organisation + ', ' : '';
                            fullAddress += address.house_name   ? address.house_name + ', ' : '';
                            fullAddress += address.street       ? address.street + ', ' : '';
                            fullAddress += address.town         ? toTitleCase(address.town)  : '';
                            fullAddress += address.county       ?  ', '+address.county : '';


                            function toTitleCase(str) {
                                return str.replace(/\w\S*/g, function (txt) {
                                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                                });
                            }

                            addresses.push({
                                option: fullAddress,
                                organisation: address.organisation,
                                house_name: address.house_name,
                                street: address.street !== null && address.street !== 'undefined' && address.street !== undefined ? address.street : '',
                                town: address.town !== null && address.town !== 'undefined' && address.town !== undefined ? toTitleCase(address.town) : '',
                                county: address.county !== null && address.county !== 'undefined' && address.county !== undefined ? address.county : '',
                                postcode:  postcode.normalise()
                            });
                        });
                    }
                    return addresses;
                }

                //Add to session
                req.session.user_addresses[address_type].addresses = compileAddresses();

                var options = {
                    user_data: HelperService.getUserData(req, res),
                    error_report: req.flash('error'),
                    address_type: address_type,
                    user_address: req.session.user_addresses[address_type],
                    addresses: compileAddresses(),
                    postcode:  postcode.normalise(),
                    summary: req.session.summary
                };

                return res.view("applicationForms/address/UKAddressSelect.ejs", options);
            },
              function(err)
              {
                console.log(err)
                req.flash('error', 'Enter your address manually instead');
                var options = {
                  user_data: HelperService.getUserData(req, res),
                  error_heading: 'Postcode search is not available at the moment',
                  error_report: req.flash('error'),
                  address_type: address_type,
                  user_address: req.session.user_addresses[address_type],
                  addresses: false,
                  postcode: '',
                  summary: req.session.summary
                };
                return  res.view("applicationForms/address/UKAddressSelect.ejs",options);
              });
        }
    },
    /**
     * ajaxFindPostcode - Takes a postcode input and returns addresses
     * 1. function compileAddresses():
     *      1.1. Uses LocationService.postcodeLookup function
     *      1.2. Organises the resulting list
     * 2. Adds addresses to user_addresses session variable- for use later
     * 3. Prepare options and return UK address select view
     * @return results
     */
    ajaxFindPostcode: function(req,res) {
        var address_type = req.body.address_type;

        if(!req.body){
            return res.redirect('your-'+address_type+'-address-uk?is_uk=true');
        }
        var Postcode = require("postcode");
        var postcode = new Postcode(req.body['find-postcode'].replace(/ /g,''));

        if(!postcode.valid()){
            return  res.json({error:'Enter a valid postcode'});
        }else {
            LocationService.postcodeLookup( postcode.normalise()).then(function (results) {
                function compileAddresses() {
                    var return_error = false;
                    var addresses = [];
                    if (JSON.parse(results).message == 'No matching address found: no response') {
                        return_error = 'Enter a valid postcode';
                        addresses = false;
                    } else {
                        var jsonResults = JSON.parse(results);
                        addresses = [];
                        jsonResults.forEach(function (address) {
                            var fullAddress = '';
                            fullAddress += address.organisation ? address.organisation + ', ' : '';
                            fullAddress += address.house_name   ? address.house_name + ', ' : '';
                            fullAddress += address.street       ? address.street + ', ' : '';
                            fullAddress += address.town         ? toTitleCase(address.town)  : '';
                            fullAddress += address.county       ?  ', '+address.county : '';



                            function toTitleCase(str) {
                                return str.replace(/\w\S*/g, function (txt) {
                                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                                });
                            }

                            addresses.push({
                                option: fullAddress,
                                organisation: address.organisation,
                                house_name: address.house_name,
                                street: address.street !== null && address.street !== 'undefined' && address.street !== undefined ? address.street : '',
                                town: address.town !== null && address.town !== 'undefined' && address.town !== undefined ? toTitleCase(address.town) : '',
                                county: address.county !== null && address.county !== 'undefined' && address.county !== undefined ? address.county : '',
                                postcode:  postcode.normalise()
                            });
                        });
                    }
                    return {addresses: addresses, return_error: return_error};
                }

                //Add to session
                req.session.user_addresses[address_type].addresses = compileAddresses().addresses;

                return res.json( {error:compileAddresses().return_error, addresses: compileAddresses().addresses, postcode:  postcode.normalise()});
            },
              function(err)
              {
                console.log(err)
                return res.json({error:'Enter your address manually instead'});
              }
            );
        }
    },

    ajaxSelectAddress: function(req,res) {
        var address_type = req.body.address_type;
        req.session.user_addresses[address_type].last_address_chosen = req.param('chosen');
        return res.json({full_name:req.session.user_addresses[address_type].address.full_name,
            address: req.session.user_addresses[address_type].addresses[req.param('chosen')]});
    },

    /**
     * selectUKAddress- Takes an address index of the address chosen and returns that address
     * 1. Set last_address_chosen property in the user_addresses session variable- for later use
     * 2. Prepares the form_values that will populate the address form
     * 3. Prepare the view options
     * 4. Return the UK Address view
     * @param req.param('address') - index of the address chosen
     * @returns view UKAddress
     */
    selectUKAddress: function(req,res){
        var address_type = req.path == '/select-your-main-address' ? 'main' : 'alternative';
        if(!req.body){
            return res.redirect('your-'+address_type+'-address-uk?is_uk=true');
        }else if(!req.body.address){
            req.flash('error','Pick an address');
            return res.redirect('/find-your-'+address_type+'-address?postcode='+req.session.user_addresses[address_type].addresses[0].postcode);
        }

        var addresses = req.session.user_addresses[address_type].addresses;
        req.session.user_addresses[address_type].last_address_chosen = req.param('address');

      var contact_telephone = '';
      var contact_mobileNo = '';
      var contact_email = '';

      // get telephone and email from the users basic
      // details so we can pre-populate fields
      UsersBasicDetails.findOne({where: {
          application_id:req.session.appId
        }}
      ).then(function(data) {

        contact_telephone = data.telephone;
        contact_mobileNo = data.mobileNo;
        contact_email = data.email;

        var form_values = {
          full_name:  req.session.user_addresses[address_type].address.full_name,
          organisation: addresses[req.param('address')].organisation || '',
          house_name: addresses[req.param('address')].house_name || '',
          street:     addresses[req.param('address')].street,
          town:       addresses[req.param('address')].town,
          county:     addresses[req.param('address')].county,
          postcode:   addresses[req.param('address')].postcode,
          telephone:   addresses[req.param('address')].telephone,
          mobileNo:   addresses[req.param('address')].mobileNo,

          email:   addresses[req.param('address')].email
        };

        var options = {
          user_data: HelperService.getUserData(req, res),
          error_report: false,
          address_type: address_type,
          user_address: req.session.user_addresses[address_type],
          addresses:    addresses,
          form_values:  form_values,
          summary:      req.session.summary,
          contact_telephone:  contact_telephone,
          contact_mobileNo: contact_mobileNo,
          contact_email: contact_email
        };

        return res.view("applicationForms/address/UKAddress.ejs",options);

      }).catch( function(error) {
        sails.log(error);
        console.log(error);
      });

    },

    /**
     * showManualAddress - Display Manual address page (UK only)
     * 1. Prepare form_values IF updating
     * 2. Prepare options
     * 3. Return UK Manual Address view
     * @returns view UKManualAddress
     */
    showManualAddress: function(req,res){
        var addressType = req.path == '/your-main-address-manual' ? 'main' : 'alternative';
        var form_values = false;
        var contact_telephone = '';
        var contact_mobileNo = '';
        var contact_email = '';

      // get telephone and email from the users basic
      // details so we can pre-populate fields
      UsersBasicDetails.findOne({where: {
          application_id:req.session.appId
        }}
      ).then(function(data) {

        contact_telephone = data.telephone;
        contact_mobileNo = data.mobileNo;

        contact_email = data.email;

        if(req.session.user_addresses[addressType].submitted){
          var address = req.session.user_addresses[addressType].address;
          form_values = {
            full_name:  address.full_name,
            organisation: address.organisation,
            house_name: address.house_name,
            street:     address.street,
            town:       address.town,
            county:     address.county,
            postcode:   address.postcode,
            country:    address.country,
            telephone:  address.telephone,
            mobileNo: address.mobileNo,
            email: address.email
          };
        }
        var options = {
          user_data       : HelperService.getUserData(req, res),
          error_report    : false,
          address_type    : addressType,
          user_address    : req.session.user_addresses[addressType],
          form_values     : form_values,
          summary         : req.session.summary,
          contact_telephone:contact_telephone,
          contact_mobileNo  :contact_mobileNo,

          contact_email   : contact_email
        };
        return res.view('applicationForms/address/UKManualAddress.ejs',options);

      }).catch( function(error) {
        sails.log(error);
        console.log(error);
      });

    },

    /**
     * showSameQuestion - Displays alternative address question view
     * IF same variable == true then 'Same address as before' is highlighted,
     * IF false then different is highlighted
     * and IF null neither is highlighted
     * @returns view SameQuestion
     */
    showSameQuestion: function(req,res){
        return res.view('applicationForms/address/SameQuestion.ejs', {
            user_data: HelperService.getUserData(req,res),
            same: req.session.sameChosen,
            error_report: req.flash('error'),
            summary: req.session.summary,
            main_address: req.session.user_addresses.main.address
        });
    },

    /**
     * useSameResponse - Deals with Same question response
     * @param req.param('is_same') - question answer (true or false)
     * 1. Error handling- IF no option is chosen
     *      @return Error message
     * 2. IF 'Same address as before':
     *      2.1. Removes any existing alternative address from database and session variables
     *      2.2. Redirect to relevant page: either summary page or document count
     * 3. IF 'Different address'
     *      3.1. Redirect to relevant page: either saved alternative addresses or standard altertive address input
     * @returns  redirect to relevant page based upon answer
     */
    useSameResponse: function(req,res){
        //ERROR HANDLING
        if(typeof(req.param('is_same')) == 'undefined'){
            req.flash('error','Confirm whether you want us to use the same address as before');
            return res.redirect('/alternative-address');
        }
        if (JSON.parse(req.param('is_same'))) {
            req.session.sameChosen = true;
            AddressDetails.findOne({where: {application_id:req.session.appId, type:  'alt' }})
                .then(function (data) {
                    // Remove any existing alternative address
                    if (data !== null) {
                        AddressDetails.destroy(
                            {
                                where: {
                                    application_id: req.session.appId,
                                    type: 'alt'
                                }
                            })
                            .then(function () {
                                req.session.user_addresses.alternative = {
                                    submitted: false,
                                    uk: null,
                                    manual: null,
                                    address: {
                                        full_name: req.session.full_name,
                                        postcode: null,
                                        house_name: null,
                                        street: null,
                                        county: null,
                                        country: null,
                                        telephone: null,
                                        mobileNo: null,
                                        email: null
                                    },
                                    addresses: null,             //From Postcode search
                                    last_address_chosen: null   //From select address
                                };
                                if (req.session.summary)
                                {
                                    return res.redirect('/review-summary');
                                } else {
                                    req.session.altAddress = false;
                                    return res.redirect('/how-many-documents');
                                }
                            })
                            .catch(function (err) {
                                sails.error.log(err);
                            });
                    } else {
                        if (req.session.summary) {
                            return res.redirect('/review-summary');
                        } else {
                            req.session.altAddress = false;
                            return res.redirect('/how-many-documents');
                        }
                    }
                });
        } else {
            //Check if only address has already been chosen
            if(req.session.savedAddressesChosen[0]>0 && req.session.savedAddressCount==1 ) {
                //Do nothing
            }else{
                if(HelperService.getUserData(req,res).loggedIn && req.session.savedAddressesChosen[1]!=-3 ){
                    return res.redirect('/your-saved-addresses-alternative');
                }
            }
            return res.redirect('/your-alternative-address-details');
        }
    },

    /**
     * showIntlAddress - Displays international address form view
     * 0. IF address has already been entered then populate form values.
     * 1. Prepare options
     * 2. Get countries list and add to options JSON
     * 3. Return International Address view
     * @returns view IntlAddress
     */
    showIntlAddress: function(req,res){
        var addressType = req.path == '/international-main-address' ? 'main' : 'alternative';
        var form_values = false;
        var contact_telephone = '';
        var contact_mobileNo = '';

      var contact_email = '';

      // get telephone and email from the users basic
      // details so we can pre-populate fields
      UsersBasicDetails.findOne({where: {
          application_id:req.session.appId
        }}
      ).then(function(data) {

        contact_telephone = data.telephone;
        contact_email = data.email;
        contact_mobileNo = data.mobileNo;

        if(req.session.user_addresses[addressType].submitted){
          var address = req.session.user_addresses[addressType].address;
          form_values = {
            full_name:  address.full_name,
            organisation: address.organisation,
            house_name: address.house_name,
            street:     address.street,
            town:       address.town,
            county:     address.county,
            postcode:   address.postcode,
            country:    address.country,
            telephone:  address.telephone,
            mobileNo:   address.mobileNo,
            email:      address.email
          };
        }
        var options = {
          user_data       : HelperService.getUserData(req, res),
          error_report    : false,
          address_type    : addressType,
          user_address    : req.session.user_addresses[addressType],
          form_values     : form_values,
          countries       : [],
          summary         : req.session.summary,
          contact_telephone: contact_telephone,
          contact_mobileNo:   contact_mobileNo,
          contact_email: contact_email
        };

        return LocationService.getCountries().then(function (countries, err) {
          options.countries = countries[0];
          return res.view("applicationForms/address/IntlAddress.ejs", options);
        });

      }).catch( function(error) {
        sails.log(error);
        console.log(error);
      });

    },

    /**
     * submitAddress - Add or update address in database
     * @param req - all address params
     *
     * IF creating an address:
     *      1. Prepare create JSON
     *      2. Run create function
     *      3. IF successful add address to user_addresses session variable and call redirect()
     *      4. IF unsuccessful call ValidationService.buildAddressErrorArray
     * IF updating an address:
     *      1. Prepare update and where JSON
     *      2. Run update function
     *      3. IF successful add address to user_addresses session variable and call redirect()
     *      4. IF unsuccessful call ValidationService.buildAddressErrorArray
     * 5. Redirect function - Both create and update can redirect out the same way
     *      5.1. Set the last_address_chosen
     *
     */
    submitAddress: function(req,res){
        var isNumeric = require("isnumeric");
        var email = req.body.email;
        if (email === ''){
          email = null;
        }
      var mobileNo = req.body.mobileNo;
      if (mobileNo === '' ){
        mobileNo = null;
      }
        var country = req.body.country || '';
        var address_type = req.body.address_type;
        var Postcode = require("postcode");
        var postcodeObject = new Postcode(req.body.postcode.replace(/ /g,''));
        var postcode = ' ';
        if(country!='United Kingdom' ){
            postcode =  req.param('postcode').trim().length===0 ? ' ' : req.param('postcode').length > 1 ? req.param('postcode') : postcode;
        }
        else{
            postcode =  postcodeObject.valid() ? postcodeObject.normalise() :'';
        }

        if(!req.body.house_name ||  req.body.house_name.length===0){
            if(req.body.organisation && req.body.organisation.length>0 && req.body.organisation != 'N/A'){
                req.body.house_name = 'N/A';
            }
        }

        if(!req.session.user_addresses[address_type].submitted){
            //CREATE NEW ADDRESS
            var create_address = {
                application_id: req.session.appId,
                full_name:      req.body.full_name,
                organisation:   req.body.organisation,
                house_name: req.body.house_name,
                street:     req.body.street,
                town:       req.body.town,
                county:     req.body.county,
                postcode:   postcode,
                country:    country,
                type:       req.body.address_type=='main' ? 'main' : 'alt',
                telephone:  req.body.telephone,
                email:      email,
                mobileNo:   mobileNo

            };
            AddressDetails.create(create_address).then(function(){
                req.session.user_addresses[address_type].submitted = true;
                req.session.user_addresses[address_type].address = {
                    full_name:  req.body.full_name,
                    organisation:   req.body.organisation,
                    house_name: req.body.house_name,
                    street:     req.body.street,
                    town:       req.body.town,
                    county:     req.body.county,
                    postcode:   postcode,
                    country:    country,
                    telephone:  req.body.telephone,
                    email:      email,
                    mobileNo:   mobileNo
                };
                return redirect();

            }).catch(Sequelize.ValidationError, function (error) {
                sails.log(error);
                ValidationService.buildAddressErrorArray(error, req, res);
                return null;
            });
        }else{


          //UPDATE CURRENT ADDRESS
            var update_address = {
                full_name:  req.body.full_name,
                organisation:   req.body.organisation,
                house_name: req.body.house_name,
                street:     req.body.street,
                town:       req.body.town,
                county:     req.body.county,
                postcode:   postcode,
                country:    country,
                telephone:  req.body.telephone,
                email:      email,
               mobileNo:   mobileNo
            };
            var where = {where: {
                application_id:req.session.appId,
                type:  req.body.address_type=='main' ? 'main' : 'alt'
            }};

            AddressDetails.update(update_address,where).then(function(){
              req.session.user_addresses[req.body.address_type].submitted = true;
                req.session.user_addresses[req.body.address_type].address = {
                    full_name:  req.body.full_name,
                    organisation:   req.body.organisation,
                    house_name: req.body.house_name,
                    street:     req.body.street,
                    town:       req.body.town,
                    county:     req.body.county,
                    postcode:   postcode,
                    country:    country,
                    telephone:  req.body.telephone,
                    email:      email,
                    mobileNo:   mobileNo
                };
                return redirect();
            })
                .catch(Sequelize.ValidationError, function (error) {
                    sails.log(error);
                    ValidationService.buildAddressErrorArray(error, req, res);
                    return null;
                });

        }

        function redirect(){
            //If manual set last address chosen to null.
            if(JSON.parse(req.body.manual) || req.body.country != 'United Kingdom'){req.session.user_addresses[address_type].last_address_chosen=null;}

            if(req.session.summary){
                var countryChanged = false;
                if(req.body.address_type == 'main'){
                    countryChanged = req.body.country != req.session.country;
                }else{
                    req.session.sameChosen = false;
                }
                if(countryChanged) {
                    return summaryController.fetchAll(req, res, false, countryChanged);
                }else{
                    return res.redirect('/review-summary');
                }
            }
            else if(req.body.address_type == 'main'){
                return res.redirect('/alternative-address');
            }
            else if(req.body.address_type == 'alternative'){
                req.session.altAddress = true;
                req.session.sameChosen = false;
                return res.redirect('/how-many-documents');
            }
        }

    },

    /**
     * showEditUKAddress - Displays UK address edit screen (Postcode lookup)
     * This displays postcode lookup, postcode selector and current address
     * @returns view UKAddress
     */
    showEditUKAddress: function(req,res){
      var addresses = req.session.user_addresses[req.query.address_type].addresses,
            chosen_address  = req.session.user_addresses[req.query.address_type].last_address_chosen;

        var contact_telephone = '';
        var contact_mobileNo = '';
        var contact_email = '';

      // get telephone and email from the users basic
      // details so we can pre-populate fields
      UsersBasicDetails.findOne({where: {
          application_id:req.session.appId
        }}
      ).then(function(data) {

        contact_telephone = data.telephone;
        contact_mobileNo = data.mobileNo,
        contact_email = data.email;

        if (req.session.user_addresses[req.query.address_type].address.mobileNo !== null) {

          var form_values = {
            full_name: req.session.user_addresses[req.query.address_type].address.full_name,
            organisation: req.session.user_addresses[req.query.address_type].address.organisation,
            house_name: req.session.user_addresses[req.query.address_type].address.house_name,
            street: req.session.user_addresses[req.query.address_type].address.street,
            town: req.session.user_addresses[req.query.address_type].address.town,
            county: req.session.user_addresses[req.query.address_type].address.county,
            postcode: req.session.user_addresses[req.query.address_type].address.postcode,
            telephone: req.session.user_addresses[req.query.address_type].address.telephone,
            email: req.session.user_addresses[req.query.address_type].address.email,
            mobileNo: req.session.user_addresses[req.query.address_type].address.mobileNo

          };
        }
        else{
          var form_values = {
            full_name: req.session.user_addresses[req.query.address_type].address.full_name,
            organisation: req.session.user_addresses[req.query.address_type].address.organisation,
            house_name: req.session.user_addresses[req.query.address_type].address.house_name,
            street: req.session.user_addresses[req.query.address_type].address.street,
            town: req.session.user_addresses[req.query.address_type].address.town,
            county: req.session.user_addresses[req.query.address_type].address.county,
            postcode: req.session.user_addresses[req.query.address_type].address.postcode,
            telephone: req.session.user_addresses[req.query.address_type].address.telephone,
            email: req.session.user_addresses[req.query.address_type].address.email,
            mobileNo: ''

          };
        }

        var options = {
          user_data:      HelperService.getUserData(req, res),
          error_report:   false,
          address_type:   req.query.address_type,
          user_address:   req.session.user_addresses[req.query.address_type],
          addresses:      addresses,
          chosen_address: req.session.user_addresses[req.query.address_type].last_address_chosen,
          form_values:    form_values,
          summary:        req.session.summary,
          contact_telephone:  contact_telephone,
          contact_mobileNo:   contact_mobileNo,
          contact_email:   contact_email
        };

        return res.view("applicationForms/address/UKAddress.ejs",options);

      }).catch( function(error) {
        sails.log(error);
        console.log(error);
      });
    },

    /**
     * modifyAddressRouter - Router for modifying addresses BEFORE summary page is hit
     * Used to redirect user to relevant page for modifying addresses before the summary page has been reached
     * @returns redirect to relevant address modification page
     */
    modifyAddressRouter: function(req,res){
      var address_type = req.query.address_type;

        if(req.session.savedAddressesChosen[address_type=='main'? 0 : 1]>0) {
            return res.redirect('/your-saved-addresses'+(address_type=='main'? '' : '-alternative'));
        }
        else if(req.session.user_addresses[address_type].address.country === 'United Kingdom'){
            if(req.session.user_addresses[address_type].last_address_chosen===null){
                return res.redirect('your-'+address_type+'-address-manual');
            }else{
                return res.redirect('modify-your-address-details?address_type='+address_type);
            }
        }else{
            return res.redirect('international-'+address_type+'-address');
        }
    },

    /**
     * changeAddressRouter - Router for modifying addresses AFTER summary page is hit
     * Used to redirect user to relevant page for modifying addresses after the summary page has been reached
     * @returns redirect to relevant address modification page
     */
    changeAddressRouter: function(req,res){
      var address_type = req.query.address_type;

        if (address_type == 'main') {
            if(req.session.savedAddressesChosen[address_type=='main'? 0 : 1]>-2) {
                return res.redirect('/your-saved-addresses');
            }else{
                return res.redirect('/your-main-address-details');
            }
        }
        else {
            return res.redirect('/alternative-address');
        }

    },

    /**
     * showSavedAddresses - Displays saved addresses view
     * Finds all addresses belonging to logged in user and delivers savedAddressDetails view
     * If the user has no saved addresses then it redirects to the standard address input
     * @returns view savedAddressDetails
     */
    showSavedAddresses: function(req,res){
      if(req.path != '/your-saved-addresses' && req.session.savedAddressesChosen[0]>0 && req.session.savedAddressCount==1 ) {
            return res.redirect('/alternative-address');
        }else {
            var user_data = HelperService.getUserData(req, res);
            UserModels.SavedAddress.findAll({where: {user_id: user_data.user.id}, order: [['id', 'ASC']]}).then(function (savedAddresses) {
                if (user_data.loggedIn && savedAddresses !== null && savedAddresses.length !== 0) {
                    return res.view('applicationForms/address/savedAddressDetails.ejs', {
                        user_data: HelperService.getUserData(req, res),
                        savedAddresses: savedAddresses,
                        currentlySelected: req.session.savedAddressesChosen[(req.path === '/your-saved-addresses') ? 0 : 1],
                        type: (req.path === '/your-saved-addresses') ? 'main' : 'alternative',
                        error: req.flash('error'),
                        summary: req.session.summary
                    });
                } else {
                    req.session.savedAddressesChosen[(req.path === '/your-saved-addresses') ? 0 : 1] = -2; //-2 == Logged in but has no saved addresses
                    return res.redirect('/your-' + (req.path === '/your-saved-addresses' ? 'main' : 'alternative') + '-address-details');
                }
            });
        }

    },

  /**
   * manageSavedAddress - Updates the main or alternative address
   * if contact info is missing
   * @returns view alternative-address or how-many-documents
   */
    manageSavedAddress: function(req,res){

      // if you have just updated your main address contact details
      // enter this section
      if (req.session.require_contact_details_next_page === 'alternative-address'){

        // update your main address record associated with the current application
        // with the latest contact details
        AddressDetails.update(req.session.addressToUpdate,{ where:{
          application_id: req.session.appId,
          type:'main'
        }}).then(function () {

          // then update the address held in session so we can
          // display this on the alternative address screen
          req.session.user_addresses.main.address = {
            full_name: req.session.addressToUpdate.full_name,
            house_name: req.session.addressToUpdate.house_name,
            organisation:  req.session.addressToUpdate.organisation,
            street: req.session.addressToUpdate.street,
            town: req.session.addressToUpdate.town,
            county: req.session.addressToUpdate.county,
            country: req.session.addressToUpdate.country,
            postcode: req.session.addressToUpdate.postcode,
            telephone: req.session.addressToUpdate.telephone,
            email: req.session.addressToUpdate.email,
            mobileNo:   req.session.addressToUpdate.mobileNo};

          // clear all this stuff held in session
          req.session.addressToUpdate = '';
          req.session.require_contact_details_next_page = '';
          req.session.require_contact_details = 'no';

          return res.redirect('/alternative-address');
        });
      }

    // if you have just updated your alternative address contact details
    // enter this section
    if (req.session.require_contact_details_next_page === 'how-many-documents'){

      // update your alt address record associated with the current application
      // with the latest contact details
      AddressDetails.update(req.session.addressToUpdate,{ where:{
        application_id: req.session.appId,
        type:'alt'
      }}).then(function () {

        // then update the address held in session so we can use this elsewhere
        // on the site
        req.session.user_addresses.alternative.address = {
          full_name: req.session.addressToUpdate.full_name,
          house_name: req.session.addressToUpdate.house_name,
          organisation:  req.session.addressToUpdate.organisation,
          street: req.session.addressToUpdate.street,
          town: req.session.addressToUpdate.town,
          county: req.session.addressToUpdate.county,
          country: req.session.addressToUpdate.country,
          postcode: req.session.addressToUpdate.postcode,
          telephone: req.session.addressToUpdate.telephone,
          email: req.session.addressToUpdate.email,
          mobileNo: req.session.addressToUpdate.mobileNo};

        // clear all this stuff held in session
        req.session.addressToUpdate = '';
        req.session.require_contact_details_next_page = '';
        req.session.require_contact_details = 'no';

        return res.redirect('/how-many-documents');
      });
    }

    },

    /**
     * useSavedAddress - Used selected saved address or redirects to standard address input
     * 1. IF no selection was made then return saved address view with error
     * 2. IF user chose 'I'll enter a new address' redirect to relavent standard address input page
     * 3. IF user chose one of their addresses then:
     *      3.1. Get the address
     *      3.2. Check if address has already been entered
     *      3.3. Create or update address with saved address details and use redirect() function
     * 4. Redirect function
     *      4.1. Update session variables
     *      4.2. Redirect to relevant page
     */
    useSavedAddress: function(req,res){
        var redirectLink = '';
        var address_type =  req.body.address_type;
        if(typeof(req.param('savedAddressID'))=='undefined'){
            req.flash('error','Please select an option below');
            redirectLink= address_type == 'main'? '/your-saved-addresses': '/your-saved-addresses-alternative';
            return res.redirect(redirectLink);
        }
        else if(req.param('savedAddressID')==-1){
            req.session.savedAddressesChosen[address_type == 'main' ? 0 : 1] = -1; //-1= Not using saved address
            redirectLink = address_type == 'main' ? '/your-main-address-details' : '/your-alternative-address-details';
            return res.redirect(redirectLink);

        }else{
            req.session.require_contact_details = 'no';
            var user_data = HelperService.getUserData(req,res);
            UserModels.SavedAddress.findOne({where:{user_id:user_data.user.id, id:req.param('savedAddressID')}})
                .then(function(address) {
                    AddressDetails.findOne({
                        where: {
                            application_id:req.session.appId,
                            type: req.body.address_type == 'main' ? 'main' :'alt'
                        }
                    })  .then(function (data) {

                            // if no telephone number is found with your address
                            // set some session variables and also set the telephone
                            // number to be 'not found' so we can save the address and come
                            // back to it later
                            if (address.telephone === null){
                              address.telephone = 'not found';
                              req.session.require_contact_details = 'yes';
                              req.session.require_contact_details_back_link = req.body.address_type == 'main' ? 'your-saved-addresses' : 'alternative-address';
                              req.session.require_contact_details_next_page = req.body.address_type == 'main' ? 'alternative-address' : 'how-many-documents';
                            }
                            if (address.mobileNo === null){
                              address.mobileNo = 'not found';
                              req.session.require_contact_details = 'yes';
                              req.session.require_contact_details_back_link = req.body.address_type == 'main' ? 'your-saved-addresses' : 'alternative-address';
                              req.session.require_contact_details_next_page = req.body.address_type == 'main' ? 'alternative-address' : 'how-many-documents';
                            }
                            if (data === null) {
                                var create ={
                                    application_id: req.session.appId,
                                    type: req.body.address_type == 'main' ? 'main' :'alt',
                                    full_name: address.full_name,
                                    organisation:  address.organisation,
                                    house_name: address.house_name,
                                    street: address.street,
                                    town: address.town,
                                    county: address.county,
                                    country: address.country,
                                    postcode: address.postcode,
                                    telephone: address.telephone,
                                    email: address.email,
                                    mobileNo: address.mobileNo
                                };
                                AddressDetails.create(create)
                                    .then(function () {
                                        redirect(address);
                                    });

                            } else{
                                var update = {
                                    full_name: address.full_name,
                                    organisation:  address.organisation,
                                    house_name: address.house_name,
                                    street: address.street,
                                    town: address.town,
                                    county: address.county,
                                    country: address.country,
                                    postcode: address.postcode,
                                    telephone: address.telephone,
                                    email: address.email,
                                    mobileNo: address.mobileNo,

                                };
                                AddressDetails.update(update,{ where:{
                                    application_id: req.session.appId,
                                    type:req.body.address_type == 'main' ? 'main' :'alt'
                                }})
                                    .then(function () {
                                        redirect(address);
                                    });
                            }
                        });
                });

        }

        function redirect(address){
            req.session.savedAddressesChosen[address_type == 'main'? 0: 1] = req.param('savedAddressID');
            req.session.user_addresses[address_type].address = {
                full_name: address.full_name,
                house_name: address.house_name,
                organisation:  address.organisation,
                street: address.street,
                town: address.town,
                county: address.county,
                country: address.country,
                postcode: address.postcode,
                telephone: address.telephone,
                email: address.email,
                mobileNo: address.mobileNo};

            req.session.user_addresses[address_type].submitted = true;
            req.session.user_addresses[address_type].last_address_chosen = null;

            if(req.session.summary){
                var countryChanged = false;
                if(address_type == 'main'){
                    countryChanged = address.country != req.session.country;
                }
                if(countryChanged) {
                    return summaryController.fetchAll(req, res, false, countryChanged);
                }else{
                    return res.redirect('/review-summary');
                }
            }
            else if (address.telephone === 'not found'){
              return res.redirect(sails.config.customURLs.userServiceURL + '/edit-address?id=' + req.param('savedAddressID'));
            }
            else if (address.mobileNo === 'not found'){
              return res.redirect(sails.config.customURLs.userServiceURL + '/edit-address?id=' + req.param('savedAddressID'));
            }
            else if(address_type == 'main'){
                return res.redirect('/alternative-address');
            }
            else if(address_type == 'alternative'){
                req.session.altAddress = true;
                return res.redirect('/how-many-documents');
            }
        }
    }
};
module.exports = UsersAddressDetailsCtrl;
