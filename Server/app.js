var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors({
    exposedHeaders: ['Content-Disposition'],
}));
app.use(require('body-parser').json());

app.use('/setup', require('./api/setup'));
app.use('/login', require('./api/login'));
app.use('/download', require('./api/download'));
app.use('/down', require('./api/down'));

// ==================================================
app.use(require('./authentication/CheckToken'))
// ==================================================

app.use('/dashboard', require('./api/dashboard'));
app.use('/file', require('./api/document'));
app.use('/user', require('./api/user'));
app.use('/role', require('./api/role'));
app.use('/auth', require('./api/authorization'));
app.use('/setting', require('./api/setting'));

//Server
var port = 8080
app.listen(port, () => { console.info("==> 服务已启动... 端口号: %s <==", port) })
