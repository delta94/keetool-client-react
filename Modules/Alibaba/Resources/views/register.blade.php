@extends('alibaba::layouts.master')

@section('content')
    <div class="page-header page-header-small"
         style="background-image: url('http://d1j8r0kxyu9tj8.cloudfront.net/files/1510991179Dz6rALtf43ja91K.jpg'); box-shadow: 0 3px 10px -4px rgba(0, 0, 0, 0.15);">
        <div class="container">
            <br><br>
            <div class="row">
                <div class="col-md-8" style="margin-top:10%">
                    <h2 style="font-weight:600; color:#1C484D!important"><b>ANH NGỮ ALIBABA</b></h2><br>
                    <h5 class="description" style="font-weight:100; color:#1C484D!important">TRUNG TÂM ANH NGỮ GIAO TIẾP
                        LỚN NHẤT HÀ THÀNH</h5>
                    <br>
                </div>
            </div>
        </div>
    </div>
    <div class="container" id="bookinfo2">
        <br><br>
        <div class="row">
            <div class="col-md-9"
                 style="margin-top:-100px; z-index:99; background:white; border-radius:20px; padding:3%">
                <div>
                    <div>
                        <h4 style="font-weight:600; color:#FF6D00">
                            KHOÁ HỌC <br>{{$course['name']}}<br>
                        </h4>
                        <br><h5>CHO NGƯỜI MỚI BẮT ĐẦU</h5><br>
                        <p>
                            {{$course['description']}}
                        </p>

                        {{--<br>--}}
                        {{--<p>--}}
                            {{--TẶNG bí kíp sách nghe (Chỉ DUY NHẤT Alibaba mới có ^^) với 24 chủ đề THÔNG DỤNG NHẤT.--}}
                        {{--</p>--}}
                        {{--<br>--}}
                        {{--<p>--}}
                            {{--TẶNG Vé tham gia club tối chủ nhật 600.000đ/1 năm.--}}
                        {{--</p>--}}
                        {{--<br>--}}
                        <a class="btn btn-round btn-danger" style="background-color:#FF6D00;border-color:#FF6D00"
                           href="/order"><i class="fa fa-plus"></i> Tìm hiểu thêm </a>
                    </div>
                    <br>
                </div>
            </div>

            <div class="col-md-3">
                <a class="btn btn-danger" style="width:100%;background-color:#FF6D00;border-color:#FF6D00; padding:40px"
                   href="/order"><i class="fa fa-plus"></i> Tìm hiểu thêm </a>

            </div>
        </div>
    </div>
    <br><br>
    <div class="container">
        <div class="row">
            @foreach($classes as $class)
                <div class="col-md-9" style="background:white; margin-bottom:20px; border-radius:20px; padding:3%">
                    <div>
                        <div style="display:flex;flex-direction:row">
                            <div style="margin-right:20px; border-radius:25px">
                                <img src="{{$class['icon_url']}}"
                                     style="border-radius:50%; height:100px;width:100px"/>
                            </div>
                            <div>
                                <h4 style="font-weight:600; margin-top:10px">{{$class['name']}}</h4>
                                <br><br>
                                <p>
                                    <i class="fa fa-clock-o"></i> <b>Khai giảng ngày:</b> {{$class['datestart']}}

                                    <br>

                                    <i class="fa fa-calendar"></i> <b>Lịch học:</b> {{$class['study_time']}}

                                    <br>

                                    <i class="fa fa-map-marker"></i> <b>Địa điểm:</b> {{$class['address']}}
                                    <br><br>
                                </p>
                                <a class="btn btn-round btn-danger" style="background-color:#FF6D00;border-color:#FF6D00"
                                   href="/register-class/{{$class['id']}}"><i class="fa fa-plus"></i> Tìm hiểu thêm </a>
                            </div>
                        </div>

                    </div>
                </div>
            @endforeach
        </div>
    </div>

@endsection