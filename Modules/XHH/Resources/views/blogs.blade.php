@extends('xhh::layouts.master')

@section('content')
    <div class="page-header page-header-xs"
         style="background-image: url('http://d1j8r0kxyu9tj8.cloudfront.net/files/15132416649MjXr1VTKC53cHy.png');">
        <div class="filter"></div>
        <div class="content-center">
            <div class="container">
                <br><br>
                <br><br>
                <div class="row">
                    <div class="col-md-8 offset-md-2 text-center">
                        <h1 class="title"><b>Blogs</b></h1>
                        <h5 class=description">Các bài viết chia sẻ kiến thức và thông tin</h5>
                        <br>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <div class="blog-4" style="margin-top:20px">
        <div class="container">
            <div class="description">
                <input placeholder="Tìm kiếm" id="search-blog"
                       style="width:100%; padding:20px; margin:15px 0 15px 0; border:none; font-size:15px"
                       type="text" v-on:keyup.enter="searchBlog" v-model="search" value="{{$search}}"/>
            </div>
            <div class="row">
                @foreach($blogs as $blog)
                    <div class="col-md-4">
                        <div class="card card-plain card-blog">
                            <div class="card-image">
                                <a href="{{'/blog/post/'.$blog->id}}">
                                    <div
                                            style="width: 100%;
                                                    border-radius: 15px;
                                                    background: url({{generate_protocol_url($blog->url)}});
                                                    background-size: cover;
                                                    background-position: center;
                                                    padding-bottom: 70%;"

                                    ></div>
                                </a>
                            </div>

                            <div class="card-block">
                                @if($blog->category)
                                    <span class="label label-danger">{{$blog->category->name}}</span>
                                @endif
                                <h3 class="card-title">
                                    <a href="{{'/blog/post/'.$blog->id}}">{{$blog->title}}</a>
                                </h3>
                                <p class="card-description">
                                    {{shortString($blog->description, 15)}}
                                </p>
                                <br>
                                <a href="{{'/blog/post/'.$blog->id}}" style="color:#c50000!important"><b>Xem
                                        thêm</b></a>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            <hr>
            <div class="row">
                <div class="col-md-2 offset-md-10">
                    <div class="pull-right">
                        {{--<button class="btn btn-link btn-default btn-move-right">Bài viết cũ hơn<i class="fa fa-angle-right"></i></button>--}}
                        <a class="btn btn-link btn-default btn-move-right" href="{{'/blog?page='.$page_id}}"
                           style="{{$display}}"> Bài viết cũ hơn </a>
                    </div>
                </div>
            </div>
            <br>
            <br>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        var search = new Vue({
            el: '#search-blog',
            data: {
                search: '{!! $search !!}'
            },
            methods: {
                searchBlog: function () {
                    window.open('/blog?page=1&search=' + this.search, '_self');
                }
            }

        })
    </script>
@endpush