/**
 * Created by preciousr on 21/01/2016.
 */
const axios = require('axios');
const sails = require('sails');

const config = require('../../config/environment-variables');

const emailRequest = axios.create({
    baseURL: config.customURLs.notificationServiceURL,
    headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
    },
});

const EmailService = {
    async submissionConfirmation(
        email,
        application_reference,
        send_information,
        user_ref,
        serviceType
    ) {
        const url = '/confirm-submission';
        const postData = {
            to: email,
            application_reference: application_reference,
            send_information: send_information,
            user_ref: user_ref,
            service_type: serviceType,
        };

        await EmailService._sendRequestToNotificationService(postData, url);
    },
    async failedDocuments(email, failed_certs) {
        const url = '/failed-documents';
        const postData = { to: email, failed_certs: failed_certs };

        await EmailService._sendRequestToNotificationService(postData, url);
    },

    async _sendRequestToNotificationService(postData, url) {
        try {
            const res = await emailRequest.post(url, postData);
            sails.log.info(res.status, res.data);
        } catch (err) {
            sails.log.error(`EmailService error: ${err}`);
        }
    },
};

module.exports = {
    submissionConfirmation: EmailService.submissionConfirmation,
    failedDocuments: EmailService.failedDocuments,
    emailRequest,
};
