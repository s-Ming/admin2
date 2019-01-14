require(['config'], function() {
    require(['jquery'], function($) {

        //自动登录
        ;
        (async() => {
            let fn = {
                true: async() => {
                    let data = await fn.getUserList();
                    // console.log(data);

                },
                false() {
                    location.href = "./html/login.html";
                    return this;
                },
                getUserList() {
                    new AddGoods();

                },
                autoLogin() {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            type: "POST",
                            headers: {
                                token: localStorage.getItem("token")
                            },
                            // url: "http://localhost:3000/users/autoLogin",
                            url: "http://47.93.0.253:3000/users/autoLogin",

                            success(data) {
                                console.log(data)
                                resolve(data)
                            }
                        })
                    })
                }
            }
            let isLogin = await fn.autoLogin();
            // 异步 awiat和async
            fn[isLogin.status]()

        })();



        //上传商品构造函数
        function AddGoods() {
            console.log(11111);
            //图片上传状态，未提交则不能提交信息
            this.pictureCheck = false;

            //点击执行上传图片
            this.goodsPictureAdd = $('#goodsPictureAdd')[0];
            this.goodsPictureAdd.onclick = this.picture.bind(this); //改变this指向
            //点击提交执行获取信息--》验证
            $('#button').on('click', () => {
                    this.getGoods();
                })
                //提交
                // $('#button')


            this.data; //储存请求的数据

            // this.rootpath = 'http://localhost:3000';
            this.rootpath = "http://47.93.0.253:3000";
            this.pagesize = 5; //显示信息数量
            this.total = 0; //总页数
            this.nowpage = 1; //当前页码
            this.id = false; //判断是否是ID排序
            this.price = false; //判断是否是价格排序;
            this.mohu = false; //是否模糊查询
            this.paixu = 'goodsId'; //排序类型
            this.singleName = false; //单个商品查询

            this.sort = 1; //默认升序排序   参数是数值类型
            this.val = '' //储存模糊查询的值;

            this.target; //储存当前修改或删除点击的元素

            this.getData(); //请求数据
            this.listen() //监听点击事件


            this.goodsId; //id
            this.goodsName; //名称
            this.goodsPrice; //价格
            this.goodsMiao; //描述
            this.goodsZhuang; //状态
            this.goodsLei; //类型
            this.goodsKu; //库存
        }
        //图片上传
        AddGoods.prototype.picture = function() {
            // console.log('上传图片');
            // console.log(this);
            // let rootPath = 'http://localhost:3000'
            let rootPath = "http://47.93.0.253:3000"; //服务器
            let data = new FormData();
            let file = $('#goodsPicture')[0]['files'][0];
            console.log(file);
            data.append('test', file)
            $.ajax({
                url: rootPath + '/upload/img',
                type: 'POST',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: (data) => {
                    console.log(data)
                    if (data.err == 0) {
                        //显示缩略图
                        $('#uploadimg').attr('src', rootPath + data.data)

                        //更改图片的上传状态
                        if (this.singleName) {
                            this.pictureCheck = false;
                        } else {
                            this.pictureCheck = true;
                        }
                        console.log(this.singleName)
                        console.log(this.pictureCheck)
                            //保存图片路径
                        this.imgurl = data.data;
                    } else {
                        alert(data.msg)
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    document.getElementById("status").innerHTML = "<span style='color:#EF0000'>连接不到服务器，请检查网络！</span>";
                }
            });

        };

        //验证输入信息是否为空及是否合法
        AddGoods.prototype.check = function() {
            console.log(this);
            if (this.goodsId * 1 != this.goodsId || this.goodsId == "") {
                alert("请输入数字");
                return false;
            }
            if (this.goodsName == "") {
                alert("名称不能为空");
                return false;
            }
            if (this.goodsPrice * 1 != this.goodsPrice || this.goodsPrice == "") {
                alert("请输入数字");
                return false;
            }
            if (this.goodsMiao == "") {
                alert("描述不能为空");
                return false;
            }
            if (this.goodsKu * 1 != this.goodsKu || this.goodsKu == "") {
                alert("请输入数字");
                return false;
            }

            //执行提交
            this.btn();


        };

        //获取输入的信息
        AddGoods.prototype.getGoods = function() {
            console.log('getGoods')
                //获取信息
            this.goodsId = $('#goodsId').val(); //id
            this.goodsName = $('#goodsName').val(); //名称
            this.goodsPrice = $('#goodsPrice').val(); //价格
            this.goodsMiao = $('#goodsMiao').val(); //描述
            this.goodsZhuang = $('#goodsZhuang option:selected').val() //状态
            this.goodsLei = $('#goodsLei option:selected').val(); //类型
            this.goodsKu = $('#goodsKu').val(); //库存
            // console.log(this.goodsZhuang);
            //执行验证
            this.check();
        };

        //提交上传的信息
        AddGoods.prototype.btn = function() {
            //get请求封装
            console.log(this.goodsId);
            var submit = (url) => {
                console.log(this)
                $.get(url, {
                    goodsId: this.goodsId,
                    goodsName: this.goodsName,
                    goodsPrice: this.goodsPrice,
                    goodsMiao: this.goodsMiao,
                    goodsZhuang: this.goodsZhuang,
                    goodsLei: this.goodsLei,
                    goodsKu: this.goodsKu,
                    imgurl: this.imgurl
                }, (data) => {
                    // console.log(data);
                    //储存接收到的数据
                    // this.data = data;
                    console.log(data);
                    if (data == "成功") {
                        //隐藏上传模块  显示商品列表
                        $('.newGoods').css('display', 'none');
                        $('.container-fluid .row main').css('display', 'block');

                        //执行getData构造函数，重新加载数据
                        this.getData();
                    } else {
                        alert('插入失败')
                    }
                    //执行判读
                })
            };
            // 执行提交的路径
            if (this.pictureCheck) {
                // let insert = 'http://localhost:3000/index/insert';
                let insert = "http://47.93.0.253:3000/index/insert"
                    //提交
                submit(insert);

            } else if (this.singleName) { //（this.singleName）如果为修改可以不提交图片
                // let update = 'http://localhost:3000/index/update';
                let update = "http://47.93.0.253:3000/index/update"
                console.log('我是修改提交')
                submit(update);

            } else {
                alert('请上传图片')
            }
            //改变图片上传状态
            this.pictureCheck = false;
        };

        //显示提交状态
        AddGoods.prototype.btnCheck = function() {

        };


        //页面初始化 获取数据
        AddGoods.prototype.getData = function() {
            let data = {
                pagesize: this.pagesize,
                page: this.nowpage
            }
            let url = this.rootpath;
            //判断是否是模糊查询
            if (this.mohu) {
                console.log('模糊查询')
                console.log(this.val)
                data.val = this.val;
                url = url + '/index/findGoodsSing';
            } else if (this.id || this.price) { // 判断是否是排序查询
                data.paixu = this.paixu;
                data.sort = this.sort;
                console.log('排序查询')
                url = url + '/index/findGoodSort';
            } else if (this.singleName) { //查找单个ID
                data.goodsId = this.goodsId;
                url = url + '/index/findSinGoods';
            } else {
                // 默认查询
                console.log('默认查询')
                url = url + '/index/findGoods';
            }

            //请求新的页数  作为当前页
            $.get(url, data, (res) => {
                // console.log(res)
                if (res.length != 0) {
                    // 保存请求到的数据
                    this.data = res;
                    // 显示总信息数量
                    $('.dataNum').text(res.total)
                    console.log(res)
                        //选择渲染方式
                    if (this.singleName) {
                        this.render2(); //渲染修改页面的数据
                    } else {
                        this.render(); //商品类别页面渲染
                    }
                    //当个请求不执行计算页数
                    if (!this.singleName) {
                        this.total = res.total;
                        // 计算页数
                        var yeshu = Math.ceil(res.total / this.pagesize);
                        $('.zongshu').text(yeshu);

                        //设置临界值
                        if (this.nowpage <= yeshu) {
                            console.log(66666)
                            $('.danqian').text(this.nowpage);
                        }
                    }

                }
            })
        };

        //点击事件监听
        AddGoods.prototype.listen = function() {
            // console.log(77777);
            // //存储this
            // let that = this;
            //获取删除按钮
            $('tbody').on('click', 'button', (e) => {
                this.target = e.target;
                //根据事件源判断进行哪种事件
                let className = e.target.className;
                if (className == 'shanchu') {
                    console.log('shanchu');
                    let remove = window.confirm("是否删除该项");
                    if (!remove) {
                        return false;
                    }
                    // 执行删除函数
                    this.dele();
                } else if (className == 'bianji') {
                    console.log('bianji');
                    $('.container-fluid .row main').css('display', 'none');
                    $('.container-fluid .row .newGoods').css('display', 'block');

                    //执行修改函数
                    this.revamp();
                }
            });
            //显示增加或修改商品模块
            $('#xinzeng').on('click', (e) => {
                $('.container-fluid .row main').css('display', 'none');
                $('.container-fluid .row .newGoods').css('display', 'block');
                // $('.container-fluid .row main').toggleClass('none');
                // $('.container-fluid .row .newGoods').toggleClass('block');
            });

            //隐藏增加或修改商品模块
            $('.closeBtn').on('click', () => {
                console.log(6666)
                $('.container-fluid .row main').css('display', 'block');
                $('.container-fluid .row .newGoods').css('display', 'none');
            });

            //更改显示信息数量 5/10/20/30
            $('#select').on('change', () => {
                var val = $(':selected').val();
                this.pagesize = val;
                console.log(val)
                this.getData();
            });

            //点击切换上下页
            $('.pd-20').on('click', (e) => {
                var tar = $(e.target).attr('class');
                var arr = ['first', 'last', 'jump', 'prev', 'next'];
                var num = arr.indexOf(tar);
                if (num != -1) {
                    this.goPage(tar);
                }
            });

            //点击搜索
            $('#search').on('click', () => {
                this.search();
            })

        }

        //修改信息
        AddGoods.prototype.revamp = function() {
            // 先请求该项的详细项目，渲染到页面上，再改动
            let currtr = $(this.target).closest('tr');
            let currid = currtr.attr('data-guid'); //得到当前ID
            console.log(currid);
            this.goodsId = currid;
            // 更改获取请求类型
            this.singleName = true;
            // 请求数据
            this.getData()

        }

        // 渲染数据方法
        AddGoods.prototype.render = function() {
            var res = '';
            var str = this.data.data.map((item, idx) => {
                return `
                <tr class="text-c" data-guid="${item['goodsId']}">
                 <td><input name="" type="checkbox" value=""></td>
                 <td>${item['goodsId']}</td>
                 <td>${item['goodsName']}</td>
                 <td><img class="img" src='${item['imgurl']}' style="width:100px"></td>
                 <td>${item['goodsLei']}</td>
                 <td class="text-l">${item['goodsPrice']}</td>
                 <td class="text-c">${item['goodsMiao']}</td>
                 <td>${item['goodsKu']}</td>
                 <td class="td-status"><span class="label label-success radius">${item['goodsZhuang']}</span></td>
                 <td class="td-manage">
                 <button class="bianji">编辑</button>
                 <button class="shanchu">删除</button>
              </tr>
              `
            }).join('');
            $('tbody').html(str);
        };

        //渲染修改页面的数据
        AddGoods.prototype.render2 = function() {


            console.log('woshi xiugai');
            console.log(this.data)
                //储存原先的图片路径
            this.imgurl = this.data[0].imgurl;
            console.log(this.imgurl);
            //禁止修改ID
            $('#goodsId').attr('disabled', 'disabled').val(this.data[0].goodsId); //id
            $('#goodsName').val(this.data[0].goodsName); //名称
            $('#goodsPrice').val(this.data[0].goodsPrice); //价格
            $('#goodsMiao').val(this.data[0].goodsMiao); //描述
            $('#goodsZhuang option:selected').val(this.data[0].goodsZhuang) //状态
            $('#goodsLei option:selected').val(this.data[0].goodsLei); //类型
            $('#goodsKu').val(this.data[0].goodsKu); //库存
        }

        //搜索方法
        AddGoods.prototype.search = function() {
            console.log('sousuo');
            this.mohu = true;
            // 获取输入的值
            this.val = $("#search_val").val();
            if (this.val == "") {
                return;
            }
            this.getData();

        };

        //单项删除方法
        AddGoods.prototype.dele = function() {
            console.log('我是单项删除');
            let currtr = $(this.target).closest('tr');
            let currid = currtr.attr('data-guid');
            let data = {
                goodsId: currid
            };
            let url = this.rootpath + '/index/dele';
            $.get(url, data, (res) => {
                console.log(res)
                if (res.n = 1) {
                    // this.data = res;
                    // this.render();
                    currtr.remove();
                    this.total = this.total - 1;
                    // 计算页数
                    var yeshu = Math.ceil(res.length / this.pagesize);
                    $('.zongshu').text(yeshu);
                    console.log(yeshu)
                        //设置临界值
                    if (this.nowpage <= yeshu) {
                        console.log(66666)
                        $('.danqian').text(this.nowpage);
                    }
                }
            })
        };

        // 批量删除方法
        AddGoods.prototype.allDele = function() {

        };

        // 分页逻辑
        AddGoods.prototype.goPage = function(type) {
            let page = 1;
            switch (type) {
                case 'first':
                    page = 1;
                    break;
                case 'last':
                    page = Math.ceil(this.total / this.pagesize);
                    break;
                case 'jump':
                    if ($('#jump').val() > Math.ceil(this.total / this.pagesize)) {
                        break;
                    };
                    page = $('#jump').val()
                    break;
                case 'prev':
                    if (this.nowpage == 1) {
                        break;
                    }
                    page = this.nowpage - 1
                        //边界判断
                    break;
                case 'next':
                    if (this.nowpage == Math.ceil(this.total / this.pagesize)) {
                        console.log(this.total)
                        break;
                    }
                    page = this.nowpage + 1
                    break;
            }
            this.nowpage = page;
            console.log(this.nowpage)
            this.getData();
        };
        // new AddGoods();





    })
})