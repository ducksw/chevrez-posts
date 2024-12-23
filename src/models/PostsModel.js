const mongoose = require('mongoose');
const { Schema, model } = mongoose
const path = require('path')

const formatDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const postSchema = new Schema ({
  title: { type: String },
  user_id: { type: Schema.Types.ObjectId, ref: 'UserModel' },
  parr: { type: String, required: true },
  filename: { type: String },
  date: { type: String, default: formatDate, required: true, match: /^\d{2}\/\d{2}\/\d{2}$/ },
  timestamp: { type: Date, default: Date.now },
})

postSchema.virtual('uniqueId')
  .get(function () {
    return this.filename.replace(path.extname(this.filename), '')
  })

module.exports = model('PostsModel', postSchema)
