const EAppEligibilityQuestionsController = {
    renderEligibilityQuestion(req, res) {
        const eligibilityViews = {
            'apostille-accepted-in-desitnation':
                'eApostilles/eligibilityQuestionOne.ejs',
            'documents-eligible-for-service':
                'eApostilles/eligibilityQuestionTwo.ejs',
            'pdfs-digitally-signed':
                'eApostilles/eligibilityQuestionThree.ejs',
        };

        const questionPage = eligibilityViews[req.param('question')];
        const userData = EAppEligibilityQuestionsController._fetchUserData(
            req,
            res
        );

        return res.view(questionPage, {
            user_data: userData,
            page_error: false,
        });
    },

    _fetchUserData(req, res) {
        const userData = HelperService.getUserData(req, res);
        EAppEligibilityQuestionsController._checkUserLoggedIn(userData, res);

        return userData;
    },

    _checkUserLoggedIn(userData, res) {
        if (!userData.loggedIn) {
            sails.log.error('User is not logged in', userData);
            return res.forbidden();
        }
    },

    handleEligibilityAnswers(req, res) {
        const questionOne = {
            radioInputName: 'eapostille-acceptable',
            errorPagePath: 'eApostilles/eligibilityQuestionOne.ejs',
            redirectOptions: {
                yes: '/eligibility/documents-eligible-for-service',
                no: '/use-standard-service',
            },
        };

        const questionTwo = {
            radioInputName: 'documents-eligible',
            errorPagePath: 'eApostilles/eligibilityQuestionTwo.ejs',
            redirectOptions: {
                yes: '/eligibility/pdfs-digitally-signed',
                no: '/use-standard-service',
            },
        };

        const questionThree = {
            radioInputName: 'notarised-and-signed',
            errorPagePath: 'eApostilles/eligibilityQuestionThree.ejs',
            redirectOptions: {
                yes: '/eapp-start-page?prevUrl=/eligibility/pdfs-digitally-signed',
                no: '/use-notarised-pdf',
            },
        };

        const eligibilityParams = {
            'apostille-accepted-in-desitnation': questionOne,
            'documents-eligible-for-service': questionTwo,
            'pdfs-digitally-signed': questionThree,
        };

        const params = eligibilityParams[req.param('question')];
        return EAppEligibilityQuestionsController._handleYesNoAnswers(
            req,
            res,
            params
        );
    },

    _handleYesNoAnswers(req, res, params) {
        const { radioInputName, errorPagePath, redirectOptions } = params;
        const radioValueSelected = req.body[radioInputName];
        const userData = EAppEligibilityQuestionsController._fetchUserData(
            req,
            res
        );

        if (!radioValueSelected) {
            sails.log.error('No option selected');
            return res.view(errorPagePath, {
                user_data: userData,
                page_error: true,
            });
        }

        return res.redirect(redirectOptions[radioValueSelected]);
    },
};

module.exports = EAppEligibilityQuestionsController;
