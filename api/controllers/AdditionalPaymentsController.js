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

    return res.view('additionalPayments/start.ejs',{
      errors:errors,
      costError: false,
      costErrorAmount: false,
      emailError: false,
      casebookRef: ref
    })
  },

  confirm: function (req, res) {
    try {
      if (req.method === 'POST'){
        let errors = [];
        let costError, costErrorAmount, emailError;
        if (!validateCost(req.body.cost)){
          errors.push({msg:'Please enter a payment amount', questionId: 'cost'})
          costError = true;
        }

        if (!costBoundaires(req.body.cost)){
          errors.push({msg:'Amount must be between £3 and £4000', questionId: 'cost'})
          costErrorAmount = true;
        }

        if (!validateEmail(req.body.email)){
          errors.push({msg:'Please enter a correctly formatted email address.', questionId: 'email'})
          emailError = true
        }

        let sess = req.session;
        sess.additionalPayments = {};
        sess.additionalPayments.casebookRef = req.body.casebookRef
        sess.additionalPayments.cost = formatMoney(req.body.cost);
        sess.additionalPayments.email = req.body.email;

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

