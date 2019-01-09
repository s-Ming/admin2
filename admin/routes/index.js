var express = require('express');
var router = express.Router();
var {
    find,
    findSort,
    insert,
    del,
    update
} = require("../libs/mongodb.js");
console.log(findSort)

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

/* 查找全部数据 */
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


/* 模糊查询 */
router.get('/findGoodsSing', async(req, res, next) => {
    let {
        val,
    } = req.query;
    console.log(val)
    let data = await find(`goods`, {
        goodsName: val
    });
    console.log("----------------------------------------------------------");
    console.log(data);
    if (data.length != 0) {
        res.send(data);
        return;
    } else {
        res.send('没有数据')
    }
});

/* 排序 */
router.get('/findGoodSort', async(req, res, next) => {
    let {
        paixu,
        sort
    } = req.query;
    sort = Number(sort); //转为number类型
    let data = await findSort(`goods`, {
        [paixu]: sort
    });
    res.send(data);
    // if (paixu == 'goodsId') {
    //     if (sort == -1) {
    //         let data = await findSort(`goods`, {
    //             goodsId: -1
    //         });
    //         res.send(data);

    //     } else {
    //         let data = await findSort(`goods`, {
    //             goodsId: 1
    //         });
    //         res.send(data);
    //     }
    // } else if (paixu == 'goodsPrice') {
    //     if (sort == -1) {
    //         let data = await findSort(`goods`, {
    //             goodsPrice: -1
    //         });
    //         res.send(data);
    //     } else {
    //         let data = await findSort(`goods`, {
    //             goodsPrice: 1
    //         });
    //         res.send(data);
    //     }
    // }

});
/* 修改数据 */



/* 删除数据 */
router.get('/dele', async(req, res, next) => {
    let {
        goodsId,
    } = req.query;
    console.log(goodsId)
    let data = await del(`goods`, {
        goodsId
    });
    console.log("----------------------------------------------------------");
    console.log(data.result);
    res.send(data.result);

});


module.exports = router;