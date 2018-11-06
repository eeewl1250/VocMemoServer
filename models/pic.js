const mongoose = require('mongoose')
const picSchema= new mongoose.Schema({
    link: String,
    chs: String,
    eng: String,
    data: String
},  {
    autoIndex: false
})

picSchema.index({ chs: 'text', eng: 'text' })

module.exports = mongoose.model('pic', picSchema)