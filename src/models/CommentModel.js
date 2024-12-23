const mongoose = require('mongoose');
const { Schema, model } = mongoose
const ObjectId = Schema.ObjectId

const formatDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const formatTime = () => {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  let period = hours >= 12 ? 'PM' : 'AM';

  let formattedHours = hours % 12 || 12;

  return `${formattedHours}:${formattedMinutes} ${period}`;

}

const commentSchema = Schema ({
  post_id: { type: Schema.Types.ObjectId, ref: 'PostsModel', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
  comment: { type: String, required: true },
  fecha: { type: String, default: formatDate, required: true, match: /^\d{2}\/\d{2}\/\d{2}$/ },
  tiempo: { type: String, default: formatTime, required: true, match: /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/ }
})

module.exports = model('Comment', commentSchema)
