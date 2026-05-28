/**
 * Created by preciousr on 17/05/2016.
 */
module.exports = {
  startPage: (_req, res) => {
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
  getQRCode: (req, res) => {
    const re = /^[A]-[ABC]-[\d]{2}-[\d]{4}-[\d]{4}-[A-Z0-9]{4}$/g

    if (req.params.appId.toString().match(re)) {
      const qr = require('qr-image')
      const qr_svg = qr.image(req.params.appId, { type: 'png', size: 4, margin: 0 })

      res.setHeader('Content-Type', 'image/png')
      qr_svg.pipe(res)
    } else {
      console.log(`Incorrect QR code format ${req.params.appId}`)
      res.end()
    }
  },

  generateCoverSheetQRCode: (req, res) => {
    const re = /^.*,[\d]+,[A]-[ABC]-[\d]{2}-[\d]{4}-[\d]{4}-[A-Z0-9]{4}$/g
    const qrText = new Buffer.from(req.params.qrText, 'base64').toString('ascii')
    const sanitisedString = qrText.replace(/\./g, ' .')

    if (sanitisedString.match(re)) {
      const qr = require('qr-image')
      const qr_svg = qr.image(sanitisedString, { type: 'png', size: 4, margin: 0 })
      res.setHeader('Content-Type', 'image/png')
      qr_svg.pipe(res)
    } else {
      console.log(`Incorrect QR code format ${sanitisedString}`)
      res.end()
    }
  },

  maintenance: (_req, res) => res.view('maintenance'),

  /**
   * Redirect to external survey
   *
   */

  survey: (_req, res) => res.view('survey'),
}
