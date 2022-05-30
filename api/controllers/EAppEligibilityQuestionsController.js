const HelperService = require("../services/HelperService");
const EAppEligibilityQuestionsController = {
    renderEligibilityQuestion(req, res) {
        const eligibilityViews = {
            'check-documents-are-eligible':
                'eApostilles/eligibilityQuestionOne.ejs',
            'check-recipient-accepts-eapostilles':
                'eApostilles/eligibilityQuestionTwo.ejs',
            'check-documents-are-prepared': 'eApostilles/eligibilityQuestionThree.ejs',
        };

        const paramMatchesViewRoute = Object.keys(eligibilityViews).includes(
            req.param('question')
        );

        if (!paramMatchesViewRoute) {
            return res.view('404.ejs');
        }

        const questionPage = eligibilityViews[req.param('question')];

        return res.view(questionPage, {
            user_data: HelperService.getUserData(req, res),
            page_error: false,
        });
    },

    handleEligibilityAnswers(req, res) {
        const questionOne = {
            radioInputName: 'eapostille-acceptable',
            errorPagePath: 'eApostilles/eligibilityQuestionOne.ejs',
            redirectOptions: {
                yes: '/eligibility/check-recipient-accepts-eapostilles',
                no: '/exit-pages/you-cannot-apply-yet',
            },
        };

        const questionTwo = {
            radioInputName: 'documents-eligible',
            errorPagePath: 'eApostilles/eligibilityQuestionTwo.ejs',
            redirectOptions: {
                yes: '/eligibility/check-documents-are-prepared',
                no: '/exit-pages/check-recipient-accepts-eapostilles-exit',
            },
        };

        const questionThree = {
            radioInputName: 'notarised-and-signed',
            errorPagePath: 'eApostilles/eligibilityQuestionThree.ejs',
            redirectOptions: {
                yes: '/completing-your-application',
                no: '/exit-pages/use-paper-based-service',
            },
        };

        const eligibilityParams = {
            'check-documents-are-eligible': questionOne,
            'check-recipient-accepts-eapostilles': questionTwo,
            'check-documents-are-prepared': questionThree,
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

        if (!radioValueSelected) {
            sails.log.error('No option selected');
            return res.view(errorPagePath, {
                user_data: HelperService.getUserData(req, res),
                page_error: true,
            });
        }

        return res.redirect(redirectOptions[radioValueSelected]);
    },
};

module.exports = EAppEligibilityQuestionsController;
