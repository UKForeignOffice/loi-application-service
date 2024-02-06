const axios = require('axios');
const sails = require('sails');
const stream = require('stream');
const util = require('util');
const CasebookService = require('../services/CasebookService');
const HelperService = require("../services/HelperService");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand, S3 } = require("@aws-sdk/client-s3");
const Application = require('../models/index').Application;
const s3 = new S3();

const FileDownloadController = {
    async downloadFileHandler(req, res) {
        try {

            const isOrbitApplication =
                await HelperService.isOrbitApplication(req.params.unique_app_id)

            const apostilleRefBelongstoApp =
                await FileDownloadController._apostilleRefBelongToApplication(
                    req,
                    res,
                    isOrbitApplication
                );

            if (!apostilleRefBelongstoApp) {
                sails.log.error(
                    'Apostille ref does not belong to this application'
                );
                return res.serverError();
            }

            await FileDownloadController._checkSessionUserIdMatchesApp(
                req,
                res
            );

            if (isOrbitApplication) {
                await FileDownloadController._streamOrbitFileToClient(req, res);
            } else {
                await FileDownloadController._streamFileToClient(req, res);
            }

        } catch (err) {
            sails.log.error(err);
            return res.serverError();
        }
    },

    _urlErrorChecks(req, res) {
        if (req.params.apostilleRef === 'undefined') {
            throw new Error('Missing apostille reference');
        }

      if (req.params.storageLocation === 'undefined') {
        throw new Error('Missing document storage location');
      }

        const userData = HelperService.getUserData(req, res);
        if (!userData.loggedIn) {
            throw new Error('User is not logged in');
        }

        if (!req.params.unique_app_id) {
            throw new Error('Application ID not found');
        }
    },

    _apostilleRefBelongToApplication(req, res, isOrbitApplication) {
        FileDownloadController._urlErrorChecks(req, res);
        const applicationRef = req.params.unique_app_id;

      if (isOrbitApplication) {
        return CasebookService.getApplicationStatusFromOrbit([applicationRef])
          .then((response) => {
            const appInfo = response[0];
            if (appInfo) {
              const apostilleRefs = appInfo.documents.map(
                (document) => document.apostilleReference
              );

              return apostilleRefs.includes(req.params.apostilleRef);
            }

            return false;
          })
          .catch((err) => {
            sails.log.error(err);
            res.serverError();
          });
      } else {
        return CasebookService.getApplicationStatus(applicationRef)
          .then((response) => {
            const appInfo = response.data[0];
            if (appInfo) {
              const apostilleRefs = appInfo.documents.map(
                (document) => document.apostilleReference
              );

              return apostilleRefs.includes(req.params.apostilleRef);
            }

            return false;
          })
          .catch((err) => {
            sails.log.error(err);
            res.serverError();
          });
      }

    },

    async _checkSessionUserIdMatchesApp(req, res) {
        const applicationTableData = await Application.findOne({
            where: { unique_app_id: req.params.unique_app_id },
        });

        if (applicationTableData.user_id !== req.session.user.id) {
            sails.log.error('User is not authorised to download this document');
            res.serverError();
        }
    },

    async _streamFileToClient(req, res) {
        try {
            const apostilleReference = req.params.apostilleRef;

            sails.log.info(`Downloading file from Casebook, apostille Ref: ${apostilleReference}`);

            const response = await CasebookService.getApostilleDownload(
                apostilleReference
            );
            response.data.pipe(res);

            const streamFinished = util.promisify(stream.finished);
            return streamFinished(res);
        } catch (err) {
            throw new Error(`_streamFileToClient Error: ${err}`);
        }
    },

    async _streamOrbitFileToClient(req, res) {
      try {
        const apostilleReference = req.params.apostilleRef;
        const applicationRef = req.params.unique_app_id;
        const storageLocation = Buffer.from(req.params.storageLocation, 'base64').toString();

        sails.log.info(`Downloading file from S3, apostille Ref: ${apostilleReference}`);

        const { orbit_bucket: s3Bucket, orbit_url_expiry_hours: s3UrlExpiryHours } =
          req._sails.config.upload;

        const url = await FileDownloadController._generateOrbitApostilleUrl(apostilleReference, {s3Bucket, s3UrlExpiryHours}, storageLocation)

        if (!url) { console.error(`Unable to generate pre-signed url for ${apostilleReference}, applicationRef ${applicationRef}`) }

        axios({
          url: url,
          method: 'GET',
          responseType: 'stream',
          headers: {
            'Content-Type': 'application/pdf'
          }
        }).then(response => {
          response.data.pipe(res);
          const streamFinished = util.promisify(stream.finished);
          return streamFinished(res);
        }).catch(error => {
          console.error(error);
        });

      } catch (err) {
        throw new Error(`_streamOrbitFileToClient Error: ${err}`);
      }
    },

    async _generateOrbitApostilleUrl(apostilleRef, config, storageLocation) {
      const EXPIRY_SECONDS = config.s3UrlExpiryHours * 60 * 60;
      const params = {
        Bucket: config.s3Bucket,
        Key: storageLocation,
      };

      const promise = getSignedUrl(s3, new GetObjectCommand(params), { expiresIn: EXPIRY_SECONDS });

      return promise.then(
        (url) => {
          sails.log.info(`Presigned url generated for ${apostilleRef} apostille`);
          console.log(`${url}`)
          return url;
        },
        (err) => {
          throw new Error(err);
        }
      );
    },
};

module.exports = FileDownloadController;
