const SummaryController = require('./SummaryController')
const { Application } = require('../models')

const SHA1_REGEX = /^[a-f0-9]{40}$/i

const OpenPaperAppController = {
  /**
   * @function openCoverSheet
   * @description Open the cover sheet
   * @param req {Object}
   * @param res {Object}
   */
  async openCoverSheet(req, res) {
    try {
      const { unique_app_id, application_guid } = req.params
      const sessionUserId = req.session?.passport?.user

      const isValidGuid = typeof application_guid === 'string' && SHA1_REGEX.test(application_guid)

      // -------------------------------
      // Case 1: No GUID or invalid GUID
      // -------------------------------
      if (!isValidGuid) {
        const application = await Application.findOne({
          where: { unique_app_id },
        })

        if (!application) {
          return res.status(404).send({ message: 'Application not found' })
        }

        // User must be logged in and own the application
        if (!sessionUserId || application.user_id !== sessionUserId) {
          console.error('Unauthorised access attempt to cover sheet')
          return res.status(500).send({ message: 'Server error' })
        }

        req.session.appId = application.application_id

        return SummaryController.fetchAll(req, res, true, false, true)
      }

      // -------------------------------
      // Case 2: Valid SHA-1 GUID
      // -------------------------------
      const application = await Application.findOne({
        where: {
          unique_app_id,
          application_guid,
        },
      })

      if (!application) {
        return res.status(404).send({ message: 'Application not found' })
      }

      req.session.appId = application.application_id

      return SummaryController.fetchAll(req, res, true, false, true)
    } catch (error) {
      console.error('Error opening cover sheet:', error)
      return res.status(500).send({ message: 'Server error' })
    }
  },
}

module.exports = OpenPaperAppController
