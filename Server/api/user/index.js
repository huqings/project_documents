var express = require('express')
var router = express.Router();
var md5 = require('md5')
var mongodb = require('mongodb');
const common = require('../common')

const userCollection = "share.user"
const roleCollection = "roles"

router.post('/home', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_2', '0']

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

router.post('/find', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_2', '1']

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
                    find(req, response).then(v => {
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

    let module = ['_2', '1']

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

router.post('/edit', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_2', '1']

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
                    edit(req, response).then(v => {
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

    let module = ['_2', '1']

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

router.post('/query', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_2', '0']

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
                    query(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/manage', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_2', '1']

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
                    manage(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/pwd', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_2', '0']

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
                    pwd(req, response).then(v => {
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
            dbo.collection(userCollection).find().skip(parseInt(req.body.before)).limit(6).toArray(function (_, r) {
                if (r.length > 0) {
                    res.result = true
                    res.message = r.filter((v) => {
                        delete v.passWord
                        return v
                    })
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

    let info = req.body
    info.passWord = md5Pwd(info.passWord)

    return new Promise((resolve, _) => {
        new common().Connect().then(dbo => {
            dbo.collection(userCollection).insertOne(info, function (err, result) {
                if (err) throw err;
                if (result.insertedCount > 0) {
                    res.result = true
                    res.message = '用户创建成功.'
                }
                else {
                    res.message = '用户创建失败.'
                }
                resolve(res)
            });
        })
    })
}

function edit(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo) => {
            let conditions = {
                "_id": mongodb.ObjectID(req.body._id)
            }

            delete req.body._id
            delete req.body.role

            let updateData = {
                $set: req.body
            }

            dbo.collection(userCollection).updateOne(conditions, updateData, function (_, result) {
                if (result.result.n > 0) {
                    res.result = true
                    res.message = '用户更新成功.'
                }
                else {
                    res.message = '用户更新失败.'
                }
                resolve(res)
            })
        })
    })
}

function del(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo) => {
            dbo.collection(userCollection).deleteOne({
                "_id": mongodb.ObjectID(req.body.id)
            }, () => {
                res.result = true
                res.message = '人员已删除!'
                resolve(res)
            })
        })
    })
}

function find(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo) => {
            var user = dbo.collection(userCollection)
            var role = dbo.collection(roleCollection)
            user.find({
                "_id": mongodb.ObjectId(req.body._id)
            }).toArray((_, r) => {

                if (r.length > 0) {
                    res.result = true
                    res.message = r[0]
                    delete res.message.passWord
                    if (r[0].role === '') {
                        res.message.role = '未被设置'
                    } else {
                        role.find({
                            "_id": mongodb.ObjectId(r[0].role)
                        }).toArray((_, s) => {
                            if (s.length > 0) {
                                res.message.role = s[0].displayName
                            }
                        })
                    }
                } else {
                    res.message = '人员不存在.'
                }

                resolve(res)
            })
        })
    })
}

function query(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo) => {
            try {
                dbo.collection(userCollection).find(
                    {
                        $or: [
                            {
                                "accountName":
                                {
                                    $regex: req.body.userSearch
                                }
                            },
                            {
                                "displayName":
                                {
                                    $regex: req.body.userSearch
                                }
                            }
                        ]
                    }).limit(6).toArray(function (err, result) {
                        if (err) throw err;

                        if (result.length > 0) {
                            res.result = true
                            res.message = result.map(v => {
                                delete v.passWord
                                return v
                            })
                        } else {
                            res.message = '人员不存在.'
                        }

                        resolve(res)
                    })
            } catch (err) {
                response.message = '人员Id错误.'
                res.status(200).json(response)
            }
        })
    })
}

function manage(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then(dbo => {
            var user = dbo.collection(userCollection)
            user.find().skip(parseInt(req.body.before)).limit(6).toArray(function (_, r) {
                if (r.length > 0) {
                    res.result = true
                    res.message = r.filter((v) => {
                        delete v.passWord
                        return v
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

function pwd(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then(dbo => {
            dbo.collection(userCollection).updateOne(
                {
                    _id: mongodb.ObjectID(req.body._id)
                },
                {
                    $set: {
                        passWord: md5Pwd(req.body.passWord)
                    }
                }
                , (_, r) => {
                    if (r.result.n > 0) {
                        res.result = true
                        res.message = '修改成功.'
                    }
                    else {
                        res.message = '修改失败.'
                    }
                    resolve(res)
                })
        })
    })
}

function md5Pwd(pwd) {
    const salt = 'documents_secret'
    return md5(md5(pwd + salt))
}

module.exports = router