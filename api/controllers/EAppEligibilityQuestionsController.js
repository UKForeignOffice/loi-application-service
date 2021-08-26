const EAppEligibilityQuestionsController = {
    renderQuestionOne(req, res) {
        return EAppEligibilityQuestionsController._pageRendering(
            req,
            res,
            'eApostilles/eligibilityQuestionOne.ejs'
        );
    },

    renderQuestionTwo(req, res) {
        return EAppEligibilityQuestionsController._pageRendering(
            req,
            res,
            'eApostilles/eligibilityQuestionTwo.ejs'
        );
    },

    renderQuestionThree(req, res) {
        return EAppEligibilityQuestionsController._pageRendering(
            req,
            res,
            'eApostilles/eligibilityQuestionThree.ejs'
        );
    },

    handleQuestionOneAnswer(req, res) {
        const params = {
            radioInputName: 'eapostille-acceptable',
            errorPagePath: 'eApostilles/eligibilityQuestionOne.ejs',
            redirectOptions: {
                yes: '/eligibility-question-two',
                no: '/use-standard-service',
            },
        };
        return EAppEligibilityQuestionsController._handleYesNoAnswers(
            req,
            res,
            params
        );
    },

    handleQuestionTwoAnswer(req, res) {
        const params = {
            radioInputName: 'documents-eligible',
            errorPagePath: 'eApostilles/eligibilityQuestionTwo.ejs',
            redirectOptions: {
                yes: '/eligibility-question-three',
                no: '/use-standard-service',
            },
        };
        return EAppEligibilityQuestionsController._handleYesNoAnswers(
            req,
            res,
            params
        );
    },

    handleQuestionThreeAnswer(req, res) {
        const params = {
            radioInputName: 'notarised-and-signed',
            errorPagePath: 'eApostilles/eligibilityQuestionThree.ejs',
            redirectOptions: {
                yes: '/eapp-start-page',
                no: '/use-notarised-pdf',
            },
        };
        return EAppEligibilityQuestionsController._handleYesNoAnswers(
            req,
            res,
            params
        );
    },

    _handleYesNoAnswers(req, res, params) {
        const {radioInputName, errorPagePath, redirectOptions} = params;
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

    _pageRendering(req, res, pagePath) {
        const userData = EAppEligibilityQuestionsController._fetchUserData(
            req,
            res
        );

        return res.view(pagePath, {
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
};

module.exports = EAppEligibilityQuestionsController;
