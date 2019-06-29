var express = require('express')
var router = express.Router();
var mongodb = require('mongodb');
var fs = require("fs");
var md5 = require('md5')
var common = require('../common')

const userCollection = 'share.user'
const roleCollection = 'share.role'
const systemCollection = 'share.system'
const logCollection = 'share.log'
const downCollection = 'share.down'

router.post('/', (req, res) => {

    const DB_URL = `mongodb://${req.body.connuser}:${req.body.connpwd}@${req.body.connaddress}:${req.body.connport}/${req.body.conndatabase}`

    let response = {
        result: false
    }

    mongodb.MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            response.message = '连接失败!'
            return res.status(200).json(response);
        } else {

            let info = JSON.stringify({
                "App": 'share',
                "DB_URL": DB_URL,
                "DB_Database": req.body.conndatabase,
                "DB_files": "fs.files",
                "role": "",
                "fileSize": "2000",
                "permission": {
                    "_1": {
                        "_": "1,1,1,1,1"
                    },
                    "_2": {
                        "_": "1,0"
                    },
                    "_3": {
                        "_": "0,0"
                    },
                    "_4": {
                        "_": "0,0"
                    },
                    "_5": {
                        "_": "0"
                    }
                }
            })

            fs.writeFile('config.json', info, (error, fd) => {
                if (error) {
                    console.error(error);
                }
            })

            response.result = true
            return res.status(200).json(response);
        }
    })

})

router.post('/user', (req, res) => {

    let response = {
        result: false
    }

    new common().Connect().then(dbo => {
        dbo.createCollection(userCollection, function (error, _) {
            if (!error) {
                dbo.createCollection(roleCollection)
                dbo.createCollection(downCollection)
                dbo.createCollection(logCollection)
                dbo.createCollection(systemCollection)
                dbo.collection(userCollection).insertOne({
                    "accountName": req.body.configuser,
                    "passWord": md5Pwd(req.body.configpwd),
                    "displayName": req.body.configdisplayname,
                    "phone": "",
                    "birthday": "",
                    "department": "",
                    "title": "",
                    "address": "",
                    "role": "",
                    "uploadCount": 0,
                    "shareCount": 0,
                    "permission": {
                        "_1": {
                            "_": "1,1,1,1,1"
                        },
                        "_2": {
                            "_": "1,1"
                        },
                        "_3": {
                            "_": "1,1"
                        },
                        "_4": {
                            "_": "1,1"
                        },
                        "_5": {
                            "_": "1"
                        }
                    },
                    "status": true
                }, function (err, result) {
                    if (err) throw err;
                    if (result.insertedCount > 0) {
                        response.result = true
                        response.message = '用户创建成功.'
                    }
                    else {
                        response.message = '用户创建失败.'
                    }
                    return res.status(200).json(response);
                })
            }
        });
    })
})

function md5Pwd(pwd) {
    const salt = 'documents_secret'
    return md5(md5(pwd + salt))
}

module.exports = router