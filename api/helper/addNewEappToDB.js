const Application = require('../models/index').Application;
const ApplicationReference = require('../models/index').ApplicationReference;

const eAppServiceNum = 4;

async function addNewEappToDB(req, res) {
    try {
        const appIdExistsInSession = Boolean(req.session.appId);
        const appTypeExistsInSession = Boolean(req.session.appType);
        const eappAlreadyExistsInSession =
            appIdExistsInSession && appTypeExistsInSession;

        if (eappAlreadyExistsInSession) return;

        const newAppData = await createNewApplicationInDB(req);
        addApplicationDetailsToSession(req, newAppData);
        wipePreviousSessionVariables(req);
    } catch (err) {
        sails.log.error(err);
        return res.serverError();
    }
}

async function createNewApplicationInDB(req) {
    try {
        const appRefDetails = await ApplicationReference.findOne();
        const uniqueApplicationId = HelperService.generateNewApplicationId(
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
            submission_destination: req._sails.config.views.locals.caseManagementSystem || 'ORBIT'
        });

        return newAppInDB;
    } catch (err) {
        throw new Error(`createNewApplicationInDB: ${err}`);
    }
}

function addApplicationDetailsToSession(req, newAppInDB) {
    req.session.appId = newAppInDB.dataValues.application_id;
    req.session.appType = eAppServiceNum;
}

function wipePreviousSessionVariables(req) {
    req.session.selectedDocs = '';
    req.session.return_address = '';
    req.session.appSubmittedStatus = false;
}

module.exports = addNewEappToDB;
