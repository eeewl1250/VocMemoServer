const jwt = require('jsonwebtoken')

const secret = 'VOC_MEMO_USER'

var Jwt = {
    encodeToken: payload => {
        return jwt.sign(payload, secret)
    },
    verifyToken: token => {
        return jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                console.log(err.message)
                return false
            }
            return decoded
        })
    }
}

module.exports = Jwt