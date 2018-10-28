const express = require('express')
const Jwt = require('../jwt.js')
const User = require('../models/user')
const Token = require('../models/token')

const router = express.Router()

router.post('/', (req, res) => {
    let newUser = {
        name: req.body.name,
        password: req.body.password
    }
    User.create(newUser, (err, user) => {
        if (err) {
            console.log('User Create Err: ' + err)
            res.json({
                code: 0,
                msg: 'Post-end Error.'
            })
        } else {
            // 注册后，直接转到登录状态
            const userToken = {
                name: user.name,
                token: Jwt.encodeToken({ name: user.name })
            }
            Token.create(userToken, (err, token) => {
                if (err) {
                    console.log('Token Create Err: ' + err)
                    res.json({
                        code: 0,
                        msg: 'Post-end Error.'
                    })
                } else {
                    res.cookie('token', token.token, {
                        signed: false,
                        maxAge: 7 * 24 * 60 * 60,
                        httpOnly: true
                    })
                    res.json({
                        code: 1,
                        msg: 'Insert new user. Success.',
                        data: {
                            name: user.name
                        }
                    })
                }
            })
        }
    })
})

router.post('/name', (req, res) => {
    User.findOne({name: req.body.name}, (err, user) => {
        if (err) {
            console.log('Username Query Err: ' + err)
            res.json({
                code: 0,
                msg: 'Post-end Error.'
            })
        } else if (user) {
            res.json({
                code: 1,
                msg: 'User get. Success.',
                data: {
                    name: user.name
                }
            })
        } else {
            res.json({
                code: 0,
                msg: 'User not found. Fail.'
            })
        }
    })
})

module.exports = router

