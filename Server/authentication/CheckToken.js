const jwt = require('jsonwebtoken')
const config = require('./TokenConfig')

module.exports = (req, res, next) => {
    const token = req.query.token || req.headers['x-access-token']

    let response = {
        result: false,
        message: null
    }

    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                response.message = '访问授权失败,请重新登录!'
                return res.status(200).json(response);
            }

            next()
        })
    }
    else {
        response.message = '访问授权无效,请重新登录!'
        return res.json(response);
    }
}