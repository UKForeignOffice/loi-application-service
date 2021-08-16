/**
 * Created by preciousr on 21/01/2016.
 */
const request = require('request');

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

        // send request to notification service
        request(setOptions(postData, url), function (err, res, body) {
            if (err) {
                console.log(err);
            } else {
                console.log(res.statusCode, body);
            }
        });
    },
    failedDocuments(email, failed_certs) {
        const url = '/failed-documents';
        const postData = { to: email, failed_certs: failed_certs };

        // send request to notification service
        request(setOptions(postData, url), function (err, res, body) {
            if (err) {
                console.log(err);
            } else {
                console.log(res.statusCode, body);
            }
        });
    },
};

function setOptions(postData, url) {
    return {
        url: sails.config.customURLs.notificationServiceURL + url,
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
        },
        method: 'POST',
        json: true,
        body: postData,
    };
}

module.exports = EmailService;
