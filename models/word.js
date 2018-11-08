const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({
    word: String,
    mean: [{
        chinese: { type: String, default: '' },
        english: { type: String, default: '' },
        class: { type: String, default: '' },
        nominative: { type: String, default: '' },
        genitive: {type: String, default: ''},
        plural: { type: String, default: '' },
        pic: [{
            ref: 'pic',
            type: mongoose.Schema.Types.ObjectId
        }],
        examples: [{
            ref: 'example',
            type: mongoose.Schema.Types.ObjectId
        }]
    }]
})

wordSchema.index({ word: 1 })

module.exports = mongoose.model('word', wordSchema)