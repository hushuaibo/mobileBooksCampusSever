const express = require('express');
const DB = require('./../../modules/db.js');
const router = express.Router();

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

module.exports = router;
