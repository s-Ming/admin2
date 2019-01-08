var express = require('express');
var router = express.Router();
var {
    find,
    insert,
    del,
    update
} = require("../libs/mongodb.js");


/* 插入数据 */
router.get('/insert', async(req, res, next) => {
    let {
        goodsId,
        goodsName,
        goodsPrice,
        goodsMiao,
        goodsZhuang,
        goodsLei,
        goodsKu,
        imgurl
    } = req.query;
    let data = await find(`goods`, {
        goodsId: goodsId
    })
    console.log(data == [])
        //如果用户名为空，则直接结束函数
    if (data.length != 0) {
        res.send("失败");
        return;
    } else {
        await insert(`goods`, [{
            goodsId,
            goodsName,
            goodsPrice,
            goodsMiao,
            goodsZhuang,
            goodsLei,
            goodsKu,
            imgurl
        }])
        res.send("成功");
    }
});

/* 查找全部数据  排序*/
router.get('/findGoods', async(req, res, next) => {
    let {
        goodsId,
        dateUp,
        dateDown,
        priceUp,
        priceDown
    } = req.query;
    console.log(goodsId)
    let data = await find(`goods`, goodsId ? {
        goodsId
    } : {})

    if (data.length != 0) {
        res.send(data);
        return;
    } else {
        res.send('没有数据')
    }
});

/* 修改数据 */



/* 删除数据 */


module.exports = router;