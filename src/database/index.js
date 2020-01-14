const mongoose = require('mongoose')

const objMongo = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }

mongoose.connect(
    process.env.MONGO_URL_CONNECTION,
    objMongo
)
module.exports = mongoose