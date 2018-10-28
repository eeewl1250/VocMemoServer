var mongoose = require('mongoose')

var tokenSchema = new mongoose.Schema({
    name: String,
    expire: Date,
    token: String
})

module.exports = mongoose.model('token', tokenSchema)