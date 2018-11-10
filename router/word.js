const express = require('express')
const router = express.Router()

const path = require('path')

const Example = require('../models/example')
const User = require('../models/user')
const Book = require('../models/book')
const Word = require('../models/word')

// 文件操作
const lineByLine = require('n-readlines')
const liner = new lineByLine(path.resolve(__dirname, '../assets/dict/geWord.txt'))

// 新建list
router.post('/list', (req, res) => {
    User.findOne({name: 'bucky'}, (err, user) => {
        if (err) {
            console.log(err)
        } else {

        }
    })
})

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

// 新增word
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

// 新增example
router.post('/exp', (req, res) => {
    if (!req.body.sentence || !req.body.source) {
        console.log('Front-end Error: Parameter Missing.')
        res.json({
            code: 0,
            msg: 'Front-end Error: Parameter Missing.'
        })
    }
    Example.create({
        sentence: req.body.sentence,
        source: req.body.source
    }, (err, exp) => {
        if (err) {
            console.log('Example Create Err: ' + err)
            res.json({
                code: -1,
                msg: 'Post-end Error.'
            })
        } else {
            res.json({
                code: 1,
                msg: 'Insert new example. Success.',
                data: {
                    id: exp._id,
                    sentence: exp.sentence,
                    source: exp.source
                }
            })
        }
    })
})

// 查询example是否存在
router.post('/exp/find', (req, res) => {
    if (!req.body.sentence || !req.body.source) {
        console.log('Front-end Error: Parameter Missing.')
        res.json({
            code: 0,
            msg: 'Front-end Error: Parameter Missing.'
        })
    }
    Example.findOne({
        sentence: req.body.sentence,
        source: req.body.source
    }, (err, sentence) => {
        if (err) {
            console.log('Example Query Err: ' + err)
            res.json({
                code: -1,
                msg: 'Post-end Error.'
            })
        } else if (!sentence) {
            res.json({
                code: 0,
                msg: 'No Example found.'
            })
        } else {
            res.json({
                code: 1,
                msg: 'Get Example successfully.'
            })
        }
    })
})

// 新增book
router.post('/book', (req, res) => {
    if (!req.body.code || !req.body.name) {
        console.log('Front-end Error: Parameter Missing.')
        res.json({
            code: 0,
            msg: 'Front-end Error: Parameter Missing.'
        })
    }
    Book.create({
        code: req.body.code,
        name: req.body.name
    }, (err, book) => {
        if (err) {
            console.log('Book Create Err: ' + err)
            res.json({
                code: 0,
                msg: 'Post-end Error.'
            })
        } else {
            res.json({
                code: 1,
                msg: 'Insert new Book. Success.',
                data: {
                    id: book._id
                }
            })
        }
    })
})

// 生成book code
router.post('/book/code', (req, res) => {
    if (!req.body.lang) {
        console.log('Front-end Error: Parameter Missing.')
        res.json({
            code: 0,
            msg: 'Front-end Error: Parameter Missing.'
        })
    }
    Book.$where('this.code.match(/' + req.body.lang + '/)')
        .count((err, count) => {
            if (err) {
                console.log('Book Query Err: ' + err)
                res.json({
                    code: 0,
                    msg: 'Post-end Error.'
                })
            } else {
                res.json({
                    code: 1,
                    msg: 'Get Book Code successfully.',
                    data: {
                        code: req.body.lang + (Array(3).join('0') + (count + 1)).slice(-3)
                    }
                })
            }
        })
})

// 查询book
router.post('/book/find', (req, res) => {
    if (!req.body.name) {
        console.log('Front-end Error: Parameter Missing.')
        res.json({
            code: 0,
            msg: 'Front-end Error: Parameter Missing.'
        })
    }
    Book.$where('this.name.match(/' + req.body.name + '/i)')
        .exec((err, books) => {
            if (err) {
                console.log('Book Query Err: ' + err)
                res.json({
                    code: 0,
                    msg: 'Post-end Error.'
                })
            } else if (books.length <= 0) {
                res.json({
                    code: 0,
                    msg: 'No book found.'
                })
            } else {
                res.json({
                    code: 1,
                    msg: 'Get Book successfully.',
                    data: {
                        books: books
                    }
                })
            }
        })
})

module.exports = router