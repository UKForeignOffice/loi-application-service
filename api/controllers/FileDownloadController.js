const sails = require('sails');
const request = require('request');
const prepareAPIOptions = require('../helpers/prepareAPIOptions');

const FileDownloadController = {
    downloadFileHandler(req, res) {
        try {
            const apiOptions = FileDownloadController._prepareAPIOptions(req);
            FileDownloadController._streamFileToClient(apiOptions, req, res);
        } catch (err) {
            sails.log.error(err);
            return res.serverError();
        }
    },


    _prepareAPIOptions(req) {
        if (req.params.apostilleRef === 'undefined') {
            throw new Error('Missing apostille reference');
        }

        return prepareAPIOptions({
            url: customURLs.apostilleDownloadAPIURL,
            req,
            refParam: { apostilleReference: req.params.apostilleRef },
        });
    },

    _streamFileToClient(options, req, res) {
        sails.log.info('Downloading file from Casebook');
        request
            .get(options)
            .on('error', (err) => {
                throw new Error(err);
            })
            .on('response', (res) => {
                FileDownloadController._renamePDFFromHeader(req, res);
            })
            .pipe(res)
            .on('finish', () => {
                sails.log.info('File successfully downloaded');
            });
    },

    _renamePDFFromHeader(req, res) {
        res.headers[
            'content-disposition'
        ] = `attachment; filename=LegalisedDocument-${req.params.apostilleRef}.pdf`;
    },
};

module.exports = FileDownloadController;
