const EAppEligibilityQuestionsController = {
    renderEligibilityQuestion(req, res) {
        const eligibilityViews = {
            'apostille-accepted-in-destination':
                'eApostilles/eligibilityQuestionOne.ejs',
            'documents-eligible-for-service':
                'eApostilles/eligibilityQuestionTwo.ejs',
            'pdfs-digitally-signed': 'eApostilles/eligibilityQuestionThree.ejs',
        };

        const paramMatchesViewRoute = Object.keys(eligibilityViews).includes(
            req.param('question')
        );

        if (!paramMatchesViewRoute) {
            return res.view('404.ejs');
        }

        const questionPage = eligibilityViews[req.param('question')];
        const isFirstPage =
            questionPage === 'eApostilles/eligibilityQuestionOne.ejs';
        let skipLinkObj = {};

        if (isFirstPage) {
            const loggedIn = HelperService.LoggedInStatus(req);
            const signInUrl = `${req._sails.config.customURLs.userServiceURL}/sign-in?from=start&next=continueEApp`;
            const skipLink = loggedIn ? '/upload-files' : signInUrl;

            skipLinkObj = { skipLink };
        }

        return res.view(questionPage, {
            user_data: HelperService.getUserData(req, res),
            page_error: false,
            ...skipLinkObj,
        });
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
