const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({
    word: String,
    mean: [{
        class: String,
        gender: { type: String, default: '' },
        plural: { type: String, default: '' },
        mean: String,
        example: [Schema.Types.objectId]
    }]
})

module.exports = mongoose.model('word', wordSchema)