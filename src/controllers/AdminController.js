const ad = {}

const Admin = require('../models/AdminModel')

ad.index = async(req, res) => {
  const adminName = req.session.adminName || null;
  console.log("adminName", adminName)
  res.render('admin', { adminName })
}

ad.login = async(req, res) => {
  try {
    const trimName = req.body.name.trim();
    const trimPass = req.body.password.trim();

    let admin_con = await Admin.findOne({ name: trimName });

    if (!admin_con) {
      admin_con = new Admin({ name: "chevrez", password: "chevrezadmin" });
      await admin_con.save();
    }

    if (!admin_con.comparePassword(trimPass)) {
      return res.send("Usuario o Contraseña incorrecta");
    }

    req.session.adminName = admin_con.name;
    res.redirect('/index');
  } catch (error) {
    console.log(error);
  }
};

ad.views = async(req, res) => {
  try {
    const admins = await Admin.find()

    res.render('team', { admins })
  } catch (error) {
      console.error(error)
      res.status(500).send('FAIL')
  }
}

module.exports = ad
