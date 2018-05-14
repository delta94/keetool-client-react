@extends('trongdongpalace::layouts.master')

@section('content')
    <div id="gdlr-header-substitute"></div>
    <!-- is search -->
    <div class="gdlr-page-title-wrapper">
        <div class="gdlr-page-title-overlay"></div>
        <div class="gdlr-page-title-container container">
            <h1 class="gdlr-page-title">Cập nhật tin tức mới nhất</h1>
            <span class="gdlr-page-caption">Trống Đồng</span>
        </div>
    </div>
    <div class="content-wrapper">
        <div class="gdlr-content">

            <!-- Above Sidebar Section-->

            <!-- Sidebar With Content Section-->
            <div class="with-sidebar-wrapper">
                <div class="with-sidebar-container container">
                    <div class="with-sidebar-left eight columns">
                        <div class="with-sidebar-content twelve columns">
                            <section id="content-section-1">
                                <div class="section-container container">

                                    <div class="blog-item-wrapper">
                                        <div class="blog-item-holder">
                                            @foreach($blogs as $blog)
                                                <div class="gdlr-item gdlr-blog-full">
                                                    <div class="gdlr-ux gdlr-blog-full-ux">
                                                        <article id="post-859"
                                                                 class="post-859 post type-post status-publish format-standard has-post-thumbnail hentry category-blog category-fit-row">
                                                            <div class="gdlr-standard-style">
                                                                <div class="gdlr-blog-thumbnail">
                                                                    <a href="/blog/{{$blog['slug']}}">
                                                                        <img src="{{generate_protocol_url($blog['url'])}}"
                                                                             alt="" width="750" height="330"></a>
                                                                    @if($blog['category_name'])
                                                                        <div class="gdlr-sticky-banner"><i
                                                                                    class="fa fa-bullhorn"></i>{{$blog['category_name']}}
                                                                        </div>
                                                                    @endif
                                                                </div>


                                                                <div class="blog-date-wrapper gdlr-title-font">
                                                                    <span class="blog-date-day">{{date('d',strtotime($blog['created_at']))}}</span>
                                                                    <span class="blog-date-month">{{date('m',strtotime($blog['created_at']))}}</span>
                                                                </div>

                                                                <div class="blog-content-wrapper">
                                                                    <header class="post-header">
                                                                        <h3 class="gdlr-blog-title"><a
                                                                                    href="http://demo.goodlayers.com/hotelmaster/dark/sedial-eiusmod-tempor/">{{$blog['title']}}</a>
                                                                        </h3>

                                                                        <div class="clear"></div>
                                                                    </header><!-- entry-header -->

                                                                    <div class="gdlr-blog-content">{{$blog['description']}}
                                                                        <div class="clear"></div>
                                                                        <a href="/blog/{{$blog['slug']}}"
                                                                           class="excerpt-read-more">Đọc tiếp<i
                                                                                    class="fa fa-long-arrow-right icon-long-arrow-right"></i></a>
                                                                    </div>
                                                                </div> <!-- blog content wrapper -->
                                                            </div>
                                                        </article>
                                                    </div>
                                                </div>
                                            @endforeach
                                            <div class="gdlr-item gdlr-blog-full">
                                                <div class="gdlr-ux gdlr-blog-full-ux"
                                                     style="opacity: 1; padding-top: 0px; margin-bottom: 0px;">

                                                </div>
                                            </div>
                                        </div>
                                        <div id="pagination-blogs">
                                            <div class="pagination-area">
                                                <ul class="pagination pagination-primary">
                                                    <li class="page-item">
                                                        <a href="/{{$link}}?page=1&search={{$search}}&tag={{$tag}}"
                                                           class="page-link">
                                                            <i class="fa fa-angle-double-left" aria-hidden="true"></i>
                                                        </a>
                                                    </li>
                                                    <li v-for="page in pages"
                                                        v-bind:class="'page-item ' + (page=={{$current_page}} ? 'active' : '')">
                                                        <a v-bind:href="'/{{$link}}?page='+page+'&search={{$search}}&tag={{$tag}}'"
                                                           class="page-link">
                                                            @{{page}}
                                                        </a>
                                                    </li>
                                                    <li class="page-item">
                                                        <a href="/{{$link}}?page={{$total_pages}}&search={{$search}}&tag={{$tag}}"
                                                           class="page-link">
                                                            <i class="fa fa-angle-double-right" aria-hidden="true">
                                                            </i>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="gdlr-pagination">
                                            <a class="next page-numbers"
                                               href="/{{$link}}?page=1&search={{$search}}&tag={{$tag}}">Đầu
                                            </a>
                                            <a v-for="page in pages"
                                               v-bind:class="'page-numbers ' + (page=={{$current_page}} ? 'current' : '')"
                                               v-bind:href="'/{{$link}}?page='+page+'&search={{$search}}&tag={{$tag}}'"
                                            >
                                                @{{page}}
                                            </a>
                                            <a class="next page-numbers"
                                               href="/{{$link}}?page={{$total_pages}}&search={{$search}}&tag={{$tag}}">Cuối
                                            </a>
                                        </div>
                                    </div>

                                    <div class="clear"></div>
                                </div>
                            </section>
                        </div>

                        <div class="clear"></div>
                    </div>

                    <div class="gdlr-sidebar gdlr-right-sidebar four columns">
                        <div class="gdlr-item-start-content sidebar-right-item">


                            <div id="text-2" class="widget widget_text gdlr-item gdlr-widget"><h3
                                        class="gdlr-widget-title">TRỐNG ĐỒNG</h3>
                                <div class="clear"></div>
                                <div class="textwidget">Chúng tôi cung cấp cho bạn các thông tin, xu hướng mới nhất về
                                    lĩnh vực sự kiện/tiệc cưới.
                                </div>
                            </div>
                            <div id="gdlr-recent-portfolio-widget-2"
                                 class="widget widget_gdlr-recent-portfolio-widget gdlr-item gdlr-widget"><h3
                                        class="gdlr-widget-title">Bài viết mới nhất</h3>
                                <div class="clear"></div>
                                <div class="gdlr-recent-port-widget">
                                    <div class="recent-post-widget">
                                        <div class="recent-post-widget-thumbnail"><a
                                                    href="http://demo.goodlayers.com/hotelmaster/dark/portfolio/thumbnail-open-lightbox/"><img
                                                        src="http://demo.goodlayers.com/hotelmaster/dark/wp-content/uploads/2013/12/140H-150x150.jpg"
                                                        alt="" width="150" height="150"></a></div>
                                        <div class="recent-post-widget-content">
                                            <div class="recent-post-widget-title"><a
                                                        href="http://demo.goodlayers.com/hotelmaster/dark/portfolio/thumbnail-open-lightbox/">Thumbnail
                                                    open lightbox</a></div>
                                            <div class="recent-post-widget-info">
                                                <div class="blog-info blog-date"><i class="fa fa-clock-o"></i><a
                                                            href="http://demo.goodlayers.com/hotelmaster/dark/2013/12/04/">04
                                                        Dec 2013</a></div>
                                                <div class="clear"></div>
                                            </div>
                                        </div>
                                        <div class="clear"></div>
                                    </div>
                                    <div class="recent-post-widget">
                                        <div class="recent-post-widget-thumbnail"><a
                                                    href="http://demo.goodlayers.com/hotelmaster/dark/portfolio/thumbnail-open-lightbox-2/"><img
                                                        src="http://demo.goodlayers.com/hotelmaster/dark/wp-content/uploads/2013/12/156H-150x150.jpg"
                                                        alt="" width="150" height="150"></a></div>
                                        <div class="recent-post-widget-content">
                                            <div class="recent-post-widget-title"><a
                                                        href="http://demo.goodlayers.com/hotelmaster/dark/portfolio/thumbnail-open-lightbox-2/">Thumbnail
                                                    link to post</a></div>
                                            <div class="recent-post-widget-info">
                                                <div class="blog-info blog-date"><i class="fa fa-clock-o"></i><a
                                                            href="http://demo.goodlayers.com/hotelmaster/dark/2013/12/04/">04
                                                        Dec 2013</a></div>
                                                <div class="clear"></div>
                                            </div>
                                        </div>
                                        <div class="clear"></div>
                                    </div>
                                    <div class="recent-post-widget">
                                        <div class="recent-post-widget-thumbnail"><a
                                                    href="http://demo.goodlayers.com/hotelmaster/dark/portfolio/thumbnail-open-video-lightbox/"><img
                                                        src="http://demo.goodlayers.com/hotelmaster/dark/wp-content/uploads/2013/12/157H-150x150.jpg"
                                                        alt="" width="150" height="150" style="opacity: 1;"></a></div>
                                        <div class="recent-post-widget-content">
                                            <div class="recent-post-widget-title"><a
                                                        href="http://demo.goodlayers.com/hotelmaster/dark/portfolio/thumbnail-open-video-lightbox/">Open
                                                    video lightbox</a></div>
                                            <div class="recent-post-widget-info">
                                                <div class="blog-info blog-date"><i class="fa fa-clock-o"></i><a
                                                            href="http://demo.goodlayers.com/hotelmaster/dark/2013/12/04/">04
                                                        Dec 2013</a></div>
                                                <div class="clear"></div>
                                            </div>
                                        </div>
                                        <div class="clear"></div>
                                    </div>
                                    <div class="clear"></div>
                                </div>
                            </div>
                            <div id="gdlr-recent-portfolio-widget-3"
                                 class="widget widget_gdlr-recent-portfolio-widget gdlr-item gdlr-widget"><h3
                                        class="gdlr-widget-title">Bài viết nổi bật</h3>
                                <div class="clear"></div>
                                <div class="gdlr-recent-port-widget">
                                    <div class="recent-post-widget">
                                        <div class="recent-post-widget-thumbnail"><a
                                                    href="http://demo.goodlayers.com/hotelmaster/dark/portfolio/thumbnail-open-lightbox/"><img
                                                        src="http://demo.goodlayers.com/hotelmaster/dark/wp-content/uploads/2013/12/140H-150x150.jpg"
                                                        alt="" width="150" height="150"></a></div>
                                        <div class="recent-post-widget-content">
                                            <div class="recent-post-widget-title"><a
                                                        href="http://demo.goodlayers.com/hotelmaster/dark/portfolio/thumbnail-open-lightbox/">Thumbnail
                                                    open lightbox</a></div>
                                            <div class="recent-post-widget-info">
                                                <div class="blog-info blog-date"><i class="fa fa-clock-o"></i><a
                                                            href="http://demo.goodlayers.com/hotelmaster/dark/2013/12/04/">04
                                                        Dec 2013</a></div>
                                                <div class="clear"></div>
                                            </div>
                                        </div>
                                        <div class="clear"></div>
                                    </div>
                                    <div class="recent-post-widget">
                                        <div class="recent-post-widget-thumbnail"><a
                                                    href="http://demo.goodlayers.com/hotelmaster/dark/portfolio/thumbnail-open-lightbox-2/"><img
                                                        src="http://demo.goodlayers.com/hotelmaster/dark/wp-content/uploads/2013/12/156H-150x150.jpg"
                                                        alt="" width="150" height="150"></a></div>
                                        <div class="recent-post-widget-content">
                                            <div class="recent-post-widget-title"><a
                                                        href="http://demo.goodlayers.com/hotelmaster/dark/portfolio/thumbnail-open-lightbox-2/">Thumbnail
                                                    link to post</a></div>
                                            <div class="recent-post-widget-info">
                                                <div class="blog-info blog-date"><i class="fa fa-clock-o"></i><a
                                                            href="http://demo.goodlayers.com/hotelmaster/dark/2013/12/04/">04
                                                        Dec 2013</a></div>
                                                <div class="clear"></div>
                                            </div>
                                        </div>
                                        <div class="clear"></div>
                                    </div>
                                    <div class="recent-post-widget">
                                        <div class="recent-post-widget-thumbnail"><a
                                                    href="http://demo.goodlayers.com/hotelmaster/dark/portfolio/thumbnail-open-video-lightbox/"><img
                                                        src="http://demo.goodlayers.com/hotelmaster/dark/wp-content/uploads/2013/12/157H-150x150.jpg"
                                                        alt="" width="150" height="150" style="opacity: 1;"></a></div>
                                        <div class="recent-post-widget-content">
                                            <div class="recent-post-widget-title"><a
                                                        href="http://demo.goodlayers.com/hotelmaster/dark/portfolio/thumbnail-open-video-lightbox/">Open
                                                    video lightbox</a></div>
                                            <div class="recent-post-widget-info">
                                                <div class="blog-info blog-date"><i class="fa fa-clock-o"></i><a
                                                            href="http://demo.goodlayers.com/hotelmaster/dark/2013/12/04/">04
                                                        Dec 2013</a></div>
                                                <div class="clear"></div>
                                            </div>
                                        </div>
                                        <div class="clear"></div>
                                    </div>
                                    <div class="clear"></div>
                                </div>
                            </div>
                            <div id="tag_cloud-2" class="widget widget_tag_cloud gdlr-item gdlr-widget"><h3
                                        class="gdlr-widget-title">Tag Cloud</h3>
                                <div class="clear"></div>
                                <div class="tagcloud"><a href="http://demo.goodlayers.com/hotelmaster/dark/tag/animal/"
                                                         class="tag-cloud-link tag-link-11 tag-link-position-1"
                                                         style="font-size: 8pt;" aria-label="Animal (1 item)">Animal</a>
                                    <a href="http://demo.goodlayers.com/hotelmaster/dark/tag/aside/"
                                       class="tag-cloud-link tag-link-12 tag-link-position-2" style="font-size: 8pt;"
                                       aria-label="Aside (1 item)">Aside</a>
                                    <a href="http://demo.goodlayers.com/hotelmaster/dark/tag/audio/"
                                       class="tag-cloud-link tag-link-13 tag-link-position-3"
                                       style="font-size: 11.230769230769pt;" aria-label="Audio (2 items)">Audio</a>
                                    <a href="http://demo.goodlayers.com/hotelmaster/dark/tag/blog/"
                                       class="tag-cloud-link tag-link-14 tag-link-position-4"
                                       style="font-size: 19.666666666667pt;" aria-label="Blog (8 items)">Blog</a>
                                    <a href="http://demo.goodlayers.com/hotelmaster/dark/tag/business/"
                                       class="tag-cloud-link tag-link-15 tag-link-position-5"
                                       style="font-size: 15.179487179487pt;"
                                       aria-label="Business (4 items)">Business</a>
                                    <a href="http://demo.goodlayers.com/hotelmaster/dark/tag/gallery-thumbnail/"
                                       class="tag-cloud-link tag-link-16 tag-link-position-6" style="font-size: 8pt;"
                                       aria-label="Gallery Thumbnail (1 item)">Gallery Thumbnail</a>
                                    <a href="http://demo.goodlayers.com/hotelmaster/dark/tag/identity-2/"
                                       class="tag-cloud-link tag-link-17 tag-link-position-7"
                                       style="font-size: 13.384615384615pt;"
                                       aria-label="identity (3 items)">identity</a>
                                    <a href="http://demo.goodlayers.com/hotelmaster/dark/tag/life-style/"
                                       class="tag-cloud-link tag-link-18 tag-link-position-8" style="font-size: 22pt;"
                                       aria-label="Life Style (11 items)">Life Style</a>
                                    <a href="http://demo.goodlayers.com/hotelmaster/dark/tag/link/"
                                       class="tag-cloud-link tag-link-19 tag-link-position-9"
                                       style="font-size: 11.230769230769pt;" aria-label="Link (2 items)">Link</a>
                                    <a href="http://demo.goodlayers.com/hotelmaster/dark/tag/news/"
                                       class="tag-cloud-link tag-link-20 tag-link-position-10"
                                       style="font-size: 16.615384615385pt;" aria-label="News (5 items)">News</a>
                                    <a href="http://demo.goodlayers.com/hotelmaster/dark/tag/post-format/"
                                       class="tag-cloud-link tag-link-21 tag-link-position-11"
                                       style="font-size: 15.179487179487pt;" aria-label="Post format (4 items)">Post
                                        format</a>
                                    <a href="http://demo.goodlayers.com/hotelmaster/dark/tag/quote/"
                                       class="tag-cloud-link tag-link-22 tag-link-position-12" style="font-size: 8pt;"
                                       aria-label="Quote (1 item)">Quote</a>
                                    <a href="http://demo.goodlayers.com/hotelmaster/dark/tag/safari/"
                                       class="tag-cloud-link tag-link-23 tag-link-position-13" style="font-size: 8pt;"
                                       aria-label="Safari (1 item)">Safari</a>
                                    <a href="http://demo.goodlayers.com/hotelmaster/dark/tag/travel/"
                                       class="tag-cloud-link tag-link-24 tag-link-position-14" style="font-size: 8pt;"
                                       aria-label="Travel (1 item)">Travel</a>
                                    <a href="http://demo.goodlayers.com/hotelmaster/dark/tag/video/"
                                       class="tag-cloud-link tag-link-25 tag-link-position-15" style="font-size: 8pt;"
                                       aria-label="Video (1 item)">Video</a></div>
                            </div>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>


            <!-- Below Sidebar Section-->


        </div><!-- gdlr-content -->
        <div class="clear"></div>
    </div>
@endsection

@push('scripts')
    <script>
                {{--var search = new Vue({--}}
                {{--el: '#search-blog',--}}
                {{--data: {--}}
                {{--search: '{!! $search !!}'--}}
                {{--},--}}
                {{--methods: {--}}
                {{--searchBlog: function () {--}}
                {{--window.open('/blogs?page=1&search=' + this.search, '_self');--}}
                {{--}--}}
                {{--}--}}

                {{--})--}}

        var pagination = new Vue({
                el: '#pagination-blogs',
                data: {
                    pages: []
                },
            });

        pagination.pages = paginator({{$current_page}},{{$total_pages}})
    </script>
@endpush