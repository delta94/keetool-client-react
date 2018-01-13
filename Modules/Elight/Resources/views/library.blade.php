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
                    Giáo trình<br>
                </h1>
            </div>
            <div class="row">
                @foreach($books as $book)
                    <div class="col-md-3">
                        <div class="card card-profile" style="border-radius: 0px;">
                            <div style="padding: 3%;">
                                <div style="background-image: url('{{$book->icon_url}}'); background-size: cover; padding-bottom: 120%; width: 100%; background-position: center center;"></div>
                            </div>
                            <div>
                                <div class="container text-left" style="min-height: 130px;"><br>
                                    <p style="font-weight: 600;">{{$book->name}}</p>
                                    <p>{{shortString($book->description,15)}}</p>
                                </div>
                            </div>
                            <div class="card-footer" style="border-top: 1px solid rgb(220, 219, 219) !important;">
                                <div style="text-align: right;">
                                    <a class="btn btn-success" href="/sach/{{$book->id}}"
                                       style="padding: 3px; margin: 3px; font-size: 10px;">
                                        Nghe online <i class="fa fa-headphones" aria-hidden="true"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            <hr>
            <br>
            <br>
        </div>
    </div>
@endsection