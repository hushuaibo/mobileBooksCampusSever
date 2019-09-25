const express = require('express');
const router = express.Router();
const DB = require('./../../modules/db.js');
const fs = require('fs');
const multer  = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());
// 配置图片上传
const upload = multer({storage:
        multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/upload/')
        }, filename: function (req, file, cb) {
            cb(null,Date.now() + '.' + file.originalname.split('.')[1])
        }
    })
});
// 获取全部用户信息
router.get('/userList',(req,res)=>{
    DB.find('user', {},(err, users)=>{
        if(err){
            res.send({
                code : 0 ,
                msg : '查询失败'
            });
            return
        }
        res.send({
            code:1,
            users:users
        });
    });
});
// 添加单个用户
router.post('/userAdd',upload.single('picture'),(req,res)=>{
    const USERNAME = req.body.username;
    const PASSWORLD = req.body.password;
    const AGE = req.body.age;
    const GENDER = req.body.gender;
    const BIRTHDAY = req.body.birthday;
    const PICTURE = 'http://' + req.headers.host + '/upload/' + req.file.filename;
    const HOMETOWN = req.body.hometown;
    const PHONE = req.body.phone;
    const QQ = req.body.qq;
    DB.insert('user',{
        UserId : new Date().getTime(),
        UserName : USERNAME,
        PassWorld : PASSWORLD,
        Age : AGE,
        Gender : GENDER,
        Birthday : BIRTHDAY,
        Picture : PICTURE,
        Hometown : HOMETOWN,
        Phone : PHONE,
        QQ : QQ
    },(err,data)=>{
        if(err){
            res.send({
                code : 0 ,
                msg : '添加失败'
            });
            return
        }
        res.send({
            code : 1 ,
            msg : '添加成功'
        })
    })
});
// 删除单个用户
router.get('/userDelete',(req,res)=>{
    const ID = parseInt(req.query.userId);
    DB.find('user', {
        UserId: ID
    },(err, user)=>{
        const filepath = './public/upload/'+ user[0].Picture.split('/')[user[0].Picture.split('/').length-1];
        fs.unlink(filepath, function(err){
            if(err){
                throw err;
            }
            DB.deleteOne('user',{
                UserId: ID
            },(err)=>{
                if(err){
                    res.send({
                        code : 0 ,
                        msg : '删除失败'
                    });
                }
                res.send({
                    code : 1 ,
                    msg : '删除成功'
                })
            })
        });
    });
});
//向外暴露接口
module.exports = router;
