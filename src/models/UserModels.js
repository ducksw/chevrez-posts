const mongoose = require('mongoose');
const { Schema, model } = mongoose

const bcrypt = require('bcrypt')
const path = require('path')

const formatDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const userSchema = new Schema ({
  name: { type: String, required: true },
  password: { type: String, required: true },
  gravatar: { type: String },
  email: { type: String, required: true },
  estado: { type: String, required: true },
  time: { type: String, default: formatDate, required: true, match: /^\d{2}\/\d{2}\/\d{2}$/ },
})

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = model('UserModel', userSchema)
