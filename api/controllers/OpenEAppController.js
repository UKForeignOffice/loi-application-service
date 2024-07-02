const sails = require('sails');
const stream = require('stream');
const util = require('util');
const OrbitService = require('../services/OrbitService');
const ExportedEAppData = require('../models/index').ExportedEAppData;
const Application = require('../models/index').Application;
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const HelperService = require("../services/HelperService");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand, S3 } = require("@aws-sdk/client-s3");
const s3 = new S3();
const axios = require("axios");
dayjs.extend(duration);

const OpenEAppController = {
    async renderPage(req, res) {
        const userData = HelperService.getUserData(req, res);
        if (!userData.loggedIn) {
            sails.log.error('Users not logged in - redirect to sign in page');
            return res.redirect(`${req._sails.config.customURLs.userServiceURL}/sign-in?eappid=${req.params.unique_app_id}`);
        }

        try {
            if (req.params.unique_app_id === 'undefined') {
                throw new Error('renderPage: Missing application reference');
            }

            const applicationTableData = await Application.findOne({
                where: { unique_app_id: req.params.unique_app_id },
            });

            if (applicationTableData.user_id !== req.session.user.id) {
                sails.log.error('User not authorised to view this application');
                return res.forbidden('Unauthorised');
            }

            const caseManagementResponse = await OpenEAppController._getApplicationDataFromOrbit(
              req,
              res
            );

            const [caseManagementData] = caseManagementResponse;
            const caseManagementStatus = caseManagementData.status || 'Not available';
            const caseManagementDocuments = caseManagementData.documents || [];
            const caseManagementReceiptLocation = caseManagementData.receiptFilename;


            const pageData = OpenEAppController._formatDataForPage(
                applicationTableData,
                caseManagementData
            );
            const userRef = await OpenEAppController._getUserRef(
                caseManagementData,
                res
            );
            const daysLeftToDownload =
              caseManagementStatus === 'Completed'
                    ? OpenEAppController._calculateDaysLeftToDownload(
                          caseManagementData,
                          req
                      )
                    : 0;
            const applicationExpired =
                OpenEAppController._hasApplicationExpired(
                    caseManagementData,
                    daysLeftToDownload
                );

            const noOfRejectedDocs =
                OpenEAppController._calculateRejectedDocs(caseManagementData);


            res.view('eApostilles/openEApp.ejs', {
                ...pageData,
                userRef,
                user_data: userData,
                daysLeftToDownload,
                applicationExpired,
                applicationStatus: caseManagementStatus,
                allDocumentsRejected:
                    noOfRejectedDocs === caseManagementDocuments.length,
                someDocumentsRejected: noOfRejectedDocs > 0,
                caseManagementReceiptLocation
            });
        } catch (error) {
            sails.log.error(error);
            return res.view('eApostilles/viewEAppError.ejs', {
                user_data: userData,
                applicationId: req.params.unique_app_id,
            });
        }
    },

    async _getApplicationDataFromOrbit(req, res) {
      const applicationReference = [req.params.unique_app_id];

      try {
        return await OrbitService.getApplicationStatusFromOrbit(
          applicationReference
        );
      } catch (error) {
        sails.log.error(error);
        return res.view('eApostilles/viewEAppError.ejs', {
          user_data: HelperService.getUserData(req, res),
          applicationId: applicationReference,
        });
      }
    },

    _formatDataForPage(applicationTableData, caseManagementResponse) {
        if (!caseManagementResponse) {
            throw new Error('No data received from Case Management System');
        }
        if (!caseManagementResponse.documents) {
            throw new Error('No documents found from Case Management System');
        }
        if (!caseManagementResponse.payment) {
            throw new Error('No payment info found from Case Management System');
        }
        if (
            !caseManagementResponse.payment.transactions ||
            caseManagementResponse.payment.transactions.length === 0
            ) {
            throw new Error('No payment transactions found from Case Management System');
        }

        return {
            applicationId: applicationTableData.unique_app_id,
            dateSubmitted: OpenEAppController._formatDate(
                applicationTableData.createdAt
            ),
            dateCompleted: caseManagementResponse.completedDate === null ? 'N/A' : OpenEAppController._formatDate(caseManagementResponse.completedDate),
            documents: caseManagementResponse.documents,
            originalCost: HelperService.formatToUKCurrency(
                caseManagementResponse.payment.transactions[0].amount || 0
            ),
            paymentRef: caseManagementResponse.payment.transactions[0].reference || '',
        };
    },

    _getUserRef(response, res) {
        if (!response.applicationReference) {
            throw new Error('No application reference from Orbit');
        }

        return ExportedEAppData.findOne({
            where: {
                unique_app_id: response.applicationReference,
            },
        })
            .then((data) => {
                return data.dataValues.user_ref;
            })
            .catch((err) => {
                sails.log.error(err);
                return res.serverError();
            });
    },

    _formatDate(date) {
        return dayjs(date).format('DD MMMM YYYY');
    },

    _calculateDaysLeftToDownload(applicationData, req) {
        if (!applicationData.completedDate) {
            throw new Error('No date value found');
        }

        const todaysDate = dayjs(Date.now());
        const timeSinceCompletedDate = todaysDate.diff(
            applicationData.completedDate
        );
        const maxDaysToDownload = dayjs.duration({
            days: Number(req._sails.config.upload.max_days_to_download),
        });
        const timeDifference = dayjs.duration(timeSinceCompletedDate);
        return maxDaysToDownload.subtract(timeDifference).days();
    },

    _hasApplicationExpired(response, daysLeftToDownload) {
        if (
            !response.documents ||
          response.documents.length === 0
        ) {
            throw new Error('No documents found');
        }
        const { documents } = response;
        let expired = false;

        for (let document of documents) {
            const documentDownloadExpired = document.downloadExpired || false;
            if (documentDownloadExpired) {
                expired = true;
                break;
            }
        }

        if (daysLeftToDownload < 0) {
            expired = true;
        }

        return expired;
    },

    async _generateOrbitReceiptUrl(applicationRef, storageLocation, config) {
      const EXPIRY_SECONDS = config.s3UrlExpiryHours * 60 * 60;
      const params = {
        Bucket: config.s3Bucket,
        Key: storageLocation,
      };
      const promise = getSignedUrl(s3, new GetObjectCommand(params), { expiresIn: EXPIRY_SECONDS });

      return promise.then(
        (url) => {
          sails.log.info(
            `Presigned url generated for ${applicationRef} receipt`
          );
          return url;
        },
        (err) => {
          throw new Error(err);
        }
      );
    },

    async downloadReceipt(req, res) {
        try {

          await OpenEAppController._streamOrbitReceiptToClient(req, res);

        } catch (err) {
            sails.log.error(err);
            return res.serverError();
        }
    },

    async _streamOrbitReceiptToClient(req, res) {
      try {
        await OpenEAppController._errorChecks(req, res);
        sails.log.info('Downloading receipt from S3');

        const { orbit_bucket: s3Bucket, orbit_url_expiry_hours: s3UrlExpiryHours } =
          req._sails.config.upload;

        const storageLocation = Buffer.from(req.params.storageLocation, 'base64').toString();

        const url = await OpenEAppController._generateOrbitReceiptUrl(
          req.params.applicationRef,
          storageLocation,
          {s3Bucket, s3UrlExpiryHours}
        );

        if (!url) { console.error(`Unable to generate pre-signed url for ${req.params.applicationRef} receipt`) }

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
        throw new Error(`downloadReceipt Error: ${err}`);
      }
    },

    async _errorChecks(req, res) {
        const userData = HelperService.getUserData(req, res);
        const applicationTableData = await Application.findOne({
            where: { unique_app_id: req.params.applicationRef },
        });

        if (!userData.loggedIn) {
            throw new Error('User is not logged in');
        }

        if (req.params.applicationRef === 'undefined') {
            throw new Error('downloadReceipt: Missing application reference');
        }

        if (req.params.storageLocation === 'undefined') {
          throw new Error('downloadReceipt: Missing receipt file path');
        }

        if (applicationTableData.user_id !== req.session.user.id) {
            throw new Error('User not authorised to download this receipt');
        }
    },

    _calculateRejectedDocs(response) {
        let rejectedDocs = 0;
        if (!response.documents) {
            throw new Error('No documents found from Orbit');
        }
        for (const document of response.documents) {
            const documentStatus = document.status || '';

            if (documentStatus === 'Rejected') {
                rejectedDocs++;
            }
        }
        return rejectedDocs;
    },
};

module.exports = OpenEAppController;
