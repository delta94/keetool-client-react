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
        isClose: false
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
                    }
                }.bind(this));
        },
    }

});