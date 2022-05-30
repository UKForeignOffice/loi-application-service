const Application = require('../models/index').Application;
const ApplicationReference = require('../models/index').ApplicationReference;

const EAppStartPageController = {
    startPage(req, res) {
        const userData = HelperService.getUserData(req, res);
        const backUrl = req.query.arrivedFrom === 'skipQuestionsLink'
            ? '/eligibility/check-documents-are-eligible'
            : '/eligibility/check-documents-are-prepared';

        return res.view('eApostilles/startPage.ejs', {
            user_data: userData,
            back_url: backUrl,
        });
    },

    async startElectronicApplication(req, res) {
        const userData = HelperService.getUserData(req, res);
        const signInUrl = `${sails.config.customURLs.userServiceURL}/sign-in?from=start&next=continueEApp`;
        const nextUrl = userData.loggedIn ? '/upload-files': signInUrl;

        const appIdExistsInSession = Boolean(req.session.appId);
        const appTypeExistsInSession = Boolean(req.session.appType);
        const appDetailsInSession = appIdExistsInSession && appTypeExistsInSession;

        if (!appDetailsInSession) {
            const newAppData = await EAppStartPageController._createNewApplicationInDB();
            EAppStartPageController._addApplicationDetailsToSession(req, newAppData);
            EAppStartPageController._wipePreviousSessionVariables(req);
        }

        return res.redirect(nextUrl);
    },

    async _createNewApplicationInDB() {
        const appRefDetails = await ApplicationReference.findOne();
        const eAppServiceNum = 4;
        const uniqueApplicationId =
        HelperService.generateNewApplicationId(
            appRefDetails,
            eAppServiceNum.toString()
        );
        const newAppInDB = await Application.create({
            serviceType: eAppServiceNum,
            unique_app_id: uniqueApplicationId,
            all_info_correct: '-1',
            user_id: 0,
            submitted: 'draft',
            company_name: 'N/A',
            feedback_consent: 0,
            doc_reside_EU: 0,
            residency: 0,
        });

        return newAppInDB;
    },

    _addApplicationDetailsToSession(req, newAppInDB) {
        req.session.appId = newAppInDB.dataValues.application_id;;
        req.session.appType = 4;
    },

    _wipePreviousSessionVariables(req) {
        req.session.selectedDocs = '';
        req.session.return_address = '';
        req.session.appSubmittedStatus = false;
    }
}

module.exports = EAppStartPageController;
