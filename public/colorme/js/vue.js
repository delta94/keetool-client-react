var vueData = {
    isLogin: false,
    user: {}
};

var vueNav = new Vue({
    el: '#vue-nav',
    data: vueData,
    methods: {
        openModalLogin: function () {
            modalLogin.user.email = '';
            modalLogin.user.password = '';
            modalLogin.isClose = false;
        },
        logout: function () {
            localStorage.removeItem('auth');
        }
    }
});

var modalLogin = new Vue({
    el: '#modalLogin',
    data: {
        user: {
            email: '',
            password: ''
        },
        isLoading: false,
        hasError: false,
        isClose: false,
        modalLogin: true,
    },
    methods: {
        login: function () {
            var url = "/login-social";
            this.isLoading = true;
            this.hasError = false;
            this.isClose = true;
            axios.post(url, this.user)
                .then(function (res) {
                    this.isLoading = false;
                    this.isClose = false;
                    if (res.data.status === 0) {
                        this.hasError = true;
                        toastr.error("Kiểm tra thông tin tài khoản");
                    } else {
                        $('#modalLogin').modal('toggle');
                        vueData.isLogin = true;
                        vueData.user = res.data.user;
                        localStorage.setItem('auth', JSON.stringify(res.data));
                        location.reload();
                    }
                }.bind(this));
        },
        changeModal: function () {
            this.modalLogin = !this.modalLogin;
        },
        register: function () {
            $("#form-register form").validate({
                rules: {
                    email: "required",
                    name: "required",
                    phone: "required",
                    password: "required",
                    confirm_password: {
                        required: true,
                        equalTo: "#password"
                    }
                },
                messages: {
                    email: {
                        required: "Vui lòng nhập email",
                        email: "Vui lòng nhập đúng email"
                    },
                    password: {
                        required: 'Vui lòng nhập mật khẩu',
                    },
                    confirm_password: {
                        required: 'Vui lòng xác nhận mật khẩu',
                        equalTo: 'Mật khẩu không trùng'
                    },
                    name: "Vui lòng nhập họ và tên",
                    phone: "Vui lòng nhập số điện thoại"
                }
            });
            if ($("#form-register form").valid()) {
            }
        }
    }

});