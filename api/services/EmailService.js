/**
 * Created by preciousr on 21/01/2016.
 */
const request = require('request');

const emailRequest = request.defaults({
    baseUrl: sails.config.customURLs.notificationServiceURL,
    headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
    },
    method: 'POST',
    json: true,
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
        emailRequest(
            { url, body: postData },
            (err, res, body) => {
                if (err) {
                    sails.log.error(err);
                } else {
                    sails.log.info(res.statusCode, body);
                }
            }
        );
    },
};

module.exports = EmailService;
