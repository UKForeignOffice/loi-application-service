/**
 * Prevent caching of page content
 * @param req
 * @param res
 * @param next
 */

module.exports = function (req, res, next) {
    //sails.log.info("Applying disable cache policy");
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
};