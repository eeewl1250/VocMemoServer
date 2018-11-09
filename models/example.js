var mongoose = require('mongoose')

var exampleSchema = new mongoose.Schema({
    sentence: String,
    source: [mongoose.Schema.Types.ObjectId]
})

exampleSchema.index({ sentence: 1 })

module.exports = mongoose.model('example', exampleSchema)