/**
 * Created by preciousr on 22/02/2016.
 */

$(function () {

//01 Service choice selection page

    $('#standard-service').bind('click', function () {
        _paq.push(['trackEvent', '01 Service choice selection page', 'Standard Service']);
    });
    $('#premium-service').bind('click', function () {
        _paq.push(['trackEvent', '01 Service choice selection page', 'Premium Service']);
    });
    $('#dropoff-service').bind('click', function () {
        _paq.push(['trackEvent', '01 Service choice selection page', 'Dropoff Service']);
    });
    $('#sign-in-link').bind('click', function () {
        _paq.push(['trackEvent', '01 Service choice selection page', 'Click to sign in']);
    });
    $('.create-account-link').bind('click', function () {
        _paq.push(['trackEvent', '01 Service choice selection page', 'Click to create an account']);
    });



//02 Choose whether to do eligibility checks
    $('#check_documents').bind('click', function () {
        _paq.push(['trackEvent', '02 Choose whether to do eligibility checks', 'Check documents']);
    });

    $('#skip_check').bind('click', function () {
        _paq.push(['trackEvent', '02 Choose whether to do eligibility checks', 'Skip the check']);
    });

//  03 Eligibility checker interactions
    $('#documentFilter').bind('submit', function (e) {
        e.preventDefault();
        _paq.push(['trackEvent', '03 Eligibility checker interactions', 'Enter search term']);
        this.submit();
    });



    $('.add_text').bind('click', function () {
        _paq.push(['trackEvent', '03 Eligibility checker interactions', 'Add document']);
        _paq.push(['trackEvent', '03 Types of documents selected', $(this).closest('td').siblings().find('span').html()]);
    });
    $('.remove_text').bind('click', function () {
        _paq.push(['trackEvent', '03 Eligibility checker interactions', 'Remove document using the link in the result list']);
    });
    $('#basket-container .remove_link').bind('click', function () {
        _paq.push(['trackEvent', '03 Eligibility checker interactions', 'Remove document using the link in the basket']);
    });


    $('#az-list-link').bind('click', function () {
        _paq.push(['trackEvent', '03 Eligibility checker interactions', 'Go to A-Z document list from zero results page']);
    });

    //Event category: 04 Document format choice
    $('#confirmDocumentsForm').bind('submit', function (e) {
        e.preventDefault();
        $("#confirmDocumentsForm input").each(function(){
            if($(this).is(':checked')) {
                    _paq.push(['trackEvent', '04 Document format choice', $(this).attr('data-doc-type')]);
            }
        });
        this.submit();
    });


    //05 Confirm whether your document has been certified
    $('#documentsCertifiedConf').bind('submit', function (e) {
        e.preventDefault();
        $("#documentsCertifiedConf input").each(function(){
            if($(this).is(':checked')) {
                if($(this).val()=="yes"){
                    _paq.push(['trackEvent', '05 Confirm whether your document has been certified', 'Yes, certified']);
                }
                if($(this).val()=="no"){
                    _paq.push(['trackEvent', '05 Confirm whether your document has been certified', 'No, not certified']);
                }
            }
        });
        this.submit();
    });


// 06 Get your document certified, 'deadend' page interactions
    $('#print-this-page').bind('click', function () {
        _paq.push(['trackEvent', '06 Get your document certified, "deadend" page interactions', 'Click print page link']);
    });

    $('#email-this-page').bind('click', function () {
        _paq.push(['trackEvent', '06 Get your document certified, "deadend" page interactions', 'Use send to email option']);
    });

    $('#feedback-link').bind('click', function () {
        _paq.push(['trackEvent', '06 Get your document certified, "deadend" page interactions', 'Click feedback survey link']);
    });

// 07 Your details - do you have an email address?
    $('#yourDetailsForm').bind('submit', function (e) {
        e.preventDefault();
        if (($('input[name=has_email]:checked', '#yourDetailsForm').val())== "yes") {
            _paq.push(['trackEvent', '07 Your details - do you have an email address? ', 'Yes']);
        } else {
            _paq.push(['trackEvent', '07 Your details - do you have an email address? ', 'No']);
        }
        this.submit();
    });
//08 Successful return address - is the return address in the UK? or 09 Unsuccessful return address - is the return address in the UK?
    $('#is-uk').bind('submit', function (e) {
        e.preventDefault();
        if($('input[name=is_uk]:checked', '#is-uk').val()) {
            if (this.action.indexOf('/your-main-address-uk') != -1) {
                if (JSON.parse($('input[name=is_uk]:checked', '#is-uk').val()) === true) {
                    _paq.push(['trackEvent', '08 Successful return address - is the return address in the UK?', 'Yes, UK']);
                } else {
                    _paq.push(['trackEvent', '08 Successful return address - is the return address in the UK?', 'No, not UK']);
                }
            }
            else {
                if (JSON.parse($('input[name=is_uk]:checked', '#is-uk').val()) === true) {
                    _paq.push(['trackEvent', '09 Unsuccessful return address - is the return address in the UK?', 'Yes, UK']);
                } else {
                    _paq.push(['trackEvent', '09 Unsuccessful return address - is the return address in the UK?', 'No, not UK']);
                }
            }
        }
        this.submit();
    });

//08 Return address input interactions for UK addresses - aggregate view for successful and unsuccessful return addresses
    $('#find-address').bind('click', function () {
        _paq.push(['trackEvent', '08 Return address input interactions for UK addresses - aggregate view for successful and unsuccessful return addresses',
            'Execute postcode lookup']);
    });
    $('#address-list').change(function () {
        _paq.push(['trackEvent', '08 Return address input interactions for UK addresses - aggregate view for successful and unsuccessful return addresses',
            'Select returned address from postcode lookup']);
    });
    $('#address-manual').bind('click', function () {
        _paq.push(['trackEvent', '08 Return address input interactions for UK addresses - aggregate view for successful and unsuccessful return addresses',
            'Click link to enter address manually']);
    });

//09 Unsuccessful return address - use the same address if unable to legalise them?

    $('#is-same').bind('submit', function (e) {
        if ($('input[name=is_same]:checked', '#is-same').val() == "true") {

            _paq.push(['trackEvent', '09 Unsuccessful return address - use the same address if unable to legalise them?', 'Yes, same address']);
        } else {
            _paq.push(['trackEvent', '09 Unsuccessful return address - use the same address if unable to legalise them?', 'No, use a different address']);
        }
        e.preventDefault();
        this.submit();
    });

//10 Number of documents
    $('#document-count-form').bind('submit', function (e) {
        _paq.push(['trackEvent', '10 Number of documents', $('#documentCount').val()]);
        e.preventDefault();
        this.submit();
    });

    //11 How you will send your documents to the legalisation office
    $('#send-options-form').bind('submit', function (e) {
        e.preventDefault();

        switch ($('input[name=send_postage]:checked', '#send-options-form').val()) {
            case "4":_paq.push(['trackEvent', '11 How you will send your documents to the legalisation office?', 'Post in UK']);break;
            case "5":_paq.push(['trackEvent', '11 How you will send your documents to the legalisation office?', 'Courier in UK']); break;
            case "6":_paq.push(['trackEvent', '11 How you will send your documents to the legalisation office?', 'Overseas post or courier']); break;
        }
        this.submit();
    });

    //12 Choice for return post
    $('#return_address').bind('submit', function (e) {

            if ($('input[name=return_postage]', '#return_address').val() == "9") {
                _paq.push(['trackEvent', '12 Choice for return post', 'European courier']);
            }
            if ($('input[name=return_postage]', '#return_address').val() == "10") {
                _paq.push(['trackEvent', '12 Choice for return post', 'International courier']);
            }

            switch ($('input[name=return_postage]:checked', '#return_address').val()) {
                case "7":_paq.push(['trackEvent', '12 Choice for return post', 'Pre-paid envelope UK']);break;
                case "8":_paq.push(['trackEvent', '12 Choice for return post', 'Standard Royal Mail UK']); break;
            }


        e.preventDefault();

        this.submit();
    });


    //13 Feedback consent
    $('#additional_info').bind('submit', function (e) {
        if ($('input[name=feedback_consent]:checked', '#additional_info').val() == "true") {
            _paq.push(['trackEvent', '13 Feedback consent', 'Yes']);
        } else {
            _paq.push(['trackEvent', '13 Feedback consent', 'No']);
        }
        if ($('input[name=customer_ref]', '#additional_info').val().length >0) {
            _paq.push(['trackEvent', '13 Optional client reference', 'User entered a reference']);
        } else {
            _paq.push(['trackEvent', '13 Optional client reference', 'User did not enter a reference']);
        }

        e.preventDefault();
        this.submit();
    });
//17 Application confirmation page interactions

    $('#print-button').bind('click', function () {
        _paq.push(['trackEvent', '17 Application confirmation page interactions', 'Click print page link']);
    });
    $('#no-printer-link').bind('click', function () {
        _paq.push(['trackEvent', '17 Application confirmation page interactions', "Click I don't have a printer link"]);
    });

    $('#submit-application-feedback').bind('click', function () {
        _paq.push(['trackEvent', '17 Application confirmation page interactions', 'Click feedback survey link']);
    });

    $('#submit-application-start-new').bind('click', function () {
        _paq.push(['trackEvent', '17 Application confirmation page interactions', 'Click start a new application link']);
    });


    //Account 02 - dashboard interactions
    $('#dashboard-search-table-form').bind('submit', function (e) {
        _paq.push(['trackEvent', 'Account 02 - dashboard interactions', 'search applications']);
        e.preventDefault();
        this.submit();
    });

    $('.sortableHeader').bind('click', function (e) {
        _paq.push(['trackEvent', 'Account 02 - dashboard interactions', 'sort applications']);
    });

    $('#start').bind('click', function (e) {
        _paq.push(['trackEvent', 'Account 02 - dashboard interactions', 'click to start new application']);
    });

//Account 05 - application - use your saved contact details?
    $('#savedDetailsForm').bind('submit', function (e) {
        if ($('input[name=use_details]:checked', '#savedDetailsForm').val() == "true") {
            _paq.push(['trackEvent', 'Account 05 - application - use your saved contact details?', 'Yes']);
        } else {
            _paq.push(['trackEvent', 'Account 05 - application - use your saved contact details?', 'No']);
        }
        e.preventDefault();
        this.submit();
    });

    $('#savedAddressDetailsForm').bind('submit', function (e) {
        if ($('input[name=address_type]','#savedAddressDetailsForm').val()!='alternative') {
            //Account 06 - application - use your saved address for successfully legalised documents?
            if ($('input[name=savedAddressID]:checked', '#savedAddressDetailsForm').val() != -1) {
                _paq.push(['trackEvent', 'Account 06 - application - use your saved address for successfully legalised documents?', 'Yes']);

            } else {
                _paq.push(['trackEvent', 'Account 06 - application - use your saved address for successfully legalised documents?', 'No']);

            }
            e.preventDefault();
            this.submit();
        }else{
            // Account 07 - application - use your saved address for documents we are unable to legalise?
            if ($('input[name=savedAddressID]:checked', '#savedAddressDetailsForm').val() != -1) {
                _paq.push(['trackEvent', 'Account 07 - application - use your saved address for documents we are unable to legalise?', 'Yes']);

            } else {
                _paq.push(['trackEvent', ' Account 07 - application - use your saved address for documents we are unable to legalise?', 'No']);

            }
            e.preventDefault();
            this.submit();
        }

    });

    //Event category: Account 12 - navigation
    $('#Applications-Link').bind('click', function () {
        _paq.push(['trackEvent', 'Account 12 - navigation', 'click Applications link in navigation']);
    });
    $('#Account-Link').bind('click', function () {
        _paq.push(['trackEvent', 'Account 12 - navigation', 'click Account link in navigation']);
    });
    $('#Addresses-Link').bind('click', function () {
        _paq.push(['trackEvent', 'Account 12 - navigation', 'click Addresses link in navigation']);
    });
    $('#sign-out-link').bind('click', function () {
        _paq.push(['trackEvent', 'Account 12 - navigation', 'click Sign out link in navigation']);
    });




});