var express = require('express')
var router = express.Router();
var mongodb = require('mongodb');
const config = require('../../config')
const common = require('../common')

const roleCollection = "share.role"
const userCollection = "share.user"

router.post('/home', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_3', '0']

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

router.post('/add', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_3', '1']

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
                    add(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/del', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_3', '1']

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
                    del(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/adduser', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_3', '1']

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
                    adduser(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/removeuser', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_3', '1']

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
                    removeuser(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/rolegetlist', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_3', '1']

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
                    rolegetlist(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

function home(req, res) {

    return new Promise((resolve, _) => {
        new common().Connect().then((dbo, _) => {
            dbo.collection(roleCollection).find().toArray(function (err, result) {
                if (err) throw err
                if (result.length > 0) {
                    res.result = true
                    res.message = result
                }
                else {
                    res.message = '没有相关数据.'
                }
                resolve(res)
            })
        })
    })

}

function add(req, res) {

    return new Promise((resolve, _) => {
        new common().Connect().then((dbo, _) => {
            dbo.collection(roleCollection).insertOne({
                displayName: req.body.displayName,
                description: req.body.description,
                member: [],
                permission: config.permission
            }, (err, r) => {
                if (err) throw err
                if (r.insertedCount > 0) {
                    res.result = true
                    res.message = '添加成功.'
                }
                else {
                    res.message = '添加失败.'
                }
                resolve(res)
            })
        })
    })
}

function del(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo) => {
            dbo.collection(roleCollection).find({
                "_id": mongodb.ObjectID(req.body._id)
            }).toArray((_, q) => {
                if (q.length > 0) {
                    q[0].member.map((r) => {
                        dbo.collection(userCollection).updateOne({
                            "_id": mongodb.ObjectID(r.id)
                        }, {
                                $set: {
                                    'role': ''
                                }
                            })
                    })
                }

                dbo.collection(roleCollection).deleteOne(
                    {
                        "_id": mongodb.ObjectID(req.body._id)
                    }
                )

                res.result = true
                res.message = '删除成功'
                resolve(res);
            })
        })
    })
}

function adduser(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo, _) => {

            dbo.collection(userCollection).find({
                "_id": mongodb.ObjectID(req.body.userId)
            }).toArray((_, p) => {
                dbo.collection(roleCollection).updateOne(
                    {
                        "_id": mongodb.ObjectID(req.body.roleId)
                    },
                    {
                        $push: {
                            "member": {
                                id: req.body.userId,
                                accountName: p[0].accountName,
                                displayName: p[0].displayName
                            }
                        }
                    }, () => {
                        dbo.collection(roleCollection).findOne(
                            {
                                "_id": mongodb.ObjectID(req.body.roleId)
                            }
                            , (_, t) => {
                                dbo.collection(userCollection).updateOne(
                                    {
                                        "_id": mongodb.ObjectID(req.body.userId)
                                    }
                                    ,
                                    {
                                        $set: {
                                            "role": req.body.roleId,
                                            "permission": t.permission
                                        }
                                    }
                                    , (_, s) => {
                                        if (s.result.ok > 0) {
                                            res.result = true
                                            res.message = '添加成功.'
                                            resolve(res);
                                        }
                                    }
                                )
                            }
                        )
                    })
            })

        })
    })
}

function removeuser(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo, _) => {
            dbo.collection(roleCollection).updateOne(
                {
                    "_id": mongodb.ObjectID(req.body.roleId)
                }, {
                    $pull: {
                        "member": {
                            id: req.body.userId
                        }
                    }
                }
                , (_, p) => {
                    if (p.modifiedCount > 0) {

                        dbo.collection(userCollection).updateOne(
                            {
                                "_id": mongodb.ObjectID(req.body.userId)
                            },
                            {
                                $set: {
                                    "role": '',
                                    "permission": {}
                                }
                            },
                            (_, q) => {
                                if (q.modifiedCount > 0) {
                                    res.result = true
                                    res.message = '移除成功.'
                                    resolve(res);
                                }
                            }
                        )
                    }
                })
        })
    })
}

function rolegetlist(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo, _) => {
            dbo.collection(userCollection).find().toArray(function (_, r) {
                if (r.length > 0) {
                    res.result = true
                    res.message = r.filter((v) => {
                        delete v.passWord
                        var r
                        if (v.role === '') {
                            r = v
                        }
                        return r
                    })
                }
                else {
                    res.message = '没有相关数据.'
                }
                resolve(res)
            });
        })
    })
}

module.exports = router