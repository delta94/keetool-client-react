@extends('colorme_new.layouts.master') @section('content')
    <div style="margin-top: 50px">
        <div>
            <div data-reactroot="" style="height: 100%;">
                <div class="page-wrap">
                    <div>
                        <div style="padding-top: 60px; background: rgb(22, 22, 22); padding-bottom: 100px;">
                            <div class="container larger-container">
                                <div class="col-md-8 title-wrapper">
                                    <div class="pre-head"
                                         style="display: block; font-size: 14px; color: rgb(217, 217, 217);"><h1
                                                style="font-size: 40px; margin-top: 0px; color: rgb(255, 255, 255);">
                                            Bài viết</h1><span>Chia sẻ kiến thức về đồ họa</span></div>
                                </div>
                            </div>
                        </div>
                        <div class="container larger-container" style="margin-top: -50px;">
                            <div class="col-md-8 product-detail-content-wrapper">
                                <div class="product-detail-content"
                                     style="width: 100%; word-wrap: break-word; margin: 0px 0px 30px; padding: 50px 50px 60px; background: rgb(255, 255, 255); box-shadow: rgba(0, 0, 0, 0.08) 1px 1px 2px; min-height: 300px;">
                                    @if(isset($topBlogs))
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="blog-title">
                                                    {{$topBlogs['title']}}
                                                </div>
                                                <a href="/blog/{{$topBlogs['slug']}}" style="color:black">
                                                    <div style="color: rgb(137, 137, 137);">{{$topBlogs['time']}}
                                                        · {{$topBlogs['views']}} lượt xem
                                                    </div>
                                                </a>
                                                <a href="/profile/{{$topBlogs['author']['username']}}"
                                                   class="flex flex-row flex-row-center">
                                                    <div style="background: url({{$topBlogs['author']['avatar_url']}}) center center / cover; width: 20px; height: 20px; border-radius: 40px; "></div>

                                                    <div style="padding: 10px; color: rgb(68, 68, 68); font-size: 16px;">
                                                        {{$topBlogs['author']['name']}}
                                                    </div>

                                                </a>
                                            </div>
                                            <div class="col-md-12">
                                                <a href="/blog/{{$topBlogs['slug']}}">
                                                    <div class="relative">
                                                        <img class="zoom" src="{{$topBlogs['url']}}"
                                                             style="width: 100%;height:auto;"/>
                                                        @if($topBlogs['category_name'])
                                                            <div class="product-category absolute"
                                                                 style="text-align: center; bottom: 10px; right: 10px"><span
                                                                        style=" padding: 5px 10px; background-color: rgb(197, 0, 0); color: white; text-transform: uppercase; font-size: 10px; border-radius: 3px;">{{$blog['category_name']}}</span>
                                                            </div>
                                                        @endif
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                        <hr class="margin-hr">
                                    @endif
                                    @foreach($blogs as $blog)
                                        <div class="row">
                                            <div class="col-md-4">
                                                <a href="/blog/{{$blog['slug']}}">
                                                    <div class="relative">
                                                        <img class="zoom" src="{{$blog['url']}}"
                                                             style="width: 100%;height:auto;"/>
                                                        @if($blog['category_name'])
                                                            <div class="product-category absolute"
                                                                 style="text-align: center; bottom: 10px; right: 10px"><span
                                                                        style=" padding: 5px 10px; background-color: rgb(197, 0, 0); color: white; text-transform: uppercase; font-size: 10px; border-radius: 3px;">{{$blog['category_name']}}</span>
                                                            </div>
                                                        @endif
                                                    </div>

                                                </a>
                                            </div>
                                            <div class="col-md-8">
                                                <div class="blog-title">
                                                    {{$blog['title']}}
                                                </div>
                                                <a href="/blog/{{$blog['slug']}}" style="color:black">
                                                    <div style="color: rgb(137, 137, 137);">{{$blog['time']}}
                                                        · {{$blog['views']}} lượt xem
                                                    </div>
                                                </a>
                                                <a href="/profile/{{$blog['author']['username']}}"
                                                   class="flex flex-row flex-row-center">
                                                    <div style="background: url({{$blog['author']['avatar_url']}}) center center / cover; width: 20px; height: 20px; border-radius: 40px; "></div>

                                                    <div style="padding: 10px; color: rgb(68, 68, 68); font-size: 16px;">
                                                        {{$blog['author']['name']}}
                                                    </div>

                                                </a>


                                            </div>

                                        </div>
                                        <hr class="margin-hr">

                                    @endforeach
                                    <div id="pagination-blogs">
                                        <div class="pagination-area">
                                            <ul class="pagination pagination-primary">
                                                <li class="page-item">
                                                    <a href="/blogs?page=1&search={{$search}}&tag={{$tag}}"
                                                       class="page-link">
                                                        <i class="fa fa-angle-double-left" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li v-for="page in pages"
                                                    v-bind:class="'page-item ' + (page=={{$current_page}} ? 'active' : '')">
                                                    <a v-bind:href="'/blogs?page='+page+'&search={{$search}}&tag={{$tag}}'"
                                                       class="page-link">
                                                        @{{page}}
                                                    </a>
                                                </li>
                                                <li class="page-item">
                                                    <a href="/blogs?page={{$total_pages}}&search={{$search}}&tag={{$tag}}"
                                                       class="page-link">
                                                        <i class="fa fa-angle-double-right" aria-hidden="true">
                                                        </i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <br>
    <!--  -->
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

        var pagination = new Vue({
            el: '#pagination-blogs',
            data: {
                pages: []
            },
        });

        pagination.pages = paginator({{$current_page}},{{$total_pages}})
    </script>
@endpush