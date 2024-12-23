const mongoose = require('mongoose');
const { Schema, model } = mongoose

const bcrypt = require('bcrypt')

const DEFAULT_ADMIN = "chevrez"
const DEFAULT_PASSWORD = "chevrezadmin"

const adminSchema = new Schema ({
  name: { type: String, default: DEFAULT_ADMIN },
  password: { type: String, default: DEFAULT_PASSWORD },
})

adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

adminSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = model('AdminModel', adminSchema)
