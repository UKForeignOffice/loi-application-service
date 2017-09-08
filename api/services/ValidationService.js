var ValidationService ={
    /**
     * Standard form validator.  This is used on all pages except the Address page.
     * This will be neatened up once the address page is completed
     * @param error
     * @param erroneousFields
     * @returns {Array|*}
     */
    validateForm: function (inputs) {
        var errors = inputs.error.errors;

        var erroneousFields = inputs.erroneousFields;

        var temp = {};
        var bulkErrors = [];
        var errMsgs = [];

        var fieldName;
        var fieldError;
        var fieldSolution;
        var questionId;

        fieldsAndErrors = [];

        if (errors.length > 0) {
            for (var h = 0; h < errors.length; h++) {
              console.log(errors[h].message);
                var errArr = JSON.parse(errors[h].message);

                fieldName = errArr[0].questionId;
                fieldError = errArr[0].errInfo;
                fieldSolution = errArr[0].errSoltn;
                questionId = errArr[0].questionId;

                errMsgs.push(
                    {
                        fieldName: fieldName,
                        fieldError: fieldError,
                        fieldSolution: fieldSolution,
                        questionId: questionId
                    }
                );
            }

            fieldsAndErrors.push([{errMsgs: errMsgs}]);
            fieldsAndErrors.push([{erroneousFields: erroneousFields}]);
        }
        //console.log(errMsgs, erroneousFields)

        return fieldsAndErrors;
    },

    /**
     * Build custom error array from parameters compiled from one of the forms
     * @param fieldName
     * @param fieldError
     * @param fieldSolution
     * @param questionId
     * @returns {Array|*}
     */
    buildCustomError: function (fieldName, fieldError, fieldSolution, questionId) {
        try {
            fieldsAndErrorsCustom = [];
            fieldsAndErrorsCustom.push({
                fieldName: fieldName,
                fieldError: fieldError,
                fieldSolution: fieldSolution,
                questionId: questionId
            });
            return fieldsAndErrorsCustom;
        } catch (error) {
            sails.log(error);
            console.log(error);
        }

    },
    /**
     * Build the error array specifically for when
     * - creating just a main address,
     * - updating just a main address,
     * - creating a main address and creating an alt address
     * - updating a main address and creating an alt address,
     * - updating a main address and updating an alt address
     * - updating a main address and removing an alt address.
     * @param error
     * @param req
     * @param res
     * @returns {*}
     */
    buildAddressErrorArray: function (error, req, res) {
        //Postcode validation
        var country = req.body.country || '';
        var Postcode = require("postcode");
        var postcodeObject = new Postcode(req.body.postcode.replace(/ /g,''));
        var postcode = ' ';
        if(country!='United Kingdom' ){
            postcode =  req.param('postcode').trim().length===0 ? ' ' : req.param('postcode').length > 1 ? req.param('postcode') : postcode;
        }
        else{
            postcode =  postcodeObject.valid() ? postcodeObject.normalise() :'';
        }

        erroneousFields = [];
        if (req.param('full_name') === '') {
            erroneousFields.push('full_name');
        }
        if (postcode === '' || postcode.length >20) {
            erroneousFields.push('postcode');
        }
        if (req.param('house_name') === '') {
            erroneousFields.push('house_name');
        }
        if (req.param('street') === '') {
            erroneousFields.push('street');
        }
        if (req.param('town') === '') {
            erroneousFields.push('town');
        }
        if (req.param('country') === '' || typeof (req.param('country')) === 'undefined') {
            erroneousFields.push('country');
        }

        if (req.param('is_same') === false || req.param('is_same') == 'false') {
            if (req.param('full_name') === '') {
                erroneousFields.push('full_name');
            }
            if (req.param('postcode') === '' || req.param('postcode').length >20) {
                erroneousFields.push('postcode');

            }
            if (req.param('house_name') === '') {
                erroneousFields.push('house_name');
            }
            if (req.param('street') === '') {
                erroneousFields.push('street');
            }
            if (req.param('town') === '') {
                erroneousFields.push('town');
            }

            if (req.param('country') === '') {
                erroneousFields.push('country');
            }

            if (req.param('telephone') === '') {
              erroneousFields.push('telephone');
            }

            if (req.param('email') === '') {
              erroneousFields.push('email');
            }
        }

        var dataValues = [];
        dataValues.push(
            [{
                full_name: req.param('full_name') !== '' && req.param('full_name') !== undefined && req.param('full_name') != 'undefined'  ? req.param('full_name') : "",
                organisation: req.param('organisation') !== '' && req.param('organisation') !== undefined && req.param('organisation') != 'undefined'  ? req.param('organisation') : "",
                postcode:  req.param('postcode') !== '' && req.param('postcode') !== undefined && req.param('postcode') != 'undefined'  ? req.param('postcode') : "",
                house_name: req.param('house_name') !== '' && req.param('house_name') !== undefined && req.param('house_name') != 'undefined' ? req.param('house_name') : "",
                street: req.param('street') !== '' && req.param('street') !== undefined && req.param('street') != 'undefined'  ? req.param('street') : "",
                town: req.param('town') !== '' && req.param('town') !== undefined && req.param('town') != 'undefined'  ? req.param('town') : "",
                county: req.param('county') !== '' && req.param('county') !== undefined && req.param('county') != 'undefined'  ? req.param('county') : "",
                country: req.param('country') !== '' && req.param('country') !== undefined && req.param('country') != 'undefined'  ? req.param('country') : "",
                telephone: req.param('telephone') !== '' && req.param('telephone') !== undefined && req.param('telephone') != 'undefined'  ? req.param('telephone') : "",
                email: req.param('email') !== '' && req.param('email') !== undefined && req.param('email') != 'undefined'  ? req.param('email') : ""
            }]
        );



        var options = {
            user_data:      HelperService.getUserData(req, res),
            error_report:   ValidationService.validateForm({error: error, erroneousFields: erroneousFields}),
            address_type:   req.body.address_type,
            user_address:   req.session.user_addresses[req.body.address_type],
            addresses:      req.session.user_addresses[req.body.address_type].addresses,
            chosen_address: req.session.user_addresses[req.body.address_type].last_address_chosen,
            form_values:    dataValues[0][0],
            summary:        req.session.summary,
            countries:      []
        };
        var view = "applicationForms/address/UKAddress.ejs";

        if(req.body.country != 'United Kingdom'){
            view = "applicationForms/address/IntlAddress.ejs";
        }else if(JSON.parse(req.body.manual)){
            view = "applicationForms/address/UKManualAddress.ejs";
        }

        return LocationService.getCountries().then(function (countries, err) {
            options.countries = countries[0];
            return res.view(view, options);
        });


    }
};

module.exports = ValidationService;
