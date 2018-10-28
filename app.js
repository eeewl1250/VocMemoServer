// token
const jwt = require('jsonwebtoken')
const secret = 'VOC_MEMO_USER'

// express
const express = require('express')
const app = express()

// mongodb
var url = 'mongodb://localhost:27017/vocMemorize'
const mongoose = require('mongoose')
mongoose.connect(url, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('db connect success')
    }
})

// 用来解析req.body.**的**部分内容
// 放在路由前面
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false})) // 调试工具如果出现警告请加上extended: false

// 解析cookie
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// 路由
var login = require('./router/login.js')
app.use('/login', login)

var register = require('./router/register.js')
app.use('/register', register)

app.listen(3000, console.log('App listening at 3000.'))
