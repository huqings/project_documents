var express = require('express')
var router = express.Router();
var mongodb = require('mongodb');

const common = require('../common')

router.get('/:id', (req, res) => {
    new common().Connect().then((dbo) => {
        dbo.collection('down').find({
            sid: req.params.id,
            expireTime: { "$gt": new Date().getTime() }
        }).toArray((_, r) => {
            if (r.length > 0) {
                var bucket = new mongodb.GridFSBucket(dbo);
                bucket.find({ "_id": mongodb.ObjectID(r[0].fileId) }).toArray(function (err, files) {
                    if (files.length > 0) {
                        var downloadStream = bucket.openDownloadStream(files[0]._id)
                        res.setHeader('Content-disposition', 'attachment; filename=' + encodeURI(files[0].filename))
                        res.setHeader('Content-type', 'text/html')
                        downloadStream.pipe(res);
                    } else {
                        res.status(200).send('下载错误!');
                    }
                })
            } else {
                res.status(200).send('下载失败,错误文件或已过期!');
            }
        })
    })
})

module.exports = router