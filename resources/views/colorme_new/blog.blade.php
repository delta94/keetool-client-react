@extends('colorme_new.layouts.master') @section('content')


<div style="margin-top: 50px;">
    <div id="app">
        <div data-reactroot="" style="height: 100%;">
            <div class="page-wrap">
                <div>
                    <div class="container product-detail-container">
                        <a href="/profile/{{$blog['author']['email']}}">
                            <div style="background: url({{$blog['author']['avatar_url']}}) center center / cover; width: 80px; height: 80px; border-radius: 40px; margin: auto;"></div>
                            <div style="text-align: center; padding: 15px 0px; color: rgb(68, 68, 68); font-size: 16px;">{{$blog['author']['name']}}</div>
                        </a>
                        <div class="product-category" style="text-align: center;">
                            <span style="padding: 5px 10px; background-color: rgb(197, 0, 0); color: white; text-transform: uppercase; font-size: 10px; border-radius: 3px;">Inspiration</span>
                        </div>
                        <div style="text-align: center; font-size: 36px; padding: 25px; font-weight: 600;">{{$blog['title']}}</div>
                        <div style="text-align: center; padding-bottom: 25px; color: rgb(137, 137, 137);">{{$blog['description']}}</div>
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div class="product-tool">
                                <span class="glyphicon glyphicon-eye-open"></span>
                                <span>{{$blog['views']}}</span>
                                <span class="glyphicon glyphicon-comment"></span>
                                <span>{{$blog['comments_count']}}</span>
                            </div>
                        </div>
                        <div style="text-align: center;">
                            <div data-placement="bottom" data-toggle="tooltip" title="" style="cursor: pointer; width: 15px; height: 15px; border-radius: 10px; margin-right: 10px; display: inline-block;"
                                data-original-title="#"></div>
                        </div>
                        <div class="image-wrapper">
                            <img id="colorme-image" src="{{$blog['url']}}" style="width: 100%;">
                        </div>
                        <div class="product-content">
                            {!!$blog['content']!!}
                        </div>
                        <div class="article-footer">
                            <div class="container">
                                <div class="row">

                                    <div class="col-md-10">
                                    
                                    </div>
                                    <div class="col-md-2">

                                        <div class="sharing">
                                            <div class="fb-share-button fb_iframe_widget" data-href="{{config('app.protocol').config('app.domain').'/blog/'.$blog['slug']}}"
                                                data-layout="button" data-size="large" data-mobile-iframe="true" fb-xfbml-state="rendered"
                                                fb-iframe-plugin-query="app_id=1700581200251148&amp;container_width=49&amp;layout=button&amp;locale=vi_VN&amp;mobile_iframe=true&amp;sdk=joey&amp;size=large">
                                                <span style="vertical-align: bottom; width: 83px; height: 28px;">
                                                    <iframe name="f2b7ac78cc2a6a" width="1000px" height="1000px" frameborder="0"
                                                        allowtransparency="true" allowfullscreen="true" scrolling="no" title="fb:share_button Facebook Social Plugin"
                                                        src="https://www.facebook.com/v2.10/plugins/share_button.php?app_id=1700581200251148&amp;container_width=49&amp;href={{config('app.protocol').config('app.domain').'/blog/'.$blog['slug']}} &amp;layout=button&amp;locale=vi_VN&amp;mobile_iframe=true&amp;sdk=joey&amp;size=large"
                                                        style="border: none; visibility: visible; width: 83px; height: 28px;"
                                                        class=""></iframe>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="width: 130%; margin-left: -15%; margin-top: 40px;">
                            <div style="margin-top: 20px;">
                                <a href="/profile/{{$blog['author']['email']}}" class="more-products">
                                    <h5>
                                        <!-- react-text: 83 -->Bài viết khác từ
                                        <!-- /react-text -->
                                        <!-- react-text: 84 -->{{$blog['author']['name']}}
                                        <!-- /react-text -->
                                    </h5>
                                </a>
                                <div class="more-products-container">
                                    @foreach($related_blogs as $related_blog)
                                    <a class="more-products-item" style="background-image: url({{$related_blog->url}})"
                                        href="/blog/{{$related_blog->slug}}"></a>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <noscript></noscript>
            <noscript></noscript>
        </div>
    </div>
</div>
@endsection