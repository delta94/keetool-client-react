@extends('colorme_new.layouts.master')

@section('styles')
    <!-- Froala Editor -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/css/froala_editor.min.css" rel="stylesheet"
          type="text/css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/css/froala_style.min.css" rel="stylesheet"
          type="text/css">

    <!-- Include Code Mirror style -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.3.0/codemirror.min.css">

    <!-- Include Editor Plugins style. -->
    <link rel="stylesheet" href="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/css/plugins/char_counter.css">
    <link rel="stylesheet" href="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/css/plugins/code_view.css">
    <link rel="stylesheet" href="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/css/plugins/colors.css">
    <link rel="stylesheet" href="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/css/plugins/emoticons.css">
    <link rel="stylesheet" href="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/css/plugins/file.css">
    <link rel="stylesheet" href="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/css/plugins/fullscreen.css">
    <link rel="stylesheet" href="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/css/plugins/image.css">
    <link rel="stylesheet" href="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/css/plugins/image_manager.css">
    <link rel="stylesheet" href="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/css/plugins/line_breaker.css">
    <link rel="stylesheet" href="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/css/plugins/quick_insert.css">
    <link rel="stylesheet" href="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/css/plugins/table.css">
    <link rel="stylesheet" href="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/css/plugins/video.css">
    <link rel="stylesheet" href="{{url('colorme-react/styles.css')}}?8128888">
@endsection

@section('content')
        <style>
                #nav-bar{
                        width: 100%;
                        text-align: center;
                        background-color: white;
                        height: 50px;
                        /* display: flex; */
                        justify-content: center;
                        position: fixed;
                        z-index: 99;
                        box-shadow: rgba(0, 0, 0, 0.39) 0px 10px 10px -12px;
                }
                .transform-text{
                        color: #000 !important;
                        height: 100%;
                        line-height: 50px;
                        display: inline-block;
                        margin: 0px 8px;
                        font-weight: 600;
                        opacity: 0.6;
                        font-size: 12px;
                }
        </style>
        <div class="navbar navbar-default" id="nav-bar">
                <div class="container-fluid">
                        <div style="position:absolute; left: 20px;">
                                <a class="routing-bar-item transform-text active" href="">Nổi bật</a>
                                <a class="routing-bar-item transform-text" href="">Mới nhất</a>
                        </div>
                </div>
                <div class="days">
                        <a href="" class="routing-bar-item transform-text">Hôm nay</a>
                        <a href="" class="routing-bar-item transform-text active">7 ngày qua</a>
                        <a href="" class="routing-bar-item transform-text">30 ngày qua</a>
                </div>
        </div>
        <div class="home-page-wrapper" style="padding-top: 70px;">
                <div>
                        <div class="left-panel-wrapper" id="left-panel-wrapper">
                                <div class="left-panel" id="left-panel-hi">
                                        <div class="hi-wrapper">
                                                <div class="hi">HI!</div>
                                        </div>
                                        <h5>Chào bạn!</h5>
                                        <div style="font-size: 12px; color: rgb(155, 155, 155);">
                                                <div>Bạn vẫn chưa đăng nhập</div>
                                                <div>Để sử dụng tối đa các chức năng</div>
                                                <div>Xin bạn vui lòng:</div>
                                        </div>
                                        <div>
                                                <a class="btn sign-in">Đăng nhập</a>
                                                <a class="btn sign-up">Tạo tài khoản</a>
                                        </div>
                                </div>
                                <div class="left-panel-lower" id="left-panel-courses">
                                        <h5 style="font-weight: 600;">ĐĂNG KÍ HỌC</h5>
                                        <div class="media">
                                                <div class="media-left">
                                                        <a href="/course/photoshop">
                                                                <img src="http://d1j8r0kxyu9tj8.cloudfront.net/images/1475072407tOyRFhAeFPjsbfu.jpg"
                                                                        class="media-object img-circle" style="width: 40px;">
                                                        </a>
                                                </div>
                                                <div class="media-body">
                                                        <div>
                                                                <a href="/course/photoshop" style="color: rgb(12, 12, 12); font-weight: 400;">Photoshop</a>
                                                        </div>
                                                        <div style="color: rgb(128, 128, 128);">
                                                                8 buổi
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
                <div class="product-list-wrapper">
                        @foreach($products as $product)
                        <div class="product-wrapper">
                                <div class="product-item">
                                        <div class="colorme-img">
                                                <div class="colorme-link" style="background-image: url({{ $product['url'] }});
                                                background-size: cover;
                                                background-position: center center;">
                                                </div>
                                        </div>
                                        <div class="product-info">
                                                <div style="font-size: 16px;
                                                border-bottom: 1px solid rgb(217, 217, 217);
                                                padding: 10px;
                                                display: flex;
                                                justify-content: space-between;">
                                                        <a href="/post/btvn-buoi-3-35311" style="color: rgb(85, 85, 85); font-size: 14px; font-weight: 600;">{{ $product['title'] }}</a>
                                                        <div>
                                                                <span data-html="true" data-toggle="tooltip" title="" data-original-title="Được đánh dấu nổi bật bởi<br/>Nguyen Mine Linh">
                                                                <span class="glyphicon glyphicon-circle-arrow-up" style="color: rgb(240, 173, 78); margin-right: 2px;"></span>
                                                        </span>
                                                        <a data-toggle="tooltip" title="" href="/group/thietkechuyensau13" data-original-title="Lớp Thiết kế chuyên sâu 1.3">
                                                                <span class="glyphicon glyphicon-circle-arrow-right" style="color: green;"></span>
                                                        </a>
                                                        </div>
                                                </div>
                                                <div class="media" style="font-size: 12px; margin-top: 10px; padding: 5px 10px;">
                                                        <div class="media-left" style="padding-right: 3px;">
                                                                <a href="/profile/flourishartist@gmail.com">
                                                                        <div style="background: url({{ $product['author']['avatar_url'] }}) center center / cover; width: 40px; height: 40px; margin-right: 5px; margin-top: -3px; border-radius: 3px;">
                                                                        </div>
                                                                </a>
                                                        </div>
                                                        <div class="media-body">
                                                                <a href="/profile/flourishartist@gmail.com">
                                                                        <div style="font-weight: 600;">
                                                                                Vũ Nam Anh
                                                                        </div>
                                                                        <div class="timestamp" style="font-size: 12px;">
                                                                                7 ngày trước
                                                                        </div>
                                                                </a>
                                                        </div>
                                                </div>
                                                <div style="border-bottom: 1px solid rgb(217, 217, 217); position: absolute; bottom: 40px; width: 100%;"></div>
                                                <div style="position: absolute; bottom: 5px;">
                                                        <div class="product-tool">
                                                                <span class="glyphicon glyphicon-eye-open">136</span>
                                                                <span class="glyphicon glyphicon-comment">0</span>
                                                                <span class="glyphicon glyphicon-heart"></span>
                                                                <span data-html="true" data-toggle="tooltip" title="" style="cursor: pointer;" data-original-title="Nguyen Mine Linh<br/>Ngọc Diệp<br/>Trần Đức Dũng">3</span>
                                                                <span></span>
                                                        </div>
                                                </div>
                                                <div style="position: absolute; bottom: 10px; right: 5px;">
                                                        <div data-toggle="tooltip" title="" style="cursor: pointer; width: 11px; height: 11px; border-radius: 10px; margin-right: 3px; display: inline-block;" data-original-title="#">

                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                        @endforeach
                        <div style="clear: both; width: 100%; text-align: center; padding-bottom: 30px;"><button type="button" class="btn btn-upload">Tải thêm</button></div>
                </div>
        </div>
@endsection

@push('scripts')

    <!-- Froala editor JS file. -->
    <script type="text/javascript"
            src="https://cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4/js/froala_editor.min.js"></script>

    <!-- Include Code Mirror. -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.3.0/codemirror.min.js"></script>
    <script type="text/javascript"
            src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.3.0/mode/xml/xml.min.js"></script>

    <!-- Include Plugins. -->
    <script type="text/javascript" src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/align.min.js"></script>
    <script type="text/javascript"
            src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/char_counter.min.js"></script>
    <script type="text/javascript"
            src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/code_beautifier.min.js"></script>
    <script type="text/javascript"
            src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/code_view.min.js"></script>
    <script type="text/javascript" src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/colors.min.js"></script>
    <script type="text/javascript"
            src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/emoticons.min.js"></script>
    <script type="text/javascript"
            src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/entities.min.js"></script>
    <script type="text/javascript" src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/file.min.js"></script>
    <script type="text/javascript"
            src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/font_family.min.js"></script>
    <script type="text/javascript"
            src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/font_size.min.js"></script>
    <script type="text/javascript"
            src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/fullscreen.min.js"></script>
    <script type="text/javascript" src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/image.min.js"></script>
    <script type="text/javascript"
            src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/image_manager.min.js"></script>
    <script type="text/javascript"
            src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/inline_style.min.js"></script>
    <script type="text/javascript"
            src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/line_breaker.min.js"></script>
    <script type="text/javascript" src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/link.min.js"></script>
    <script type="text/javascript" src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/lists.min.js"></script>
    <script type="text/javascript"
            src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/paragraph_format.min.js"></script>
    <script type="text/javascript"
            src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/paragraph_style.min.js"></script>
    <script type="text/javascript"
            src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/quick_insert.min.js"></script>
    <script type="text/javascript" src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/quote.min.js"></script>
    <script type="text/javascript" src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/table.min.js"></script>
    <script type="text/javascript" src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/save.min.js"></script>
    <script type="text/javascript" src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/url.min.js"></script>
    <script type="text/javascript" src="http://d1j8r0kxyu9tj8.cloudfront.net/libs/froala/js/plugins/video.min.js"></script>

    <script src="{{url('colorme-react/bundle.js')}}?8218888"></script>
@endpush