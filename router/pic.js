const express = require('express')
const request = require('request')
const Pic = require('../models/pic')

const router = express.Router()

router.post('/', (req, res) => {
    let options = {
        url: req.body.url,
        encoding: null
    }
    request(options, (error, response, buffer) => {
        if (error) {
            console.log(error)
        }
        let imgBase64 = '<img src="data:image/jpg;base64,'
            + (buffer.toString('base64'))
            + '" />'
        Pic.create({
            link: 'http://112232',
            chs: '早晨',
            eng: 'morning',
            data: imgBase64
        }, (err, img) => {
            if (err) {
                console.log('Post-end Error: ' + err)
                res.json({
                    code: 0,
                    msg: 'Post-end Error.'
                })
            } else {
                res.json({
                    code: 1,
                    msg: 'Insert new user. Success.',
                    data: {
                        id: img._id
                    }
                })
            }
        })
    })
})

module.exports = router
