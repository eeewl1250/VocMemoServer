var mongoose = require('mongoose')

var exampleSchema = new mongoose.Schema({
    sentence: String,
    source: Array
})

exampleSchema.index({ sentence: 1 })

module.exports = mongoose.model('example', exampleSchema)