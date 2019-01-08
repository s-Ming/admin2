require(['config'], function() {
    require(['jquery'], function($) {

        //上传商品
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
        AddGoods.prototype.picture = function() {
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
        AddGoods.prototype.data = function() {
            console.log(this)
                //获取信息
            this.goodsId = $('#goodsId').val(); //id
            this.goodsName = $('#goodsName').val(); //名称
            this.goodsPrice = $('#goodsPrice').val(); //价格
            this.goodsMiao = $('#goodsMiao').val(); //描述
            this.goodsZhuang = $('#goodsZhuang').val(); //状态
            this.goodsLei = $('#goodsLei').val(); //类型
            this.goodsKu = $('#goodsKu').val(); //库存
            console.log(this.goodsId);
            //执行验证
            this.check();
        };

        //提交
        AddGoods.prototype.btn = function() {
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
        AddGoods.prototype.btnCheck = function() {

        };
        new AddGoods();

    })
})