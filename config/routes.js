module.exports.routes = {
    'get /healthcheck': 'PublicController.healthcheck',

    ////////////////////////////////
    // ---- Login Dash ---- //
    ////////////////////////////////
    '/loading-dashboard': 'AuthController.loadDashboard',
    '/dashboard': 'DashboardController.dashboard',
    '/sign-out': 'AuthController.logout',
    '/session-expired': 'AuthController.sessionExpired',

    ////////////////////////////////
    // ---- Main View ---- //
    ////////////////////////////////

    '/': 'PublicController.startPage',
    '/terms-and-conditions': { view: 'legalPages/terms' },
    '/accessibility-statement': { view: 'legalPages/accessibilityStatement' },
    '/privacy-policy': { view: 'legalPages/privacy' },
    '/cookies': { view: 'legalPages/cookies' },
    '/cookie-details': { view: 'legalPages/cookiesDetails' },

    ////////////////////////////////
    // ---- Service Selector ---- //
    ////////////////////////////////

    // Select Application Type
    '/start': 'ApplicationTypeController.start',

    ///////////////////////////////
    // ---- New Application ---- //
    ///////////////////////////////

    // Start a new application
    '/select-service': 'ApplicationTypeController.serviceSelectorPage',
    '/urgent-service': 'ApplicationTypeController.serviceSelectorPageTemp',
    '/new-application': 'ApplicationTypeController.newApplication',
    '/change-application-type': 'ApplicationTypeController.serviceSelectorPage',

    ///////////////////////////////////////////////////////////////////////
    // ---- Document Selector, Eligibility and Certification Checks ---- //
    ///////////////////////////////////////////////////////////////////////

    // Show document selector
    '/choose-documents-or-skip': 'DocumentsCheckerController.docSelectorStart',
    '/select-documents': 'DocumentsCheckerController.docsSelector',
    '/add-document/:doc_id': 'DocumentsCheckerController.addSelectedDoc',
    '/remove-document/:doc_id': 'DocumentsCheckerController.removeSelectedDoc',
    '/query-documents/:query': 'DocumentsCheckerController.docsQuery',
    '/check-documents': 'DocumentsCheckerController.returnToSkipPage',
    '/a-to-z-document-listing': 'DocumentsCheckerController.azListing',
    '/add-document-ajax/:doc_id':
        'DocumentsCheckerController.addSelectedDocAjax',
    '/remove-document-ajax/:doc_id':
        'DocumentsCheckerController.removeSelectedDocAjax',
    '/get-last-search-ajax': 'DocumentsCheckerController.getLastSearch',

    // Show document selection and eligibility confirm page
    '/confirm-documents': 'DocumentsCheckerController.confirmDocuments',

    // Show document certified confirm page
    '/check-documents-eligible': 'DocumentsCheckerController.docsEligibleCheck',
    '/check-documents-certified/confirm':
        'DocumentsCheckerController.docsCertifiedCheckConfirmDeny',

    // file upload
    '/eapp-start-page': {
        view: 'eApostilles/startPage',
    },
    '/upload-files': 'FileUploadController.uploadFilesPage',
    '/upload-file-handler': 'FileUploadController.uploadFileHandler',
    '/delete-file-handler': 'FileUploadController.deleteFileHandler',

    'GET /additional-reference': 'EAppReferenceController.renderPage',
    'POST /additional-reference':
        'EAppReferenceController.addReferenceToSession',
    '/check-uploaded-documents': 'CheckUploadedDocumentsController.renderPage',
    '/add-docs-to-db-handler':
        'CheckUploadedDocumentsController.addDocsToDBHandler',
    '/handle-service-choice': 'ApplicationTypeController.handleServiceChoice',
    '/open-epp/:unique_app_id': 'OpenEAppController.renderPage',

    // eligibility questions
    'GET /eligibility/:question':
        'EAppEligibilityQuestionsController.renderEligibilityQuestion',
    'POST /eligibility/:question':
        'EAppEligibilityQuestionsController.handleEligibilityAnswers',
    '/use-standard-service': {
        view: 'eApostilles/useStandardService',
    },
    '/use-notarised-pdf': {
        view: 'eApostilles/useNotarisedPdf',
    },
    // Important Information page - displayed after document checker
    '/check-documents-important-information':
        'DocumentsCheckerController.displayImportantInformation',

    /*
     * Non JS doc selection bits
     * */
    '/manual-update-doc-count':
        'DocumentsCheckerController.manualUpdateDocCount',
    '/ajax-update-doc-count': 'DocumentsCheckerController.AJAXUpdateDocCount',
    '/email-failed-certs': 'DocumentsCheckerController.emailFailedCerts',
    //////////////////////////////////
    // ---- Your Basic Details ---- //
    //////////////////////////////////

    // Show basic details page
    '/provide-your-details':
        'UsersBasicDetailsController.renderBasicUserDetailsPage',
    '/your-basic-details': {
        controller: 'UsersBasicDetailsController',
        action: 'userBasicDetailsPage',
    },
    '/your-basic-details/confirm': {
        controller: 'UsersBasicDetailsController',
        action: 'submitBasicDetails',
    },
    '/saved-user-details': 'UsersBasicDetailsController.savedUserDetails',

    // Modify Basic Details, then go to Your Basic Details page and fire submitBasicDetails by navigating to your-address-details
    '/update-your-basic-details':
        'UsersBasicDetailsController.renderModifyBasicDetailsPage',
    '/modify-your-basic-details':
        'UsersBasicDetailsController.populateBasicDetailsForm',
    '/modify-your-basic-details/success':
        'UsersBasicDetailsController.submitBasicDetails',

    ////////////////////////////////////
    // ---- Your Address Details ---- //
    ////////////////////////////////////
    // Show address details page
    '/provide-your-address-details': {
        controller: 'UsersAddressDetailsController',
        action: 'addressStart',
    },

    //Show UK question
    '/your-main-address-details': {
        controller: 'UsersAddressDetailsController',
        action: 'showUKQuestion',
    },
    '/your-alternative-address-details': {
        controller: 'UsersAddressDetailsController',
        action: 'showUKQuestion',
    },

    //Submit UK response
    '/your-main-address-uk': {
        controller: 'UsersAddressDetailsController',
        action: 'submitUKQuestion',
    },
    '/your-alternative-address-uk': {
        controller: 'UsersAddressDetailsController',
        action: 'submitUKQuestion',
    },

    //Show manual entry
    '/your-main-address-manual': {
        controller: 'UsersAddressDetailsController',
        action: 'showManualAddress',
    },
    '/your-alternative-address-manual': {
        controller: 'UsersAddressDetailsController',
        action: 'showManualAddress',
    },

    //Submit postcode for search
    '/find-your-main-address': {
        controller: 'UsersAddressDetailsController',
        action: 'findPostcode',
    },
    '/find-your-alternative-address': {
        controller: 'UsersAddressDetailsController',
        action: 'findPostcode',
    },

    '/ajax-find-your-address': {
        controller: 'UsersAddressDetailsController',
        action: 'ajaxFindPostcode',
    },
    '/ajax-select-your-address': {
        controller: 'UsersAddressDetailsController',
        action: 'ajaxSelectAddress',
    },

    //Submit selection from search
    '/select-your-main-address': {
        controller: 'UsersAddressDetailsController',
        action: 'selectUKAddress',
    },
    '/select-your-alternative-address': {
        controller: 'UsersAddressDetailsController',
        action: 'selectUKAddress',
    },

    //Show International Address
    '/international-main-address': {
        controller: 'UsersAddressDetailsController',
        action: 'showIntlAddress',
    },
    '/international-alternative-address': {
        controller: 'UsersAddressDetailsController',
        action: 'showIntlAddress',
    },

    //Submit Addresses
    '/add-uk-address': {
        controller: 'UsersAddressDetailsController',
        action: 'submitAddress',
    },
    '/add-international-address': {
        controller: 'UsersAddressDetailsController',
        action: 'submitAddress',
    },

    '/alternative-address': {
        controller: 'UsersAddressDetailsController',
        action: 'showSameQuestion',
    },
    '/alternative-address-response': {
        controller: 'UsersAddressDetailsController',
        action: 'useSameResponse',
    },

    //IF not changing from summary
    '/modify-address': {
        controller: 'UsersAddressDetailsController',
        action: 'modifyAddressRouter',
    },
    '/modify-your-address-details': {
        controller: 'UsersAddressDetailsController',
        action: 'showEditUKAddress',
    },

    //IF changing from summary
    '/change-your-address-details': {
        controller: 'UsersAddressDetailsController',
        action: 'changeAddressRouter',
    },

    //Using saved addresses
    '/your-saved-addresses': {
        controller: 'UsersAddressDetailsController',
        action: 'showSavedAddresses',
    },
    '/your-saved-addresses-alternative': {
        controller: 'UsersAddressDetailsController',
        action: 'showSavedAddresses',
    },
    '/use-saved-address-details': {
        controller: 'UsersAddressDetailsController',
        action: 'useSavedAddress',
    },
    '/manage-saved-address': {
        controller: 'UsersAddressDetailsController',
        action: 'manageSavedAddress',
    },

    //////////////////////////////////////
    // ---- Document Count Details ---- //
    //////////////////////////////////////

    // Show document count page
    '/how-many-documents': {
        controller: 'DocumentsQuantityController',
        action: 'userDocumentQuantityPage',
    },
    '/how-many-documents/confirm': {
        controller: 'DocumentsQuantityController',
        action: 'addDocsQuantity',
    },

    // Modify document count and associated country
    '/update-how-many-documents':
        'DocumentsQuantityController.renderDocumentCountPage',
    '/modify-how-many-documents':
        'DocumentsQuantityController.populateDocumentCountForm',
    '/modify-how-many-documents/success':
        'DocumentsQuantityController.addDocsQuantity',

    ///////////////////////////////
    // ---- Postage Details ---- //
    ///////////////////////////////

    // Show postage send details page
    '/postage-send-options': {
        controller: 'SendReturnOptionsController',
        action: 'ShowSendOptions',
    },
    '/modify-postage-send-options': {
        controller: 'SendReturnOptionsController',
        action: 'ShowSendOptions',
    },
    '/submit-postage-send-options': {
        controller: 'SendReturnOptionsController',
        action: 'SubmitSendOptions',
    },

    '/postage-return-options': {
        controller: 'SendReturnOptionsController',
        action: 'ShowReturnOptions',
    },
    '/modify-postage-return-options': {
        controller: 'SendReturnOptionsController',
        action: 'ShowReturnOptions',
    },
    '/submit-postage-return-options': {
        controller: 'SendReturnOptionsController',
        action: 'SubmitReturnOptions',
    },

    //////////////////////////////////////
    // ---- Additional Information ---- //
    //////////////////////////////////////

    // Show special instructions page
    '/additional-information': {
        controller: 'UserAdditionalInformationController',
        action: 'additionalInformationDetailsPage',
    },
    '/add-additional-information':
        'UserAdditionalInformationController.addAdditionalInfo',
    // set to go to summary url instead
    // '/additional-information/confirm'            :   'UserAdditionalInformationController.addAdditionalInfo',

    // Modify additional information
    '/update-additional-information':
        'UserAdditionalInformationController.renderAdditionalInformationPage',
    '/modify-additional-information':
        'UserAdditionalInformationController.populateAdditionalInfoForm',
    '/modify-additional-information/success':
        'UserAdditionalInformationController.addAdditionalInfo',

    //////////////////////////////////////
    // ---- Summary Page ---- //
    //////////////////////////////////////

    // Show summary page
    '/review-summary': 'SummaryController.renderSummaryPage',
    '/summary': 'SummaryController.fetchAll',
    '/declaration-agreement': 'ApplicationController.showDeclaration',
    '/declaration': 'ApplicationController.declarationPage',
    '/confirm-declaration': 'ApplicationController.confirmDeclaration',
    '/application-submitted': 'ApplicationController.confirmation',
    '/print-cover-sheet': 'ApplicationController.printCoverSheet',
    '/open-application/:unique_app_id': 'DashboardController.openCoverSheet',
    '/open-eapp/:unique_app_id': 'OpenEAppController.renderPage',

    /////////////////////////////
    // ---- Payment Page ---- //
    ////////////////////////////

    // Payment Page
    '/pay-for-application': 'ApplicationController.payForApplication',

    //////////////////////////////////////
    // ---- Print Cover Sheet Page ---- //
    //////////////////////////////////////

    // This exists as a duplicate view of hte Summary Page, but with interactivity
    // removed and a separate css to hide HTML

    //////////////////////////////////
    // ---- Submit Application ---- //
    //////////////////////////////////

    '/submit-application': 'ApplicationController.submitApplication',
    '/qr-code-converter/:appId': 'PublicController.getQRCode',

    //////////////////////////////////
    // ---- Submit Application ---- //
    //////////////////////////////////
    '/business-document-quantity':
        'BusinessApplicationController.showDocumentQuantityPage',
    '/business-add-document-quantity':
        'BusinessApplicationController.addDocumentCount',
    '/business-additional-information':
        'BusinessApplicationController.showAdditionalInformation',
    '/business-add-additional-information':
        'BusinessApplicationController.addAdditionalInformation',
    '/business-pay-for-application':
        'BusinessApplicationController.payForApplication',
    '/business-confirmation': 'BusinessApplicationController.confirmation',

    //////////////////////////////////
    // ---- External Links ---- //
    //////////////////////////////////

    '/navigate': 'PublicController.navigate',
    '/survey': 'PublicController.survey',

    ////////////////////////////////////
    // ---- Additional Payments  ---- //
    ////////////////////////////////////

    '/additional-payments': 'AdditionalPaymentsController.start',
    '/additional-payments/confirm': 'AdditionalPaymentsController.confirm',
};
