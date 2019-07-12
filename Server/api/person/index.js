var express = require('express')
var router = express.Router();
var mongodb = require('mongodb');
const common = require('../common')

const userCollection = "share.user"

router.post('/home', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_1', '0']

    new common().CheckIdentity(info.i, info.p).then((i, _) => {
        if (!i.result) {
            response.message = i.message
            res.status(200).json(response)
        }
        else {
            new common().CheckPermission(info.p, module).then((i) => {
                if (!i.result) {
                    response.message = i.message
                    res.status(200).json(response)
                }
                else {
                    home(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

function home(req, res) {

    return new Promise((resolve, _) => {
        new common().Connect().then((dbo) => {
            dbo.collection(userCollection).find({
                "_id": mongodb.ObjectId(req.body._id)
            }).toArray(function (_, r) {
                if (r.length > 0) {
                    res.result = true
                    res.message = r.filter((v) => {
                        delete v.passWord
                        delete v.permission
                        return v
                    })[0]
                }
                else {
                    res.message = '没有相关数据.'
                }
                resolve(res)
            })
        })
    })
}

module.exports = router