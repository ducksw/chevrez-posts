const moment = require('moment')
const helpers = {}

helpers.timeago = timestamp => {
  return moment(timestamp).startOf('minutes').fromNow(true)
}

module.exports = helpers

/*
module.exports = {
  eq: (a, b) => {
    if (a == null || b == null) {
      return false;
    }
    return a.toString() === b.toString();
  },
};
*/
