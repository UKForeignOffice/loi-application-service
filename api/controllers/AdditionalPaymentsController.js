/**
 * AdditionalPaymentsController module.
 * @module Controller AdditionalPaymentsController
 */

function formatMoney (num) {
  let numeral = require('numeral');
  return numeral(num).format('0.00');
}

function validateEmail (email) {
  let isemail = require('isemail');
  if (typeof email !== 'undefined') {
    return isemail.validate(email)
  } else return false
}

function validateCost (cost) {
  return typeof cost !== 'undefined' && cost !== '';
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
    return res.view('additionalPayments/start.ejs',{
      errors:errors
    })
  },

  confirm: function (req, res) {
    try {
      if (req.method === 'POST'){
        let errors = [];

        if (!validateEmail(req.body.email)){
          errors.push({msg:'Please enter a correctly formatted email address.'})
        }

        if (!validateCost(req.body.cost)){
          errors.push({msg:'Please enter a payment amount'})
        }

        let sess = req.session;
        sess.additionalPayments = {};
        sess.additionalPayments.cost = formatMoney(req.body.cost);
        sess.additionalPayments.email = req.body.email;

        if (errors.length > 0){
          return res.view('additionalPayments/start.ejs', {
            errors:errors
          })
        }

        let paymentUrl = sails.config.additionalPayments.additionalPaymentStartPageUrl;
        return res.redirect(307, paymentUrl)
      } else {
        return res.view('additionalPayments/start.ejs')
      }
    }
    catch(err) {
      console.log(err);
      return res.serverError(err);
    }
  }

};
module.exports = additionalPaymentsController;

