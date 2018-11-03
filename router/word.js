const express = require('express')
const Example = require('../models/example')
const Book = require('../models/book')
const Word = require('../models/word')

const router = express.Router()

router.post('/word', (req, res) => {
    Word.create({
        word: req.body.name,
        mean: [{
            class: req.body.class,
            gender: req.body.gender || '',
            plural: req.body.plural || '',
            mean: req.body.mean,
            example: [req.body.example]
        }]
    }, (err, word) => {
        if (err) {
            console.log(err)
        } else {
            res.json(word)
        }
    })
})

router.post('/exp', (req, res) => {
    Book.findOne({code: req.body.code}, (err, book) => {
        if (err) {
            console.log('Book Query Err: ' + err)
            res.json({
                code: 0,
                msg: 'Post-end Error.'
            })
        } else {
            Example.create({
                sentence: req.body.sentence,
                source: [book.name]
            }, (err, exp) => {
                if (err) {
                    console.log('Example Create Err: ' + err)
                    res.json({
                        code: 0,
                        msg: 'Post-end Error.'
                    })
                } else {
                    res.json({
                        code: 1,
                        msg: 'Insert new example. Success.',
                        data: {
                            id: exp._id,
                            sentence: exp.sentence
                        }
                    })
                }
            })
        }
    })
})

router.post('/book', (req, res) => {
    Book.create({
        code: req.body.code,
        name: req.body.name
    }, (err, exp) => {
        if (err) {
            console.log('Example Create Err: ' + err)
            res.json({
                code: 0,
                msg: 'Post-end Error.'
            })
        } else {
            res.json({
                code: 1,
                msg: 'Insert new example. Success.',
                data: {
                    id: exp._id
                }
            })
        }
    })
})

module.exports = router