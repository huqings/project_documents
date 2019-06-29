var express = require('express')
var router = express.Router();

const common = require('../common')
const systemCollection = 'system'
const logsCollection = 'logs'

router.post('/home', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_5', '0']

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
                    home(response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/log', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    var response = {
        result: false
    }

    let module = ['_5', '0']

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
                    log(response).then(r => {
                        res.status(200).json(r)
                    })
                }
            })
        }
    })
})

function home(response) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo, _) => {
            dbo.collection(systemCollection).find(
                {}, {
                    projection: {
                        _id: 0
                    }
                }
            ).toArray((err, r) => {
                if (err) throw err
                if (r.length > 0) {
                    response.result = true
                    response.message = {
                        serverinfo: r.filter(x => x.tab === 0)[0],
                        fileupload: r.filter(x => x.tab === 1)[0],
                        quotaAndexpire: r.filter(x => x.tab === 2)[0],
                        archive: r.filter(x => x.tab === 3)[0],
                        erase: r.filter(x => x.tab === 4)[0],
                    }
                }
                else {
                    response.message = '添加失败.'
                }
                resolve(response)
            })
        })
    })
}

function log(response) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo, _) => {
            dbo.collection(logsCollection).find().limit(10).toArray((_, r) => {
                if (r.length > 0) {
                    response.result = true
                    response.message = r
                }
                else {
                    response.message = '添加失败.'
                }
                resolve(response)
            })
        })
    })
}

module.exports = router