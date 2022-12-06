/**
 * AdditionalPaymentsController module.
 * @module Controller AdditionalPaymentsController
 */

function formatMoney (num) {
  let numeral = require('numeral');
  return numeral(num).format('0.00');
}

function validateEmail (email) {
  var validate = require('validator');

  if (typeof email !== 'undefined') {
    return validate.isEmail(email)
  } else return false
}

function validateCost (cost) {
  return typeof cost !== 'undefined' && cost !== '' && parseFloat(cost) !== 0;
}

function costBoundaires(cost){
  const min = 3;
  const max = 4000;

  if ((cost<min || cost>max) && validateCost(cost)) {
    return false;
  }
  else {
    return true;
  }
}

var additionalPaymentsController = {

  /**
   * @function start()
   * @description Start the additional payments process
   * @param req
   * @param res
   * @return res.redirect
   */
  start: function (req, res) {
    let errors = [];
    let ref = (req.query.ref) ? req.query.ref : ''
    let email = (req.query.email) ? req.query.email : ''
    let amount = (req.query.amount) ? req.query.amount : ''

    return res.view('additionalPayments/start.ejs',{
      errors:errors,
      costError: false,
      costErrorAmount: false,
      emailError: false,
      applicationRef: ref,
      applicationEmail: email,
      applicationAmount: amount
    })
  },

  confirm: function (req, res) {
    try {
      if (req.method === 'POST'){
        let errors = [];
        let costError, costErrorAmount, emailError;
        if (!validateCost(req.body.applicationAmount)){
          errors.push({msg:'Please enter a payment amount', questionId: 'applicationAmount'})
          costError = true;
        }

        if (!costBoundaires(req.body.applicationAmount)){
          errors.push({msg:'Amount must be between £3 and £4000', questionId: 'applicationAmount'})
          costErrorAmount = true;
        }

        if (!validateEmail(req.body.applicationEmail)){
          errors.push({msg:'Please enter a correctly formatted email address.', questionId: 'applicationEmail'})
          emailError = true
        }

        let sess = req.session;
        sess.additionalPayments = {};
        sess.additionalPayments.applicationRef = req.body.applicationRef
        sess.additionalPayments.applicationAmount = formatMoney(req.body.applicationAmount);
        sess.additionalPayments.applicationEmail = req.body.applicationEmail;

        if (errors.length > 0){
          return res.view('additionalPayments/start.ejs', {
            errors:errors,
            costError: costError,
            costErrorAmount: costErrorAmount,
            emailError: emailError
          })
        }

        let paymentUrl = sails.config.payment.additionalPaymentStartPageUrl;
        return res.redirect(307, paymentUrl)
      } else {
        return res.redirect('/additional-payments');
      }
    }
    catch(err) {
      console.log(err);
      return res.serverError(err);
    }
  }

};
module.exports = additionalPaymentsController;

