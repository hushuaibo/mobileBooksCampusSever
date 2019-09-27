const express = require('express');
const router = express.Router();
const DB = require('./../../modules/db.js');
const fs = require('fs');
const multer  = require('multer');
const path = require('path');
const xlsx = require('node-xlsx');
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
// 添加用户
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
                res.send({
                    code : 0 ,
                    msg : '删除失败'
                });
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
//修改用户信息
router.post('/userEdit',upload.single('picture'),(req,res)=>{
    const USERID = parseInt(req.body.userId);
    const USERNAME = req.body.username;
    const PASSWORLD = req.body.password;
    const AGE = req.body.age;
    const GENDER = req.body.gender;
    const BIRTHDAY = req.body.birthday;
    let PICTURE;
    if(req.file){
        PICTURE = 'http://' + req.headers.host + '/upload/' + req.file.filename;
    }
    const HOMETOWN = req.body.hometown;
    const PHONE = req.body.phone;
    const QQ = req.body.qq;
    DB.find('user',{
        UserId : USERID
    },(err,user)=>{
        if(err){
            res.send({
                code:0,
                msg:'修改失败'
            });
        }
        const filepath = './public/upload/' + user[0].Picture.split('/')[user[0].Picture.split('/').length-1];
        if(req.file){
            fs.unlink(filepath, function(err){
                if(err){
                    res.send({
                        code : 0 ,
                        msg : '修改失败'
                    });
                }
                DB.update('user',{
                    UserId : USERID
                },{
                    UserName : USERNAME,
                    PassWorld : PASSWORLD,
                    Age : AGE,
                    Gender : GENDER,
                    Birthday : BIRTHDAY,
                    Picture:PICTURE,
                    Hometown : HOMETOWN,
                    Phone : PHONE,
                    QQ : QQ
                },(err)=>{
                    if(err){
                        res.send({
                            code:0,
                            msg:'修改失败'
                        });
                    }
                    res.send({
                        code:1,
                        msg:'修改成功'
                    });
                })
            })
        }else{
            DB.update('user',{
                UserId : USERID
            },{
                UserName : USERNAME,
                PassWorld : PASSWORLD,
                Age : AGE,
                Gender : GENDER,
                Birthday : BIRTHDAY,
                Hometown : HOMETOWN,
                Phone : PHONE,
                QQ : QQ
            },(err)=>{
                if(err){
                    res.send({
                        code:0,
                        msg:'修改失败'
                    });
                }
                res.send({
                    code:1,
                    msg:'修改成功'
                });
            })
        }
    })
});
//查看单个用户信息
router.get('/userContent',(req,res)=>{
    const ID = parseInt(req.query.userId);
    DB.find('user',{
        UserId : ID
    },(err,user)=>{
        if(err){
            res.send({
                code : 0 ,
                msg : '获取失败'
            });
        }
        res.send({
            code : 1,
            user : user[0]
        })
    })
});
//下载所有用户信息
router.get('/download',(req,res)=>{
    DB.find('user',{},(err,user)=>{
        if(err){
            res.send({
                code : 0 ,
                msg : '下载失败'
            });
        }
        const DATA = [['用户名','用户密码','年龄','性别','生日','头像地址','家乡','手机号','QQ']];
        user.forEach((node)=>{
            const Arr = [
                node.UserName, node.PassWorld, node.Age,
                node.Gender==='male'?'男':'女', node.Birthday, node.Picture,
                node.Hometown, node.Phone, node.QQ
            ];
            DATA.push(Arr)
        });
        const options = {'!cols': [{wch:11},{wch:14},{wch:8},{wch:6},{wch:13},{wch:50},{wch:16},{wch:15},{wch:13}]};
        const buffer = xlsx.build([{name: "所有用户信息表", data: DATA}],options);
        fs.writeFile('./public/download/user.xlsx',buffer,(err)=>{
            if(err){
                res.send({
                    code : 0 ,
                    msg : '下载失败'
                });
            }
            res.send({
                code:1,
                file: 'http://' + req.headers.host + '/download/user.xlsx'
            })
        });
    })
});
//向外暴露接口
module.exports = router;
