var express = require('express')
var router = express.Router();
var md5 = require('md5')
const jwt = require('jsonwebtoken')
const secretConfig = require('../../authentication/TokenConfig')

const config = require('../../config')
const common = require('../common')

const usersCollection = "share.user"
const logsCollection = "share.log"

router.post('/', (req, res) => {

    const postData = req.body;

    let response = {
        result: false
    }

    new common().Connect().then((dbo, _) => {
        dbo.collection(usersCollection).find({
            "accountName": postData.username,
            "passWord": md5Pwd(postData.password)
        }).toArray(function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                if (!result[0].status) {
                    dbo.collection(logsCollection).insertOne({
                        "accountName": postData.username,
                        "actionTime": new Date(),
                        "actionModule": "登录",
                        "actionDetails": "登录失败,账户禁用"
                    })

                    response.message = '你的账户已被禁止使用,如有误请联系管理员.'
                    res.status(200).json(response);

                }
                else if (Object.keys(result[0].permission).length === 0) {
                    dbo.collection(logsCollection).insertOne({
                        "accountName": postData.username,
                        "actionTime": new Date(),
                        "actionModule": "登录",
                        "actionDetails": "登录失败,账户无权限"
                    })

                    response.message = '当前用户没有使用权限,如有误请联系管理员.'
                    res.status(200).json(response);
                }
                else {

                    dbo.collection(logsCollection).insertOne({
                        "accountName": postData.username,
                        "actionTime": new Date(),
                        "actionModule": "登录",
                        "actionDetails": "登录成功"
                    })

                    response.result = true

                    const userId = {
                        id: result[0]._id
                    };

                    const userInfo = {
                        i: result[0]._id,
                        d: escape(result[0].displayName),
                        p: result[0].permission
                    }

                    let token = jwt.sign(userId, secretConfig.secret, { expiresIn: secretConfig.tokenLife }, { algorithm: secretConfig.algorithm })
                    let refreshToken = jwt.sign(userId, secretConfig.refreshTokenSecret, { expiresIn: secretConfig.refreshTokenLife }, { algorithm: secretConfig.algorithm })

                    response.message = {
                        t: token,
                        r: refreshToken,
                        u: userInfo
                    }

                    res.status(200).json(response);
                }
            }
            else {

                dbo.collection(logsCollection).insertOne({
                    "accountName": postData.username,
                    "actionTime": new Date(),
                    "actionModule": "登录",
                    "actionDetails": "登录失败"
                })

                response.message = '你输入的账户或密码有误,请重新尝试.'
                res.status(200).json(response);
            }
        })
    })
})

router.post('/init', (req, res) => {

    let response = {
        result: false
    }

    if (config.App === 'share') {
        res.status(200).json(response);
    }
    else {
        response.result = true
        res.status(200).json(response);
    }
})

router.post('/register', (req, res) => {
    const postData = req.body;

    let response = {
        result: false
    }

    new common().Connect().then((dbo, _) => {
        dbo.collection(usersCollection).findOne({
            "accountName": postData.username
        }, function (err, result) {
            if (err) throw err;
            if (result === null) {
                dbo.insertOne({
                    "accountName": postData.username,
                    "passWord": md5Pwd(postData.password),
                    "displayName": "",
                    "title": "",
                    "phone": "",
                    "birthday": "",
                    "department": "",
                    "address": "",
                    "role": config.role,
                    "status": true,
                    "uploadCount": 0,
                    "shareCount": 0,
                    "permission": config.permission
                }, function (err, result) {
                    if (err) throw err;
                    if (result.insertedCount > 0) {
                        response.result = true
                        response.message = '注册成功.'
                        res.status(200).json(response);
                    }
                    else {
                        response.message = '注册失败.'
                        res.status(200).json(response);
                    }
                });
            }
            else {
                response.result = true
                response.message = '邮箱已被注册，请重新输入邮箱。'
                res.status(200).json(response);
            }
        })
    })
})

function md5Pwd(pwd) {
    const salt = 'documents_secret'
    return md5(md5(pwd + salt))
}

module.exports = router