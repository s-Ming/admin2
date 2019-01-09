require(['config'], function () {
    require(['jquery'], function ($) {

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
                this.data();
            })
            //提交
            // $('#button')

        }
        //图片上传
        AddGoods.prototype.picture = function () {
            // console.log('上传图片');
            // console.log(this);
            let rootPath = 'http://localhost:3000'
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
                        this.pictureCheck = true;
                        //保存图片路径
                        this.imgurl = data.data;
                    } else {
                        alert(data.msg)
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    document.getElementById("status").innerHTML = "<span style='color:#EF0000'>连接不到服务器，请检查网络！</span>";
                }
            });

        };

        //验证输入信息是否为空及是否合法
        AddGoods.prototype.check = function () {
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
        AddGoods.prototype.data = function () {
            console.log(this)
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
        AddGoods.prototype.btn = function () {
            if (this.pictureCheck) {
                //提交
                console.log(6666);
                $.get('http://localhost:3000/index/insert', {
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

                        //执行Goods构造函数，重新加载数据
                        new Goods();
                    } else {
                        alert('插入失败')
                    }
                    //执行判读

                })
            } else {
                alert('请上传图片')
            }
            //改变图片上传状态
            this.pictureCheck = false;

        };

        //显示提交状态
        AddGoods.prototype.btnCheck = function () {

        };
        new AddGoods();




        //商品展示构造函数  包含搜索，删除，修改，排序，商品修改构造函数
        function Goods() {


            this.data; //储存请求的数据

            this.rootpath = 'http://localhost:3000';
            this.pagesize = 5; //显示信息数量
            this.total = 0; //总页数
            this.nowpage = 1; //当前页码
            this.id = false; //判断是否是ID排序
            this.price = true; //判断是否是价格排序;
            this.mohu = false; //是否模糊查询
            this.paixu = 'goodsId'; //排序类型
            this.sort = -1; //默认升序排序   参数是数值类型
            this.val = '' //储存模糊查询的值;

            this.target; //储存当前修改或删除点击的元素

            this.getData(); //请求数据
            this.listen() //监听点击事件
        }

        //页面初始化 获取数据
        Goods.prototype.getData = function () {
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
            } else {
                // 默认查询
                console.log('默认查询')
                url = url + '/index/findGoods';
            }
            //请求新的页数  作为当前页
            $.get(url, data, (res) => {
                console.log(res)
                if (res.length != 0) {
                    this.data = res;
                    this.render();
                    this.total = res.length;
                    // 计算页数
                    var yeshu = Math.ceil(res.length / this.pagesize);
                    $('.zongshu').text(yeshu);
                    //设置临界值
                    if (this.nowpage <= yeshu) {
                        console.log(66666)
                        $('.danqian').text(this.nowpage);
                    }
                }
            })
        };

        //点击事件监听
        Goods.prototype.listen = function () {
            console.log(77777);
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
            $('.nav-link').on('click', (e) => {
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

        }

        //修改信息
        Goods.prototype.revamp = function () {}

        // 渲染数据方法
        Goods.prototype.render = function () {
            var res = '';
            var str = this.data.map((item, idx) => {
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

        //搜索方法
        Goods.prototype.search = function () {

        };

        //单项删除方法
        Goods.prototype.dele = function () {
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
                    //设置临界值
                    if (this.nowpage <= yeshu) {
                        console.log(66666)
                        $('.danqian').text(this.nowpage);
                    }
                }
            })
        };

        // 批量删除方法
        Goods.prototype.allDele = function () {

        };

        // 分页逻辑
        Goods.prototype.goPage = function () {

        };

        new Goods();




    })
})