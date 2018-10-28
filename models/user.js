var mongoose = require('mongoose')

// schema是mongoose里会用到的一种数据模式，可以理解为表结构的定义；
// 每个schema会映射到mongodb中的一个collection，它不具备操作数据库的能力
var userSchema = new mongoose.Schema({
    name: String,
    password: String
})

// model是由schema生成的模型，可以对数据库的操作
module.exports = mongoose.model('user', userSchema)