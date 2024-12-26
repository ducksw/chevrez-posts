require('dotenv').config();

module.exports = {
  database: {
    //URI: 'mongodb://localhost/testing'
    //URI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.b9esx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
    //URI: process.env.MONGODB_URI
    URI: 'mongodb+srv://ducks:JemiWi4EL2CKtvcF@cluster0.b9esx.mongodb.net/bd_chevrez?retryWrites=true&w=majority&appName=Cluster0'
  }
}
