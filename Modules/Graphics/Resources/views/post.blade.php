@extends('graphics::layouts.master')


@section('content')
    <div class="wrapper">
        <div class="main">
            <div class="section section-white">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 offset-md-3 text-center title">
                            <h2>{{$post->title}}</h2>
                            <h3 class="title-uppercase">
                                <small>{{$post->author->name}}</small>
                            </h3>
                        </div>
                    </div>
                    <div class="article">
                        <div class="row">
                            <div class="col-md-10 offset-md-1">
                                <div class="text-center">
                                    @if($post->category)
                                        <span class="label label-warning main-tag"
                                              style="background: #c50000">{{$post->category->name}}</span>
                                    @endif
                                    <h3 class="title">{{$post->description}}</h3>
                                    <h6 class="title-uppercase">{{format_date($post->created_at)}}</h6>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-8 offset-md-2">
                                <img class="card" data-radius="none" width="100%" style="min-height: 0px" src={{$post->url}}  />
                                <p class="image-thumb text-center">{{$post->title}}</p>
                                <div class="article-content">
                                    {!!$post->content !!}
                                </div>
                                <div class="article-footer">
                                    <div class="container">
                                        <div class="row">

                                            <div class="col-md-10">
                                                @if($post->tags)
                                                    <h5>Tags:</h5>
                                                    @foreach(explode(",",$post->tags) as $tag )
                                                        <span class="label label-default">{{$tag}}</span>
                                                    @endforeach
                                                @endif
                                            </div>

                                            {{--<div class="col-md-2">--}}
                                                {{--<div class="sharing">--}}
                                                    {{--<div class="fb-share-button fb_iframe_widget"--}}
                                                         {{--data-href="{{config('app.protocol').config('app.domain').'/blog/post/'.$post->id}}"--}}
                                                         {{--data-layout="button" data-size="large" data-mobile-iframe="true">--}}
                                                        {{--<a class="fb-xfbml-parse-ignore" target="_blank"--}}
                                                           {{--href="https://www.facebook.com/sharer/sharer.php?u={{config('app.protocol').config('app.domain').'/blog/post/'.$post->id}}&amp;src=sdkpreparse">--}}
                                                            {{--Chia sẻ--}}
                                                        {{--</a>--}}
                                                    {{--</div>--}}
                                                {{--</div>--}}
                                            {{--</div>--}}
                                            <div class="col-md-2">
                                                <div class="sharing">
                                                    <div class="fb-share-button fb_iframe_widget" data-href="{{config('app.protocol').config('app.domain').'/blog/post/'.$post->id}}" data-layout="button" data-size="large" data-mobile-iframe="true" fb-xfbml-state="rendered" fb-iframe-plugin-query="app_id=1700581200251148&amp;container_width=49&amp;href=https%3A%2F%2Fkeetool.com%2Fblog%2Fpost%2F6&amp;layout=button&amp;locale=vi_VN&amp;mobile_iframe=true&amp;sdk=joey&amp;size=large"><span style="vertical-align: bottom; width: 83px; height: 28px;"><iframe name="f2b7ac78cc2a6a" width="1000px" height="1000px" frameborder="0" allowtransparency="true" allowfullscreen="true" scrolling="no" title="fb:share_button Facebook Social Plugin" src="https://www.facebook.com/v2.10/plugins/share_button.php?app_id=1700581200251148&amp;channel=https%3A%2F%2Fstaticxx.facebook.com%2Fconnect%2Fxd_arbiter%2Fr%2F18W0fzbK7xg.js%3Fversion%3D42%23cb%3Df34ddea62510148%26domain%3Dkeetool.com%26origin%3Dhttps%253A%252F%252Fkeetool.com%252Ff2c47d3e11aa8ec%26relation%3Dparent.parent&amp;container_width=49&amp;href={{config('app.protocol').config('app.domain').'/blog/post/'.$post->id}} &amp;layout=button&amp;locale=vi_VN&amp;mobile_iframe=true&amp;sdk=joey&amp;size=large" style="border: none; visibility: visible; width: 83px; height: 28px;" class=""></iframe></span></div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <hr>

                                <div class="row">
                                    <div class="media" style="border-bottom: none">
                                        <a class="pull-left" href="#paper-kit">
                                            <div class="avatar big-avatar">
                                                <img class="media-object" alt="64x64"
                                                     src={{$post->author->avatar_url}}>
                                            </div>
                                        </a>
                                        <div class="media-body">
                                            <h4 class="media-heading">{{$post->author->name}}</h4>
                                            <div class="pull-right">
                                                <!--<a href="#paper-kit" class="btn btn-default btn-round "> <i class="fa fa-reply"></i> Follow</a>-->
                                            </div>
                                            <p>{{$post->author->email}}</p>
                                            <p>{{$post->author->description}}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="comments media-area">
                                    <div class="fb-comments"
                                         data-href="{{config('app.protocol').config('app.domain').'/blog/post/'.$post->id}}"
                                         data-width="100%" data-numposts="5">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="related-articles">
                        <h3 class="title">Bài viết liên quan</h3>
                        <legend></legend>
                        <div class="row">
                            @foreach($posts_related as $post_related)
                                <div class="col-md-4">
                                    <a href={{'/blog/post/'.$post_related->id}}>
                                        <div
                                                style="width: 100%;
                                                        border-radius: 15px;
                                                        background: url({{$post_related->url}});
                                                        background-size: cover;
                                                        background-position: center;
                                                        height: 250px;"

                                        ></div>
                                    </a>
                                    <p class="blog-title">{{$post_related->title}}</p>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>


@endsection