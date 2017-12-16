@extends('elight::layouts.master')

@section('content')
    <div class="page-header page-header-xs"
         style="background-image: url('http://d1j8r0kxyu9tj8.cloudfront.net/files/1513315147hlROAAiDKpgLRmg.png');">
        <div class="filter"></div>
        <div class="content-center">
            <div class="container">
                <br><br>
                <br><br>
                <div class="row">
                    <div class="col-md-8 offset-md-2 text-center">
                        <h1 class="title"><b>Thư viện điện tử</b></h1>
                        <h5 class=description">Sách là tài nguyên quý giá nhất của loài người</h5>
                        <br>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <div class="blog-4" style="margin-top:150px">
        <div class="container">
            <div class="description">
                <h1 class="medium-title">
                    Sách mới cập nhật<br>
                </h1>
            </div>
            <div class="row">
                @foreach($books as $book)
                    <div class="col-md-3">
                        <div class="card card-profile" style="border-radius: 0px;">
                            <div style="padding: 3%;">
                                <div style="background-image: url('{{$book->avatar_url}}'); background-size: cover; padding-bottom: 120%; width: 100%; background-position: center center;"></div>
                            </div>
                            <div>
                                <div class="container text-left" style="min-height: 130px;"><br>
                                    <p style="font-weight: 600;">{{$book->name}}</p>
                                    <p>{{$book->description}}</p>
                                </div>
                            </div>
                            <div class="card-footer" style="border-top: 1px solid rgb(220, 219, 219) !important;">
                                <div style="text-align: right;">
                                    <a class="btn btn-google" href="/book/{{$book->id}}"
                                       style="padding: 3px; margin: 3px; font-size: 10px;">
                                        Tải sách <i class="fa fa-download"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            <hr>
            {{--<div class="row">--}}
            {{--<div class="col-md-2 offset-md-10">--}}
            {{--<div class="pull-right">--}}
            {{--<button class="btn btn-link btn-default btn-move-right">Bài viết cũ hơn<i class="fa fa-angle-right"></i></button>--}}
            {{--<a class="btn btn-link btn-default btn-move-right" href="{{'/blog?page='.$page_id}}" style="{{$display}}">  Bài viết cũ hơn  </a>--}}
            {{--</div>--}}
            {{--</div>--}}
            {{--</div>--}}
            <br>
            <br>
        </div>
    </div>
@endsection