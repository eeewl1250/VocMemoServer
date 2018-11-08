const express = require('express')
const router = express.Router()

const path = require('path')

const Example = require('../models/example')
const Book = require('../models/book')
const Word = require('../models/word')

// 文件操作
const lineByLine = require('n-readlines')
const liner = new lineByLine(path.resolve(__dirname, '../assets/dict/geWord.txt'))

// 初始化单词库，导入单词及名词一二格与复数
router.post('/init', (req, res) => {
    let line
    let lineNumber = 0

    let words = []

    while (line = liner.next()) {
        console.log('Line ' + lineNumber)

        let arr = line.toString().split('|')
        let word = arr[0]
        let nominative = (arr[1] ? arr[1] : '').match(/(die|der|das)/) ? arr[1] : ''
        let wClass = nominative ? 'noun' : ''

        let pArr = (arr[2] ? arr[2] : '').split(/,\s*/)
        let genitive = pArr[0]
        let plural = pArr[1] ? pArr[1] : pArr[0]

        words.push({
            word: word,
            mean: [{
                class: wClass,
                nominative: nominative,
                genitive: genitive,
                plural: plural
            }]
        })

        lineNumber++
    }

    Word.insertMany(words, (err) => {
        if (err) {
            console.log('Words Init Error: ' + err)
            res.json({
                code: 0,
                msg: 'Post-end Error.'
            })
        } else {
            res.json({
                code: 1,
                msg: 'Words Insert Success.'
            })
        }
    })
})

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