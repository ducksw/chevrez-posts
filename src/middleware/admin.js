const Admin = require('../models/AdminModel');

module.exports = async (req, res, next) => {
  try {
    const adminName = req.session.adminName;
    if (!adminName) {
      return res.status(403).send('Access denied. Only admins can create posts.');
    }

    const admin = await Admin.findOne({ name: adminName });
    if (!admin) {
      return res.status(403).send('Access denied. Only admins can create posts.');
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};