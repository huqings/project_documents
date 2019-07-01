var express = require('express')
var router = express.Router();
var mongodb = require('mongodb');
var common = require('../common')
var stream = require('stream');

const downCollection = "share.down"

router.post('/', (req, res) => {

    var response = {
        result: false
    }

    new common().Connect().then((dbo) => {
        dbo.collection(downCollection).findOne({
            sid: req.body.id
        }, (_, file) => {
            if (file === null) {
                response.message = '分享地址错误.'
                res.status(200).json(response)
            }
            else {
                var bucket = new mongodb.GridFSBucket(dbo);
                bucket.find({ "_id": mongodb.ObjectID(file.fileId) }).toArray(function (err, files) {
                    if (files.length > 0) {
                        response.result = true
                        response.message = {
                            fileId: files[0]._id,
                            filename: files[0].metadata.filename,
                            sid: file.sid,
                            expireTime: file.expireTime,
                            size: files[0].metadata.size
                        }
                        res.status(200).json(response)
                    }
                })
            }
        })
    })
})

router.get('/get', (req, res) => {
    new common().Connect().then((dbo) => {
        dbo.collection(downCollection).findOne({
            sid: req.query.id,
            downloadCode: req.query.downloadCode,
            expireTime: { "$gt": new Date().getTime() }
        }, (_, file) => {
            if (file === null) {
                res.status(200).send(`下载码错误或文档已过期.`)
            } else {
                var bucket = new mongodb.GridFSBucket(dbo);
                bucket.find({ "_id": mongodb.ObjectID(file.fileId) }).toArray(function (err, files) {
                    if (files.length > 0) {
                        var downloadStream = bucket.openDownloadStream(files[0]._id)
                        res.setHeader('Content-disposition', 'attachment; filename=' + encodeURI(files[0].filename))
                        res.setHeader('Content-type', 'text/html')
                        downloadStream.pipe(res);
                    }
                })
            }
        })
    })
})

router.post('/file', (req, res) => {
    new common().Connect().then((dbo) => {
        dbo.collection(downCollection).findOne({
            sid: req.body.id,
            downloadCode: req.body.downloadCode,
            expireTime: { "$gt": new Date().getTime() }
        }, (_, file) => {
            if (file === null) {
                var bufferStream = new stream.PassThrough();
                bufferStream.end(new Buffer.from('Null', 'base64'));
                res.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-Disposition": ""
                });
                bufferStream.pipe(res);
            } else {
                var bucket = new mongodb.GridFSBucket(dbo);
                bucket.find({ "_id": mongodb.ObjectID(file.fileId) }).toArray(function (_, files) {
                    if (files.length > 0) {
                        var downloadStream = bucket.openDownloadStream(files[0]._id)
                        res.writeHead(200, {
                            "Content-Type": "application/octet-stream",
                            "Content-Disposition": encodeURI(files[0].filename)
                        });
                        downloadStream.pipe(res);
                    }
                })
            }
        })
    })
})

module.exports = router