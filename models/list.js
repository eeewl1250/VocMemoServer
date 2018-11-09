const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
    name: String,
    description: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    words: [{
        word: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'word'
        },
        example: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'example'
        }
    }]
})

module.exports = new mongoose.model('list', listSchema)