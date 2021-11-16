/**
 * Created by preciousr on 21/01/2016.
 */
const axios = require('axios');

const emailRequest = axios.create({
    baseURL: sails.config.customURLs.notificationServiceURL,
    headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
    },
});


const EmailService = {
    submissionConfirmation(
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
        EmailService._sendRequestToNotificationService(postData, url);
    },
    failedDocuments(email, failed_certs) {
        const url = '/failed-documents';
        const postData = { to: email, failed_certs: failed_certs };
        EmailService._sendRequestToNotificationService(postData, url);
    },

    _sendRequestToNotificationService(postData, url) {
        emailRequest.post(url,{ data: postData }).then((response) => {
            sails.log.info(response.status, response.data);
        }).catch((err) => {
            sails.log.error(`EmailService error: ${err}`);
        })
    },
};

module.exports = EmailService;
