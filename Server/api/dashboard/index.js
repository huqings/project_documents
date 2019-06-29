var express = require('express')
var router = express.Router();
var mongodb = require('mongodb');

const common = require('../common')
const usersRollection = "users"

router.post('/', (req, res) => {

    var response = {
        result: false
    }

    let projections = {
        accountName: 1,
        displayName: 1,
        _id: 0
    }

    new common().Connect().then(dbo => {
        var bucket = new mongodb.GridFSBucket(dbo);
        bucket.find().toArray(function (_, x) {
            if (x.length > 0) {
                bucket.find({
                    "metadata.shareId": {
                        $ne: ''
                    }
                }).toArray(function (_, y) {
                    let z = dbo.collection(usersRollection)
                    z.find(
                        {},
                        {
                            projection: projections
                        }
                    ).sort({ 'uploadCount': -1 }).limit(5).toArray((_, o) => {
                        z.find(
                            {},
                            {
                                projection: projections
                            }
                        ).sort({ 'shareCount': -1 }).limit(10).toArray((_, p) => {
                            response.result = true
                            response.message = {
                                acount: x.length,
                                scount: y.length,
                                userTop5: o,
                                userTop10: p
                            }
                            res.status(200).json(response);
                        })
                    })
                })
            } else {
                response.message = "没有任何文件"
                res.status(200).json(response);
            }
        });
    })

})

module.exports = router