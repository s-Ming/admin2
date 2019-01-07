require(['config'], function() {
    require(['jquery'], function($) {

        //点击登录获取输入的用户名及密码，请求服务器验证信息是否正确，根据服务器返回信息判断是否进入首页。
        function Login() {
            this.denglu = $('.btn-primary')[0]; //转为原生节点
            //点击执行登录验证
            //bind与call和apply的区别  bind()并不会立即执行，而call()和apply()立即执行
            this.denglu.onclick = this.qianduanyanzheng.bind(this);
            //保存this

        }
        Login.prototype.qianduanyanzheng = function() {
            // console.log(7777);
            //获取用户及密码信息，去除首尾空格
            this.user = $('#inputEmail').val().trim();
            this.pass = $('#inputPassword').val().trim();
            //用户及密码不能为空
            if (!this.user) {
                $('.phone-p').text('用户名不能为空');
                alert('用户名不能为空');
                return false;
            } else if (!this.pass) {
                $('.password-p').text('密码不能为空');
                alert('密码不能为空');
                return false;
            }
            //执行服务器验证
            // console.log(this)
            this.getData();
        }
        Login.prototype.getData = function() {
                console.log(this.user);
                $.post('http://localhost:3000/users/login', {
                    user: this.user,
                    password: this.pass
                }, (data) => {
                    // console.log(data);
                    //储存接收到的数据
                    this.data = data;
                    //执行判读
                    this.tanchuang();
                })

            }
            //根据信息设置弹窗
        Login.prototype.tanchuang = function() {
            if (this.data == "成功") {
                location = '../index.html?user=' + this.user;
            } else if (this.data == '失败') {
                alert('用户名或密码错误')
            }
        }

        var L = new Login();

    })
})