const express = require('express')
const Jwt = require('../jwt.js')
const User = require('../models/user')
const Token = require('../models/token')
const Configs = require('../assets/global')

const router = express.Router()

router.post('/', (req, res) => {
    let reqToken = req.cookies.token
    if (reqToken) { // token验证
        Token.findOne({token: reqToken}, (err, token) => {
            if (err) {
                console.log('Token Query Err: ' + err)
                res.json({
                    code: 0,
                    msg: 'Post-end Error.'
                })
            } else if (token) { // token存在
                if (token.expire - Date.now()) { // token未过期
                    res.json({
                        code: 1,
                        msg: 'Token get. Success.',
                        data: {
                            name: token.name
                        }
                    })
                } else { // token过期
                    res.clearCookie(Configs.cookie.name)
                    res.json({
                        code: 0,
                        msg: 'Token expired.'
                    })
                }
            } else {
                res.clearCookie(Configs.cookie.name)
                res.json({
                    code: 0,
                    msg: 'Token not found.'
                })
            }
        })
    } else { // 用户名密码验证
        User.findOne({name: req.body.name, password: req.body.password}, (err, user) => {
            if (err) {
                console.log('Query Err: ' + err)
                res.json({
                    code: 0,
                    msg: 'Post-end Error.'
                })
            } else if (user) { // 存在用户
                // 删除已存在token，再插入新token
                Token.deleteMany({name: user.name}, (err, tRes) => {
                    if (err) {
                        console.log('Token Remove Err: ' + err)
                        res.json({
                            code: 0,
                            msg: 'Post-end Error.'
                        })
                    } else if (tRes.ok) {
                        const userToken = {
                            name: user.name,
                            expire: new Date(Date.now() + Configs.cookie.maxAge),
                            token: Jwt.encodeToken({name: user.name})
                        }
                        Token.create(userToken, (err, token) => {
                            if (err) {
                                console.log('Create Err: ' + err)
                                res.json({
                                    code: 0,
                                    msg: 'Post-end Error.'
                                })
                            } else {
                                res.cookie('token', token.token, {
                                    signed: false,
                                    maxAge: Configs.cookie.maxAge
                                })
                                res.json({
                                    code: 1,
                                    msg: 'User get. Success.',
                                    data: {
                                        name: user.name
                                    }
                                })
                            }
                        })
                    } else {
                        console.log('Delete Err: ' + err)
                        res.json({
                            code: 0,
                            msg: 'Delete Fail.'
                        })
                    }
                })
            } else {
                res.json({
                    code: 0,
                    msg: 'User not found.'
                })
            }
        })
    }
})

router.post('/token', (req, res) => {
    let reqToken = req.cookies.token
    if (reqToken) {
        Token.findOne({token: reqToken}, (err, token) => {
            if (err) {
                console.log('Token Query Err: ' + err)
                res.json({
                    code: 0,
                    msg: 'Post-end Error.'
                })
            } else if (token) {
                res.json({
                    code: 1,
                    msg: 'Token get. Success.',
                    data: {
                        name: token.name
                    }
                })
            } else {
                res.clearCookie(Configs.cookie.name)
                res.json({
                    code: 0,
                    msg: 'Collection: Token not found.'
                })
            }
        })
    } else {
        res.json({
            code: 0,
            msg: 'Cookie: Token not found.'
        })
    }
})

router.post('/logout', (req, res) => {
    let reqToken = req.cookies.token ? req.cookies.token : req.body.token
    let name = req.body.name
    if (name) { // 用户名必须有
        if (reqToken) {
            Token.deleteMany({token: reqToken, name: name}, (err, tRes) => {
                if (err) {
                    console.log('Token Delete Error: ' + err)
                    res.json({
                        code: 0,
                        msg: 'Post-end Error.'
                    })
                }
                else if (tRes.n) { // token存在，且删除
                    res.clearCookie(Configs.cookie.name)
                    res.json({
                        code: 1,
                        msg: 'Token Found. Logout success.'
                    })
                }
                else { // 该token不存在于数据库, 继续验证用户名
                    userCheck(res, name)
                }
            })
        } else { // 通过用户名查找token并删除
            userCheck(res, name)
        }
    } else { // 缺少用户名
        console.log('Front-end Error.')
        res.json({
            code: 0,
            msg: 'Front-end Error. Username missing.'
        })
    }
})

function userCheck(res, name) {
    Token.deleteMany({name: name}, (err, tRes) => {
        if (err) {
            console.log('Token Delete Error: ' + err)
            res.json({
                code: 0,
                msg: 'Post-end Error.'
            })
        } else if (tRes.ok) { // token已删除
            res.clearCookie(Configs.cookie.name)
            res.json({
                code: 1,
                msg: 'Logout success.'
            })
        } else { // token未删除
            console.log('Token Delete Error: ' + err)
            res.json({
                code: 0,
                msg: 'Unknown Error.'
            })
        }
    })
}

module.exports = router