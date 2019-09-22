let express = require('express');
let router = express.Router();
let DB = require('./../../modules/db.js');

router.get('/userList',function (req,res) {
    DB.find('user', {}, function (err, users) {
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

router.post('/userAdd',function (req,res) {
    const USERNAME = req.query.username;
    const PASSWORLD = req.query.password;
    const AGE = req.query.age;
    const GENDER = req.query.gender;
    const BIRTHDAY = req.query.birthday;
    const PICTURE = req.query.picture;
    const HOMETOWN = req.query.hometown;
    const PHONE = req.query.phone;
    const QQ = req.query.qq;
    DB.insert('user',{
        UserName:USERNAME,
        PassWorld:PASSWORLD,
        Age:AGE,
        Gender:GENDER,
        Birthday:BIRTHDAY,
        Picture:PICTURE,
        Hometown:HOMETOWN,
        Phone:PHONE,
        QQ:QQ
    },function (err,data) {
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

module.exports = router;
