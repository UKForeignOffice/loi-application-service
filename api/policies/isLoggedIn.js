const sails = require('sails')
module.exports = (req, res, next) => {
  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  if (req.session.authenticated) {
    return next()
  } else {
    return res.redirect(sails.config.customURLs.userServiceURL)
  }
}
