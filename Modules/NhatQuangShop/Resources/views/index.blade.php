@extends('nhatquangshop::layouts.master')

@section('content')
    {{--banner--}}
    <div style="margin-top:120px">
        <div class="row">
            <div class="col-md-12 shadow-banner">
                <div class="">
                    <div class="row">
                        <div class="ml-auto mr-auto">
                            <div class="card card-raised page-carousel">
                                <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                                    <ol class="carousel-indicators">
                                        <li data-target="#carouselExampleIndicators" data-slide-to="0" class=""></li>
                                        <li data-target="#carouselExampleIndicators" data-slide-to="1"
                                            class="active"></li>
                                        <li data-target="#carouselExampleIndicators" data-slide-to="2" class=""></li>
                                    </ol>
                                    <div class="carousel-inner" role="listbox">
                                        <div class="carousel-item">
                                            <img class="d-block img-fluid"
                                                 src="https://vcdn.tikicdn.com/ts/banner/34/57/e0/4cccc9504f0304db48f59e2a5d5578b9.jpg"
                                                 alt="First slide">
                                            <div class="carousel-caption d-none d-md-block">
                                                <p>Somewhere</p>
                                            </div>
                                        </div>
                                        <div class="carousel-item active">
                                            <img class="d-block img-fluid"
                                                 src="https://vcdn.tikicdn.com/ts/banner/34/57/e0/4cccc9504f0304db48f59e2a5d5578b9.jpg"
                                                 alt="Second slide">
                                            <div class="carousel-caption d-none d-md-block">
                                                <p>Somewhere else</p>
                                            </div>
                                        </div>
                                        <div class="carousel-item">
                                            <img class="d-block img-fluid"
                                                 src="https://vcdn.tikicdn.com/ts/banner/34/57/e0/4cccc9504f0304db48f59e2a5d5578b9.jpg"
                                                 alt="Third slide">
                                            <div class="carousel-caption d-none d-md-block">
                                                <p>Here it is</p>
                                            </div>
                                        </div>
                                    </div>

                                    <a class="left carousel-control carousel-control-prev"
                                       href="#carouselExampleIndicators" role="button" data-slide="prev">
                                        <span class="fa fa-angle-left"></span>
                                        <span class="sr-only">Previous</span>
                                    </a>
                                    <a class="right carousel-control carousel-control-next"
                                       href="#carouselExampleIndicators" role="button" data-slide="next">
                                        <span class="fa fa-angle-right"></span>
                                        <span class="sr-only">Next</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container" id="bookinfo">
        <br>
        <div class="row">
            <!--thanh search-->
            <div class="col-md-12">
                <div class="" style="display: flex;justify-content: space-between; align-items: stretch;">
                    <div style="display:flex;flex-grow:12; align-items: stretch">
                        <div class="flex-center search-icon">
                            <i class="fa fa-search" style="font-size: 32px" aria-hidden="true"></i>
                        </div>
                        <div style="flex-grow: 12" class="flex-center">
                            <input placeholder="Tìm kiếm"
                                   style="width:100%; border:none; font-size:20px; padding:15px; color:#2e2e2e"/>
                        </div>

                    </div>
                    {{--<div class="flex-center cursor-pointer" style="flex-wrap: wrap">--}}
                    {{--<div class="flex-center">--}}
                    {{--<div style="padding:20px">--}}
                    {{--<i class="fa fa-user-circle-o" style="font-size:32px" aria-hidden="true"></i>--}}
                    {{--</div>--}}
                    {{--<div>--}}
                    {{--Đăng nhập & Đăng ký tài khoản--}}
                    {{--</div>--}}
                    {{--<div >--}}
                    {{--<i class="fa fa-caret-down" aria-hidden="true"></i>--}}
                    {{--</div>--}}

                    {{--</div>--}}

                    {{--</div>--}}
                    {{--<div class="flex-center cursor-pointer">--}}
                    {{--<div style="padding-left:80px;">--}}
                    {{--<i class="fa fa-shopping-cart" style="font-size:32px" aria-hidden="true"></i>--}}
                    {{--</div>--}}
                    {{--</div>--}}
                </div>
            </div>
            <!--san pham noi bat-->
            <div class="col-md-6">
                <div>
                    <div class="description">
                        <h1 class="medium-title">
                            Sản phẩm nổi bật
                            <br>
                        </h1>
                        <br>
                        <a href="/product/feature" class="btn btn-link btn-success"
                           style="padding:0!important; margin:0!important">Xem tất cả
                            <i class="fa fa-angle-right"></i>
                        </a>
                    </div>
                    <br>
                </div>
            </div>
        </div>
        <div class="row" id="vuejs1" style="background-color: #ffffff;">
            <div class="container">
                <div class="row" >

        <?php use App\Good;$i = 0;$classes = array('col-md-6 padding-8', 'col-md-6 padding-8', 'col-md-3 padding-8', 'col-md-3 padding-8', 'col-md-3 padding-8', 'col-md-3 padding-8');?>
                   @include('nhatquangshop::common.products_show',['someGoods'=>$highLightGoods])
                </div>
            </div>
        </div>
        <br>
        <br>
    </div>

    <div class="container" id="bookinfo1">
        <br>
        <br>
        <div class="row">
            <div class="col-md-6">
                <div>
                    <div class="description">
                        <h1 class="medium-title">
                            Sản phẩm mới nhất
                            <br>
                        </h1>
                        <br>
                        <a href="/product/new" class="btn btn-link btn-success"
                           style="padding:0!important; margin:0!important">Xem tất cả
                            <i class="fa fa-angle-right"></i>
                        </a>
                        <br>
                        <br>
                    </div>
                    <br>
                </div>
            </div>
        </div>
        <div class="row" id="vuejs2" style="background-color: #ffffff;">
            <div class="container">
                <div class="row" >
                    @include('nhatquangshop::common.products_show', ['someGoods'=>$newestGoods])
                </div>
            </div>
        </div>
        <br>
        <br>
    </div>
    <?php $numbers = array("first");?>
    @foreach($categoryGoods as $categoryGood)
        <?php
        if ($categoryGood == $numbers[count($numbers) - 1]) {
            continue;
        }
        array_push($numbers, $categoryGood);
        $relateGoods = Good::where("good_category_id", "=", $categoryGood)->take(6)->get(); ?>
        <?php $categoryName = \App\GoodCategory::find($categoryGood)->name?>
        <div class="container">
            <div class="row" >
                <div class="col-md-6">
                    <div>
                        <div class="description">
                            <h1 class="medium-title">
                                {{$categoryName}}
                                <br>
                            </h1>
                            <br>
                            <a href="/product/new" class="btn btn-link btn-success"
                               style="padding:0!important; margin:0!important">Xem tất cả
                                <i class="fa fa-angle-right"></i>
                            </a>
                            <br>
                            <br>
                        </div>
                        <br>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row" style="background-color: #ffffff">
                @include('nhatquangshop::common.products_show', ['someGoods' => $relateGoods])
            </div>
        </div>

    @endforeach
@endsection

<style>
    .carousel-item > img {
        width: 100%;
    }

    .flex-center {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .search-icon {
        cursor: pointer;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        background-color: #dddddd;
        padding-left: 20px;
        padding-right: 20px;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .good-img {
        width: 100%;
        min-height: 250px;
        max-height: 260px;

    }

    .card-image {
        padding: 16px 20px !important;
        margin-bottom:20px !important;
    }

    .padding-8 {
        padding:8px !important;

    }
    .card.card-plain{
        margin-bottom:0;
    }
    .col-md-3{
        padding:0 !important;
    }
    .card-title {
        font-size: 13px !important;
        min-height:36px
    }
    .price {
        font-size:15px !important;
        margin-bottom:5px !important;
    }
    .badge {
        width: 40px;
        height: 40px;
        position: absolute;
        background: url(http://themusicianscircle.org/parts/circle.gif);
        background-size: contain;
        padding: 0;
        top:16px;
        left:20px;
        line-height: 30px !important;
        font-weight: 300;
        font-style: italic;
        z-index: 1;
        display: inline-block;
        min-width: 10px;
        color: #fff;
        vertical-align: middle;
        border-radius: 10px;
        font-size: 12px;
        text-align: center;
        white-space: nowrap;

    }
</style>