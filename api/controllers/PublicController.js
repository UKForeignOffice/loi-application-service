/**
 * Created by preciousr on 17/05/2016.
 */
module.exports = {
  startPage: function (req, res) {
    if (sails.config.views.locals.service_public) {
      return res.redirect(sails.config.views.locals.start_url)
    } else {
      return res.view('index')
    }
  },
  /**
   * Get the QRCode
   * @param res {Array}
   * @param req {Array}
   * @return qrcode {img}
   */
  getQRCode: function (req, res) {
    var re = /^[A]-[ABC]-[\d]{2}-[\d]{4}-[\d]{4}-[A-Z0-9]{4}$/g

    if (req.params.appId.toString().match(re)) {
      var qr = require('qr-image')
      var qr_svg = qr.image(req.params.appId, { type: 'png', size: 4, margin: 0 })
      res.setHeader('Content-Type', 'image/png')
      qr_svg.pipe(res)
    } else {
      console.log('Incorrect QR code format ' + req.params.appId)
      res.end()
    }
  },

  generateCoverSheetQRCode: function (req, res) {
    var re = /^.*,[\d]+,[A]-[ABC]-[\d]{2}-[\d]{4}-[\d]{4}-[A-Z0-9]{4}$/g
    var qrText = new Buffer.from(req.params.qrText, 'base64').toString('ascii')
    var sanitisedString = qrText.replace(/\./g, ' .')

    if (sanitisedString.match(re)) {
      var qr = require('qr-image')
      var qr_svg = qr.image(sanitisedString, { type: 'png', size: 4, margin: 0 })
      res.setHeader('Content-Type', 'image/png')
      qr_svg.pipe(res)
    } else {
      console.log('Incorrect QR code format ' + sanitisedString)
      res.end()
    }
  },

  maintenance: function (req, res) {
    return res.view('maintenance')
  },

  /**
   * Redirect to external survey
   *
   */

  survey: function (req, res) {
    return res.view('survey')
  },
}
