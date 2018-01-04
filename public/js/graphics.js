var modalBuy = new Vue({
    el: "#modalBuy",
    data: {
        isLoading: false,
        goods: [],
        total_price: 0,
        price_vnd: '',
    },
    methods: {
        getGoodsFromSesson: function () {
            axios.get(window.url + '/load-books-from-session')
                .then(function (response) {
                    this.goods = response.data.goods;
                    this.total_price = response.data.total_price;
                    this.price_vnd = this.total_price.toString().replace(/\./g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';
                    this.isLoading = false;
                    openWithoutAdd.countBooksFromSession();
                }.bind(this))
                .catch(function (error) {

                });
        },
        addGoodToCart: function (goodId) {
            this.goods = [];
            this.isLoading = true;
            axios.get(window.url + '/add-book/' + goodId)
                .then(function (response) {
                    modalBuy.getGoodsFromSesson();
                }.bind(this))
                .catch(function (error) {

                });
        },
        minusGood: function (event, goodId) {
            newGoods = [];
            for (i = 0; i < this.goods.length; i++) {
                good = this.goods[i];
                if (good.id === goodId) {
                    good.number -= 1;
                    this.total_price -= good.price * (1 - good.coupon_value);
                    this.price_vnd = this.total_price.toString().replace(/\./g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';
                    if (good.number !== 0)
                        newGoods.push(good);
                }
                else
                    newGoods.push(good);
            }
            this.goods = newGoods;
            axios.get(window.url + '/remove-book/' + goodId)
                .then(function (response) {
                    openWithoutAdd.countBooksFromSession();
                }.bind(this))
                .catch(function (error) {

                });
        },
        plusGood: function (event, goodId) {
            newGoods = [];
            for (i = 0; i < this.goods.length; i++) {
                good = this.goods[i];
                if (good.id === goodId) {
                    good.number += 1;
                    this.total_price += good.price * (1 - good.coupon_value);
                    this.price_vnd = this.total_price.toString().replace(/\./g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';
                }
                newGoods.push(good);
            }
            this.goods = newGoods;
            axios.get(window.url + '/add-book/' + goodId)
                .then(function (response) {
                    openWithoutAdd.countBooksFromSession();
                }.bind(this))
                .catch(function (error) {

                });
        },
        openPurchaseModal: function () {
            $('#modalBuy').modal('hide');
            $('#modalPurchase').modal("show");
            $("body").css("overflow", "hidden");
            modalPurchase.loadingProvince = true;
            modalPurchase.showProvince = false;
            modalPurchase.openModal();
        },
    }
});

var openModalBuy1 = new Vue({
    el: "#vuejs1",
    data: {},
    methods: {
        openModalBuy: function (goodId) {
            $('#modalBuy').modal('show');
            modalBuy.addGoodToCart(goodId);
        },
    }
});

var openModalBuy2 = new Vue({
    el: "#vuejs2",
    data: {},
    methods: {
        openModalBuy: function (goodId) {
            $('#modalBuy').modal('show');
            modalBuy.addGoodToCart(goodId);
        },
    }
});

var openModalBuy3 = new Vue({
    el: "#vuejs3",
    data: {},
    methods: {
        openModalBuy: function (goodId) {
            $('#modalBuy').modal('show');
            modalBuy.addGoodToCart(goodId);
        },
    }
});

var openWithoutAdd = new Vue({
    el: "#openWithoutAdd",
    data: {
        books_count: 0,
    },
    methods: {
        countBooksFromSession: function () {
            axios.get(window.url + '/count-books-from-session')
                .then(function (response) {
                    this.books_count = response.data;
                }.bind(this))
                .catch(function (error) {

                });
        },
        openModalBuyWithoutAdd: function () {
            $('#modalBuy').modal('show');
            modalBuy.goods = [];
            modalBuy.isLoading = true;
            modalBuy.getGoodsFromSesson();
        },
    },
    mounted: function () {
        this.countBooksFromSession()
    },
});

var modalPurchase = new Vue({
    el: "#modalPurchase",
    data: {
        name: '',
        phone: '',
        email: '',
        address: '',
        payment: '',
        provinceid: '',
        districtid: '',
        wardid: '',
        loadingProvince: false,
        showProvince: false,
        loadingDistrict: false,
        showDistrict: false,
        provinces: [],
        districts: [],
    },
    methods: {
        getProvinces: function () {
            axios.get(window.url + '/province')
                .then(function (response) {
                    this.provinces = response.data.provinces;
                    this.loadingProvince = false;
                    this.showProvince = true;
                }.bind(this))
                .catch(function (error) {

                });
        },
        getDistricts: function () {
            axios.get(window.url + '/district/' + this.provinceid)
                .then(function (response) {
                    this.districts = response.data.districts;
                    this.loadingDistrict = false;
                    this.showDistrict = true;
                }.bind(this))
                .catch(function (error) {

                });
        },
        openModal: function () {
            this.getProvinces();
        },
        changeProvince: function () {
            this.loadingDistrict = true;
            this.getDistricts();
        },
        submitOrder: function () {
            $("#purchase-error").css("display", "none");
            $("#btn-purchase-group").css("display", "none");
            $("#purchase-loading-text").css("display", "block");
            if (!this.name || !this.phone || !this.email || !this.address || !this.payment) {
                alert("Bạn vui lòng nhập đủ thông tin và kiểm tra lại email");
                $("#purchase-error").css("display", "block");
                $("#purchase-loading-text").css("display", "none");
                $("#btn-purchase-group").css("display", "block");
                return;
            }
            axios.post(window.url + '/save-order', {
                name: this.name,
                phone: this.phone,
                email: this.email,
                provinceid: this.provinceid ? this.provinceid : '01',
                districtid: this.districtid ? this.districtid : '001',
                address: this.address,
                payment: this.payment,
                _token: window.token,
            })
                .then(function (response) {
                    $("#purchase-loading-text").css("display", "none");
                    $("#btn-purchase-group").css("display", "block");
                    $("#modalPurchase").modal("hide");
                    $("#modalSuccess").modal("show");
                    name = "";
                    phone = "";
                    email = "";
                    address = "";
                    payment = "";
                })

                .catch(function (error) {
                    console.log(error);
                });
        },
    }
});
