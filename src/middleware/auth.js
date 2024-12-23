module.exports = (req, res, next) => {
  if (req.session.userName) {
    return next();
  } else {
    res.render('./partials/no_acount')
  }
};