var mongoose = require('mongoose')

var exampleSchema = new mongoose.Schema({
    sentence: String,
    source: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book'
    }]
})

exampleSchema.index({ sentence: 1 })

module.exports = mongoose.model('example', exampleSchema)