const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    code: String,
    name: String
})

bookSchema.index({ code: 1 })

module.exports = mongoose.model('book', bookSchema)
