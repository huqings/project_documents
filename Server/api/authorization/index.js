var express = require('express')
var router = express.Router();
var mongodb = require('mongodb');

const common = require('../common')

const roleRollection = "roles"
const userRollection = "users"

router.post('/home', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    new common().CheckIdentity(info.i, info.p).then((i, _) => {
        if (!i.result) {
            response.message = i.message
            res.status(200).json(response)
        }
        else {
            new common().CheckPermission(info.p, req.body.module).then((i) => {
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

router.post('/update', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    new common().CheckIdentity(info.i, info.p).then((i, _) => {
        if (!i.result) {
            response.message = i.message
            res.status(200).json(response)
        }
        else {
            new common().CheckPermission(info.p, req.body.module).then((i) => {
                if (!i.result) {
                    response.message = i.message
                    res.status(200).json(response)
                }
                else {
                    update(req, response).then(v => {
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
            dbo.collection(roleRollection).find().toArray(function (err, result) {
                if (err) throw err
                if (result.length > 0) {
                    res.result = true
                    res.message = result
                }
                else {
                    res.message = '没有相关数据.'
                }
                resolve(res);
            })
        })
    })
    
}

function update(req, res) {

    return new Promise((resolve, _) => {


        let new_permission = {
            "permission": {
                "_1": { "_": `${req.body._1 ? 1 : 0},${req.body._2 ? 1 : 0},${req.body._3 ? 1 : 0},${req.body._4 ? 1 : 0},${req.body._5 ? 1 : 0}` },
                "_2": { "_": `${req.body._6 ? 1 : 0},${req.body._7 ? 1 : 0}` },
                "_3": { "_": `${req.body._8 ? 1 : 0},${req.body._9 ? 1 : 0}` },
                "_4": { "_": `${req.body._10 ? 1 : 0},${req.body._11 ? 1 : 0}` },
                "_5": { "_": `${req.body._12 ? 1 : 0}` }
            }
        }

        new common().Connect().then((dbo) => {
            var user = dbo.collection(userRollection)
            var role = dbo.collection(roleRollection)

            role.updateOne(
                {
                    "_id": mongodb.ObjectID(req.body._id)
                }, {
                    $set: new_permission
                }
                , (_, result) => {
                    if (result.result.ok > 0) {
                        role.find({
                            "_id": mongodb.ObjectID(req.body._id)
                        }).toArray((_, r) => {
                            r[0].member.map((v, _) => {
                                user.updateOne(
                                    {
                                        "_id": mongodb.ObjectID(v.id)
                                    }, {
                                        $set: new_permission
                                    })
                            })
                            res.result = true
                            res.message = '更新成功.'
                            resolve(res)
                        })
                    }
                    else {
                        res.message = '没有相关数据.'
                        resolve(res)
                    }
                    
                })
        })
    })

}

module.exports = router