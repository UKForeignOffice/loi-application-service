/**
 * Created by preciousr on 17/05/2016.
 */
module.exports = {
/**
 * Get the QRCode
 * @param res {Array}
 * @param req {Array}
 * @return qrcode {img}
 */
    getQRCode: function (req, res) {
        var qr = require('qr-image');
        var qr_svg = qr.image(req.params.appId, {type: 'png', size: 4, margin: 0});
        res.setHeader("Content-Type", 'image/png');
        qr_svg.pipe(res);
    }
};