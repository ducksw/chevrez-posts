require('dotenv').config();

module.exports = {
  database: {
    // URI: 'mongodb://localhost/testing'
    URI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.b9esx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
  }
}
