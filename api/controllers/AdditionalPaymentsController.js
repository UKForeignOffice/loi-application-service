/**
 * AdditionalPaymentsController module.
 * @module Controller AdditionalPaymentsController
 */

var additionalPaymentsController = {

  /**
   * @function start()
   * @description Start the additional payments process
   * @param req
   * @param res
   * @return res.redirect
   */
  start: function (req, res) {
    return res.view('additionalPayments/start.ejs')
  },

  confirm: function (req, res) {

    try {
      if (req.method === 'POST'){
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

