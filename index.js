//引入实例化express
const express = require('express');
const app = new express;
const session = require('express-session');

//引入自定义模块
const DB = require('./modules/db.js');
const admin = require('./router/admin.js');

//配置静态资源
app.use(express.static('public'));

//路由匹配
app.use('/admin',admin);

app.get('/upload/:url',(req,res)=>{
    res.render('/upload/'+req.params.url);
});

//端口监听
app.listen('4001','127.0.0.1');
