const sails = require('sails');
const stream = require('stream');
const util = require('util');
const CasebookService = require('../services/CasebookService');

const ReceiptDownloadController = {
    async getReceipt(req, res) {
        try {
            await ReceiptDownloadController._streamReceiptToClient(req, res);
        } catch (err) {
            sails.log.error(err);
            return res.serverError();
        }
    },

    async _streamReceiptToClient(req, res) {
        try {
            ReceiptDownloadController._errorChecks(req, res);
            sails.log.info('Downloading receipt from Casebook');

            const streamFinished = util.promisify(stream.finished);
            const response = await CasebookService.getApplicationReceipt(
                req.params.applicationRef
            );
            response.data.pipe(res);

            return streamFinished(res);
        } catch (err) {
            throw new Error(`ReceiptDownloadController Error: ${err}`);
        }
    },

    _errorChecks(req, res) {
        const userData = HelperService.getUserData(req, res);
        if (!userData.loggedIn) {
            throw new Error('User is not logged in');
        }
        if (req.params.applicationRef === 'undefined') {
            throw new Error('Missing application reference');
        }
    },
};

module.exports = {
    getReceipt: ReceiptDownloadController.getReceipt,
};
