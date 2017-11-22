@extends('layouts.public1')
@section('content')
    <div class="wrapper">
        <div class="page-header page-header-small"
             style="background-image: url('http://d1j8r0kxyu9tj8.cloudfront.net/images/1511171543ZQBRp0HaVGhGsF5.jpg');">

        </div>
        <div class="wrapper">
            <div class="container">
                <div class="row owner">
                    <div class="col-md-3 col-sm-5 col-xs-6">
                        <div class="avatar">
                            <img width="100%"
                                 src="https://s3-ap-southeast-1.amazonaws.com/cmstorage/images/1458318028a885YhKaEd3tkJ1.jpg"
                                 alt="Photoshop" class="img-responsive">
                        </div>
                    </div>
                    <div class="col-md-9 col-sm-7 col-xs-6">
                        <div>
                            <h6 class="card-category">Khoá học</h6>
                            <h3 class="card-title" style="margin-top:-10px">
                                <a href="#pablo"><b>Photoshop</b></a>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>


            <div class="main">

                <div class="section">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card card-plain">
                                    <div class="card-block">
                                        <h6 class="card-category">Design</h6>
                                        <a href="#pablo">
                                            <h3 class="card-title"><b>The aesthetic quality of a product</b></h3>
                                        </a>
                                        <p class="card-description">Eventually, the data collected from the grant
                                            program could allow the two to play a bit of machine learning moneyball —
                                            valuing machine learning engineers without traditional metrics (like having
                                            a PhD from Stanford)...</p>
                                        <p class="card-description">Eventually, the data collected from the grant
                                            program could allow the two to play a bit of machine learning moneyball —
                                            valuing machine learning engineers without traditional metrics (like having
                                            a PhD from Stanford)...</p>

                                        <div class="card-footer">
                                            <button type="button" onclick="openModalBuy(9,150000)"
                                                    class="btn btn-outline-default btn-round">
                                                <i class="fa fa-shopping-cart"></i>
                                                Đăng kí ngay
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card card-profile card-plain">
                                    <img class="card-img-top"
                                         src="https://s3-ap-southeast-1.amazonaws.com/cmstorage/images/1458318028a885YhKaEd3tkJ1.jpg">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section section-dark" style="background-color:#3c5dc5">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card card-profile card-plain">
                                    <img class="card-img-top"
                                         src="https://s3-ap-southeast-1.amazonaws.com/cmstorage/images/1458318028a885YhKaEd3tkJ1.jpg">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card card-plain">
                                    <div class="card-block">
                                        <h6 class="card-category">Design</h6>
                                        <a href="#pablo">
                                            <h3 class="card-title"><b>The aesthetic quality of a product</b></h3>
                                        </a>
                                        <p class="card-description">Eventually, the data collected from the grant
                                            program could allow the two to play a bit of machine learning moneyball —
                                            valuing machine learning engineers without traditional metrics (like having
                                            a PhD from Stanford)...</p>
                                        <p class="card-description">Eventually, the data collected from the grant
                                            program could allow the two to play a bit of machine learning moneyball —
                                            valuing machine learning engineers without traditional metrics (like having
                                            a PhD from Stanford)...</p>

                                        <div class="card-footer">
                                            <br>
                                            <button type="button" onclick="openModalBuy(9,150000)"
                                                    class="btn btn-outline-neutral btn-round">
                                                <i class="fa fa-shopping-cart"></i>
                                                Đăng kí ngay
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="section">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-8 offset-md-2  text-center">
                                <h2 class="title">Why our product is the best</h2>
                                <h5 class="description">This is the paragraph where you can write more details about
                                    your product. Keep you user engaged by providing meaningful information. Remember
                                    that by this time, the user is curious, otherwise he wouldn't scroll to get
                                    here.</h5>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="info">
                                    <div class="icon icon-danger">
                                        <img src="https://s3-ap-southeast-1.amazonaws.com/cmstorage/images/1458318028a885YhKaEd3tkJ1.jpg"
                                             height="100px"/>
                                    </div>
                                    <div class="description">
                                        <h4 class="info-title">Beautiful Gallery</h4>
                                        <p class="description">Spend your time generating new ideas. You don't have to
                                            think of implementing.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="info">
                                    <div class="icon icon-danger">
                                        <img src="https://s3-ap-southeast-1.amazonaws.com/cmstorage/images/1458318028a885YhKaEd3tkJ1.jpg"
                                             height="100px"/>
                                    </div>
                                    <div class="description">
                                        <h4 class="info-title">New Ideas</h4>
                                        <p>Larger, yet dramatically thinner. More powerful, but remarkably power
                                            efficient.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="info">
                                    <div class="icon icon-danger">
                                        <img src="https://s3-ap-southeast-1.amazonaws.com/cmstorage/images/1458318028a885YhKaEd3tkJ1.jpg"
                                             height="100px"/>
                                    </div>
                                    <div class="description">
                                        <h4 class="info-title">Statistics</h4>
                                        <p>Choose from a veriety of many colors resembling sugar paper pastels.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

@endsection