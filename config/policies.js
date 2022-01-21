/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/


    '*':'nocache', // prevent caching of pages to prevent
    DashboardController                 : 'userSessionValid',

    ApplicationController               : {'*':['userSessionValid','applicationSessionValid']},
    BusinessApplicationController       : {'*':['userSessionValid','applicationSessionValid']},
    DocumentsCheckerController          : {'*':['userSessionValid','applicationSessionValid']},
    DocumentsQuantityController         : {'*':['userSessionValid','applicationSessionValid']},
    FastTrackApplicationController      : {'*':['userSessionValid','applicationSessionValid']},
    SendReturnOptionsController         : {'*':['userSessionValid','applicationSessionValid']},
    SummaryController                   : {'*':['userSessionValid','applicationSessionValid']},
    UserAdditionalInformationController : {'*':['userSessionValid','applicationSessionValid']},
    UsersAddressDetailsController       : {'*':['userSessionValid','applicationSessionValid']},
    UsersBasicDetailsController         : {'*':['userSessionValid','applicationSessionValid']},
    FileUploadController                : {'*':['userSessionValid','applicationSessionValid']},
    EAppReferenceController             : {'*':['userSessionValid','applicationSessionValid']},
    CheckUploadedDocumentsController    : {'*':['userSessionValid','applicationSessionValid']},
    OpenEAppController                  : {'*':['userSessionValid','applicationSessionValid']},
};
