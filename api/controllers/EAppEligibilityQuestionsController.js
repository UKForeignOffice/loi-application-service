const EAppEligibilityQuestionsController = {
    renderEligibilityQuestion(req, res) {
        const eligibilityViews = {
            'apostille-accepted-in-destination':
                'eApostilles/eligibilityQuestionOne.ejs',
            'documents-eligible-for-service':
                'eApostilles/eligibilityQuestionTwo.ejs',
            'pdfs-digitally-signed':
                'eApostilles/eligibilityQuestionThree.ejs',
        };

        const paramMatchesViewRoute = Object.keys(eligibilityViews).includes(req.param('question'));

        if (!paramMatchesViewRoute) {
            return res.view('404.ejs');
        }

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

        return userData;
    },

    handleEligibilityAnswers(req, res) {
        const questionOne = {
            radioInputName: 'eapostille-acceptable',
            errorPagePath: 'eApostilles/eligibilityQuestionOne.ejs',
            redirectOptions: {
                yes: '/eligibility/documents-eligible-for-service',
                no: '/use-standard-service/apostille-acceptance',
            },
        };

        const questionTwo = {
            radioInputName: 'documents-eligible',
            errorPagePath: 'eApostilles/eligibilityQuestionTwo.ejs',
            redirectOptions: {
                yes: '/eligibility/pdfs-digitally-signed',
                no: '/use-standard-service/apostille-eligible',
            },
        };

        const questionThree = {
            radioInputName: 'notarised-and-signed',
            errorPagePath: 'eApostilles/eligibilityQuestionThree.ejs',
            redirectOptions: {
                yes: '/eapp-start-page',
                no: '/use-standard-service/apostille-digitally-signed',
            },
        };

        const eligibilityParams = {
            'apostille-accepted-in-destination': questionOne,
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
