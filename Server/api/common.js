var React = require('react');
var mongodb = require('mongodb');
const config = require('../config.json')

var userCollection = 'share.user'

var response = {
    result: false,
    message: ''
}

class Common extends React.Component {

    Connect() {
        return new Promise((resolve, reject) => {
            mongodb.MongoClient.connect(config.DB_URL, { useNewUrlParser: true }, (err, client) => {
                if (err) {
                    var dbo = client.db(config.DB_Database)
                    reject(dbo)
                } else {
                    var dbo = client.db(config.DB_Database)
                    resolve(dbo)
                }
            })
        }).catch(function (reason) {
            console.log('失败：' + reason);
        })
    }

    CheckIdentity(userId, permission) {
        return new Promise((resolve, _) => {
            this.Connect().then((dbo) => {
                var user = dbo.collection(userCollection)
                user.find({
                    "_id": mongodb.ObjectID(userId),
                    "permission": permission
                }).toArray((_, r) => {
                    if (r.length > 0) {
                        response.result = true
                        resolve(response)
                    } else {
                        response.message = '[无效]当前权限验证失败.'
                        resolve(response)
                    }

                })
            })
        }).catch(function (reason) {
            console.log('失败：' + reason);
        })
    }

    CheckPermission(permission, module) {
        return new Promise((resolve, _) => {
            if (permission[module[0]]._.split(',')[module[1]] === '1') {
                response.result = true
                resolve(response)
            }
            else {
                response.result = false
                response.message = '[拒绝]没有访问权限,目前无法使用.'
                resolve(response)
            }
        }).catch(function (reason) {
            console.log('失败：' + reason);
        })
    }
}

module.exports = Common