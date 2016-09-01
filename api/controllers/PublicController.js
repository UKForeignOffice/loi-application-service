/**
 * Created by preciousr on 17/05/2016.
 */
module.exports = {


    startPage: function(req,res){
        if(sails.config.views.locals.service_public){
            return res.redirect(sails.config.views.locals.start_url);
        }
        else{
            return res.view('index');
        }
    },
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
    },

    healthcheck: function(req, res) {
        res.json({ message:'Application Service is running' });
    }
};