var express = require('express');
var router = express.Router();
var multiparty = require('connect-multiparty')();
var fs = require('fs');
var mongodb = require('mongodb');
var config = require('../../config')
var common = require('../common')

const usersCollection = "share.user"
const rolesCollection = "share.role"
const downCollection = "share.down"

router.post('/lists', (req, res) => {
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
                    lists(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/intofolder', (req, res) => {
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
                    intofolder(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/rename', (req, res) => {
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
                    rename(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/sharefromlist', (req, res) => {
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
                    sharefromlist(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/sharetolist', (req, res) => {
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
                    sharetolist(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })

})

router.post('/upload', multiparty, (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_1', '1']

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
                    upload(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/createfolder', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_1', '2']

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
                    createfolder(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.get('/down', (req, res) => {
    down(req, res)
})

router.post('/shareinfo', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_1', '4']

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
                    shareinfo(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/sharepublic', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_1', '4']

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
                    sharepublic(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/shareclosepublic', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_1', '4']

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
                    shareclosepublic(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/deletes', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_1', '4']

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
                    deletes(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/shareadduser', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_1', '4']

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
                    shareadduser(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/share', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_1', '4']

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
                    share(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/unshare', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_1', '4']

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
                    unshare(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/selectusers', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_1', '4']

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
                    selectusers(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/selectuserslist', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_1', '4']

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
                    selectuserslist(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/selectroleslist', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_1', '4']

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
                    selectroleslist(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/movetofolder', (req, res) => {
    const info = JSON.parse(req.headers['x-access-info'])

    let response = {
        result: false
    }

    let module = ['_1', '4']

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
                    movetofolder(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

router.post('/tofolder', (req, res) => {
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
                    tofolder(req, response).then(v => {
                        res.status(200).json(v)
                    })
                }
            })
        }
    })
})

function lists(req, res) {
    let info = JSON.parse(req.headers['x-access-info'])

    let conditions = {
        "metadata.userId": info.i,
        "metadata.path": req.body.path
    }

    return new Promise((resolve, _) => {
        new common().Connect().then((dbo, _) => {
            var bucket = new mongodb.GridFSBucket(dbo);
            bucket.find(conditions)
                .sort({ "metadata.type": 1, 'uploadDate': -1 })
                .toArray(function (err, result) {
                    if (err) throw err;
                    if (result.length > 0) {
                        res.result = true
                        res.message = result
                    }
                    else {
                        res.message = "没有任何文件"
                    }
                    resolve(res)
                })
        })
    })
}

function intofolder(req, res) {
    let info = JSON.parse(req.headers['x-access-info'])

    let conditions = {
        "metadata.userId": info.i,
        "metadata.path": req.body.path
    }

    return new Promise((resolve, _) => {
        new common().Connect().then((dbo, _) => {
            var bucket = new mongodb.GridFSBucket(dbo);
            bucket.find(conditions)
                .sort({ "metadata.type": 1, 'uploadDate': -1 })
                .toArray(function (err, result) {
                    if (err) throw err;
                    if (result.length > 0) {
                        res.result = true
                        res.message = result
                    }
                    else {
                        res.message = "没有任何文件"
                    }
                    resolve(res)
                })
        })
    })
}

function rename(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo, _) => {
            dbo.collection(config.DB_files).updateOne({
                '_id': mongodb.ObjectID(req.body.fileId),
            }, {
                    $set: {
                        'metadata.filename': req.body.fileName
                    }
                }, function (_, result) {
                    if (result.matchedCount > 0) {
                        res.result = true
                        res.message = "操作成功"
                    }
                    else {
                        res.message = "操作失败"
                    }
                    resolve(res)
                });

        })
    })
}

function sharefromlist(req, res) {
    let info = JSON.parse(req.headers['x-access-info'])

    return new Promise((resolve, _) => {
        new common().Connect().then((dbo, _) => {
            var bucket = new mongodb.GridFSBucket(dbo);
            bucket.find({
                "metadata.type": 1,
                "metadata.shareId": {
                    $ne: ''
                }
            }).toArray(function (_, result) {
                if (result.length > 0) {
                    let value = []
                    result.map(x => {
                        let y = x.metadata.shareId
                        for (let index = 0; index < y.length; index++) {
                            if (y[index]._id === info.i) {
                                value.push(x)
                            }
                        }
                    })
                    if (value.length > 0) {
                        res.result = true
                        res.message = value
                    }
                    else {
                        res.message = "没有任何文件"
                    }
                }
                else {
                    res.message = "没有任何文件"
                }
                resolve(res)
            })
        })
    })
}

function sharetolist(req, res) {
    let info = JSON.parse(req.headers['x-access-info'])
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo, _) => {
            var bucket = new mongodb.GridFSBucket(dbo);
            bucket.find({
                "metadata.userId": info.i,
                "metadata.type": 1,
                "metadata.shareId": {
                    $ne: ''
                }
            }).toArray(function (_, result) {
                if (result.length > 0) {
                    res.result = true
                    res.message = result
                }
                else {
                    res.message = "没有任何文件"
                }
                resolve(res)
            })
        })
    })
}

function upload(req, res) {
    let info = JSON.parse(req.body.other)

    let type = info.typename === '' ? (req.files.file.name.split('.')[req.files.file.name.split('.').length - 1]) : info.typename
    let filename = info.filename.slice(0, req.files.file.name.lastIndexOf("."))

    const optionFile = {
        metadata: {
            filename: filename,
            typename: type,
            type: 1,
            size: info.fileSize,
            path: info.path,
            location: info.path,
            version: info.version,
            status: info.status,
            userId: info.userId,
            userDisplayName: unescape(info.userDisplayName),
            shareId: info.shareId,
            publicShareId: info.publicShareId,
            publicShareExpireTime: info.publicShareExpireTime,
            publicShareUrl: info.publicShareUrl
        }
    }

    return new Promise((resolve, _) => {

        if (parseInt(optionFile.metadata.size) > parseInt(config.fileSize)) {
            res.message = `[系统设定]:文件不能超过${config.fileSize}MB`
            resolve(res)
        }
        else {
            new common().Connect().then((dbo) => {
                var bucket = new mongodb.GridFSBucket(dbo);
                fs.createReadStream(req.files.file.path).
                    pipe(bucket.openUploadStream(req.files.file.name, optionFile)).
                    on('error', function (error) {
                        res.message = '系统错误:' + error
                        resolve(res)
                    }).
                    on('finish', function () {
                        let z = dbo.collection(usersCollection)
                        z.findOne({
                            '_id': mongodb.ObjectID(optionFile.metadata.userId)
                        }, (_, v) => {
                            z.updateOne(
                                {
                                    '_id': mongodb.ObjectID(optionFile.metadata.userId),
                                },
                                {
                                    $set: {
                                        'uploadCount': v.uploadCount + 1
                                    }
                                }, () => {
                                    res.result = true
                                    res.message = '文档已上传成功'
                                    resolve(res)
                                }
                            )
                        })
                    })
            })
        }

    })

}

function createfolder(req, res) {
    let info = JSON.parse(req.headers['x-access-info'])

    return new Promise((resolve, _) => {
        new common().Connect().then((dbo) => {
            dbo.collection(config.DB_files).findOne({
                "metadata.userId": info.i,
                "metadata.filename": req.body.folderName
            }, (_, p) => {
                if (p === null) {
                    if (req.body.folderName.indexOf('/') !== -1) {
                        res.message = '创建失败,不能包含特殊字符.'
                        resolve(res)
                    } else {
                        dbo.collection(config.DB_files).insertOne({
                            "uploadDate": new Date(),
                            "metadata": {
                                "filename": req.body.folderName,
                                "path": `${req.body.path}`,
                                "location": req.body.path.length > 1 ? `${req.body.path}/${req.body.folderName}` : `${req.body.path}${req.body.folderName}`,
                                "type": 0,
                                "userId": info.i
                            }
                        }, (_, result) => {
                            if (result.insertedCount > 0) {
                                res.result = true
                                res.message = '创建成功.'
                            }
                            else {
                                res.message = '创建失败.'
                            }
                            resolve(res)
                        })
                    }
                } else {
                    res.message = '[失败]文件夹已存在.'
                    resolve(res)
                }
            })
        })
    })
}

function down(req, res) {
    new common().Connect().then((dbo) => {
        var bucket = new mongodb.GridFSBucket(dbo);
        bucket.find({ "_id": mongodb.ObjectID(req.query.id) }).toArray(function (err, files) {
            var downloadStream = bucket.openDownloadStream(files[0]._id)
            res.setHeader('Content-disposition', 'attachment; filename=' + encodeURI(files[0].filename))
            res.setHeader('Content-type', 'text/html')
            downloadStream.pipe(res);
        })
    })
}

function share(req, res) {
    let info = JSON.parse(req.headers['x-access-info'])

    return new Promise((resolve, _) => {
        new common().Connect().then((dbo) => {
            let k = []
            req.body.shareUsersList.map(x => {
                if (x.type) {
                    dbo.collection(config.DB_files).updateOne({
                        '_id': mongodb.ObjectID(req.body._id),
                    }, {
                            $set: {
                                'metadata.shareId': req.body.shareUsersList,
                                'metadata.status': 1
                            }
                        }, () => {
                            dbo.collection(usersCollection).findOne({
                                '_id': mongodb.ObjectID(info.i)
                            }, (_, y) => {
                                dbo.collection(usersCollection).updateOne({
                                    '_id': mongodb.ObjectID(info.i)
                                }, {
                                        $set: {
                                            'shareCount': y.shareCount + 1
                                        }
                                    })
                            })
                        })
                } else {
                    dbo.collection(rolesCollection).findOne({
                        '_id': mongodb.ObjectID(x._id),
                    }, (_, y) => {
                        y.member.map(z => {
                            k.push({
                                _id: z.id,
                                accountName: z.accountName,
                                displayName: z.displayName,
                                type: true
                            })
                        })
                        dbo.collection(config.DB_files).updateOne({
                            '_id': mongodb.ObjectID(req.body._id),
                        }, {
                                $set: {
                                    'metadata.shareId': k,
                                    'metadata.status': 1
                                }
                            })
                    })
                }
            })
            res.message = '分享成功.'
            resolve(res)
        })
    })
}

function unshare(req, res) {
    let info = JSON.parse(req.headers['x-access-info'])

    return new Promise((resolve, _) => {
        new common().Connect().then((dbo) => {
            dbo.collection(config.DB_files).updateOne({
                '_id': mongodb.ObjectID(req.body._id),
            }, {
                    $set: {
                        'metadata.shareId': '',
                        'metadata.status': 0
                    }
                }, function (_, result) {
                    if (result.matchedCount > 0) {
                        dbo.collection(usersCollection).findOne({
                            '_id': mongodb.ObjectID(info.i)
                        }, (_, y) => {
                            dbo.collection(usersCollection).updateOne({
                                '_id': mongodb.ObjectID(info.i)
                            }, {
                                    $set: {
                                        'shareCount': y.shareCount - 1
                                    }
                                })
                        })

                        res.result = true
                        res.message = "操作成功"
                    }
                    else {
                        res.message = "操作失败"
                    }
                    resolve(res)
                });
        })
    })
}

function shareinfo(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo) => {
            var bucket = new mongodb.GridFSBucket(dbo);
            bucket.find({
                "_id": mongodb.ObjectID(req.body._id)
            }).toArray((_, r) => {
                if (r.length > 0) {
                    res.result = true
                    if (r[0].metadata.publicShareId !== '') {
                        dbo.collection(downCollection).findOne({
                            fileId: r[0].metadata.publicShareId
                        }, (_, v) => {
                            res.message = {
                                expireTime: v.expireTime,
                                shareUrlPath: v.urlPath,
                                downloadCode: v.downloadCode,
                                file: r[0]
                            }
                            resolve(res)
                        })
                    } else {
                        res.message = {
                            file: r[0]
                        }
                        resolve(res)
                    }
                }
            })
        })
    })
}

function sharepublic(req, res) {

    return new Promise((resolve, _) => {
        new common().Connect().then(dbo => {
            dbo.collection(downCollection).insertOne({
                sid: req.body.url.split('/download/')[1],
                urlPath: req.body.url,
                fileId: req.body.fileId,
                expireTime: new Date(req.body.expireTime).getTime(),
                downloadCode: req.body.downloadCode
            }, (err, result) => {
                if (err) throw err;
                if (result.insertedCount > 0) {
                    dbo.collection(config.DB_files).updateOne(
                        {
                            '_id': mongodb.ObjectID(req.body.fileId),
                        },
                        {
                            $set: {
                                'metadata.status': 1,
                                'metadata.publicShareId': req.body.fileId,
                                'metadata.publicShareUrl': req.body.url,
                                'metadata.publicShareExpireTime': req.body.expireTime
                            }
                        }, (_, r) => {
                            if (r.matchedCount > 0) {
                                res.result = true
                                res.message = '分享成功.'
                                resolve(res)
                            }
                        }
                    )
                }
                else {
                    res.message = '分享失败.'
                    resolve(res)
                }
            });
        })
    })
}

function shareclosepublic(req, res) {

    return new Promise((resolve, _) => {
        new common().Connect().then(dbo => {
            dbo.collection(downCollection).deleteOne(
                {
                    urlPath: req.body.url
                }, () => {
                    dbo.collection(config.DB_files).updateOne(
                        {
                            '_id': mongodb.ObjectID(req.body.fileId),
                        },
                        {
                            $set: {
                                'metadata.status': 0,
                                'metadata.publicShareId': '',
                                'metadata.publicShareExpireTime': '',
                                'metadata.publicShareUrl': ''
                            }
                        }, (_, r) => {
                            if (r.matchedCount > 0) {
                                dbo.collection(downCollection).deleteOne({ "fileId": req.body.fileId })
                                res.result = true
                                res.message = '操作成功.'
                                resolve(res)
                            }
                        }
                    )
                }
            )
        })
    })
}

function deletes(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo) => {
            var bucket = new mongodb.GridFSBucket(dbo);
            bucket.find({
                "_id": mongodb.ObjectID(req.body._id),
                "metadata.type": 0
            }).toArray((_, r) => {
                if (r.length > 0) {
                    let path = req.body.path.replace('//', '/').replace('/', '\/')
                    bucket.find({
                        "metadata.location": { $regex: `${path}` }
                    }).toArray((_, s) => {
                        if (s.length === 1) {
                            bucket.delete(mongodb.ObjectID(req.body._id), function (err, v) {
                                res.result = true
                                res.message = "删除成功"
                                resolve(res)
                            })
                        } else {
                            res.message = "删除失败,包含有文件或文件夹."
                            resolve(res)
                        }
                    })
                } else {
                    bucket.delete(mongodb.ObjectID(req.body._id), function (err, v) {
                        res.result = true
                        res.message = "删除成功"
                        resolve(res)
                    })
                }
            })
        })
    })
}

function shareadduser(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo) => {
            dbo.collection(usersCollection).find({
                "accountName": req.body.accountName
            }).toArray((_, r) => {
                if (r.length > 0) {
                    res.result = true
                    res.message = r.filter((v) => {
                        delete v.passWord
                        return v
                    })[0]
                }
                else {
                    res.message = '用户验证无效.'
                }
                resolve(res)
            })
        })
    })
}

function selectusers(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo) => {
            dbo.collection(usersCollection).find(
                {}
                ,
                {
                    projection: {
                        accountName: 1,
                        displayName: 1
                    }
                }
            ).limit(15).toArray((_, p) => {
                dbo.collection(rolesCollection).find({
                }
                    , {
                        projection: {
                            displayName: 1,
                            description: 1
                        }
                    }
                ).limit(15).toArray((_, q) => {
                    res.result = true
                    res.message = {
                        user: p,
                        role: q
                    }
                    resolve(res)
                })
            })
        })
    })
}

function selectuserslist(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo) => {
            dbo.collection(usersCollection).find(
                {
                    $or: [
                        {
                            "accountName": {
                                $regex: req.body.value
                            }
                        },
                        {
                            "displayName": {
                                $regex: req.body.value
                            }
                        }
                    ]
                }
                ,
                {
                    projection: {
                        accountName: 1,
                        displayName: 1
                    }
                }
            ).toArray((_, p) => {
                res.result = true
                res.message = p
                resolve(res)
            })
        })
    })
}

function selectroleslist(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo) => {
            dbo.collection(rolesCollection).find(
                {
                    $or: [
                        {
                            "displayName": {
                                $regex: req.body.value
                            }
                        }
                    ]
                }
                ,
                {
                    projection: {
                        accountName: 1,
                        displayName: 1
                    }
                }
            ).toArray((_, p) => {
                res.result = true
                res.message = p
                resolve(res)
            })
        })
    })
}

function movetofolder(req, res) {
    return new Promise((resolve, _) => {
        new common().Connect().then((dbo) => {
            dbo.collection(config.DB_files).updateOne(
                {
                    '_id': mongodb.ObjectID(req.body.fileId),
                },
                {
                    $set: {
                        'metadata.path': req.body.location,
                        'metadata.location': req.body.location
                    }
                })
            resolve(res);
        })
    })
}

function tofolder(req, res) {
    let info = JSON.parse(req.headers['x-access-info'])

    return new Promise((resolve, _) => {
        new common().Connect().then((dbo) => {
            var bucket = new mongodb.GridFSBucket(dbo);
            bucket.find({
                "metadata.type": 0,
                "metadata.userId": info.i
            })
                .sort({ 'uploadDate': -1 })
                .toArray(function (_, result) {
                    if (result.length > 0) {
                        res.result = true
                        res.message = result
                    }
                    else {
                        res.message = "没有任何文件"
                    }
                    resolve(res)
                })
        })
    })
}

module.exports = router;