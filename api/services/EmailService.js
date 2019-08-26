/**
 * Created by preciousr on 21/01/2016.
 */
var request = require('request'),

emailService = {
  submissionConfirmation: function(email,application_reference, send_information, user_ref, serviceType){
    var url = '/confirm-submission';
    var postData= {to: email, application_reference: application_reference, send_information: send_information, user_ref: user_ref, service_type: serviceType};

    // send request to notification service
    request(setOptions(postData, url), function (err, res, body) {
      if(err) {
        console.log(err);
      } else {
        console.log(res.statusCode, body);
      }
    });
  },
  failedDocuments: function(email,failed_certs){
    var url = '/failed-documents';
    var postData= {to: email, failed_certs: failed_certs};

    // send request to notification service
    request(setOptions(postData, url), function (err, res, body) {
      if(err) {
        console.log(err);
      } else {
        console.log(res.statusCode, body);
      }
    });
  }
};

module.exports = emailService;

function setOptions(postData, url){
  var options = {
    url: sails.config.customURLs.notificationServiceURL + url,
    headers:
    {
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    },
    method: 'POST',
    json: true,
    body: postData
  };
  return options;
}
