var express = require('express');
var router = express.Router();
var {
    connect,
    insert,
    find,
    ObjectId
} = require("../libs/mongodb.js");
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('我进来了');
});
//查询用户是否存在
router.post('/findUser', async(req, res, next) => {
    let {
        user
    } = req.body
        //传入表名，字段名
    let data = await find(`users`, user ? {
        user
    } : {})
    res.send(data);
});
//插入用户信息
router.post('/insert', async(req, res, next) => {
    let { user, password } = req.body
    let data = await insert(`users`, [{ user, password }])
    res.send(data);
});

module.exports = router;