var express = require('express');
var router = express.Router();
var {
    find,
    insert,
    del,
    update
} = require("../libs/mongodb.js");

var token = require("../libs/token.js");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.post('/findUser', async(req, res, next) => {
    let {
        id,
        name,
        skill
    } = req.body
    let data = await find(`users`, {
        id
    })
    res.send(data);
});

router.post('/login', async(req, res, next) => {
    console.log(req.body);
    let {
        user,
        password
    } = req.body
    let data = await find(`users`, {
        user: user
    })
    console.log(data == [])
        //如果用户名为空，则直接结束函数
    if (data.length == 0) {
        res.send("失败");
        return;
    } else if (data[0].password == password) {
        // res.send("成功");
        res.send({
            status: "success",
            token: token.createToken({ //设置令牌，参数可以设置多个，也可以放入时间戳
                    user,
                    password
                }, 3600) //设置时间为3600秒
        });
    } else {
        res.send("失败");
    }
});

//自动登录，令牌检测
router.post('/autoLogin', async(req, res, next) => {
    // console.log(req.headers)
    res.send({
        status: token.checkToken(req.headers.token)
    })
})


module.exports = router;