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
    },



    /**
     * @function navigate
     * @description Redirect external links through an internal route meaning that all external routes should have the same referrer.
     * @param req {Array} - request object
     * @param res {Array} - response object
     * @return confirmation action
     */
    navigate: function(req, res) {
        //check that the application has not already been queued or submitted
        var url = req.query.url;
   //     return res.redirect(url);

        res.send(' <html xmlns="http://www.w3.org/1999/xhtml"><head><title></title><meta http-equiv="refresh" content="0;URL='+
        "'" + url + "'\""+
        '/></head><body></body></html>');
    }
 };