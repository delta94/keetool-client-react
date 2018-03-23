@extends('elight::layouts.master')

@section('content')
    <style>

        html, body {
            overflow-x: hidden;
        }

        .error {
            color: red;
        }

        a {
            word-wrap: break-word;
        }

        code {
            font-size: 0.8em;
        }

        #player2-container .mejs__time-buffering, #player2-container .mejs__time-current, #player2-container .mejs__time-handle,
        #player2-container .mejs__time-loaded, #player2-container .mejs__time-hovered, #player2-container .mejs__time-marker, #player2-container .mejs__time-total {
            height: 2px;
        }

        #player2-container .mejs__time-total {
            margin-top: 9px;
        }

        #player2-container .mejs__time-handle {
            left: -5px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #ffffff;
            top: -5px;
            cursor: pointer;
            display: block;
            position: absolute;
            z-index: 2;
            border: none;
        }

        #player2-container .mejs__time-handle-content {
            top: 0;
            left: 0;
            width: 12px;
            height: 12px;
        }
    </style>
    <link rel="stylesheet" href="/mediaelementplayer/mediaelementplayer.css">
    <div class="container">
        <br><br><br><br>
        <div class="row">
                <div class="col-md-8">
                    <h1 style="font-size: 30px;font-weight:600; color:#424242;">{{$lesson->name}}</h1>
                    <p>{{$lesson->description}}</p>
                    <br>
                    <div id="lesson_image" style="width: 100%;
                            background: url({{$lesson->image_url}});
                            background-size: cover;
                            background-position: center;
                            padding-bottom: 70%;">
                    </div>
                    <div class="media-wrapper">
                        <audio id="player2" preload="none" controls style="max-width:100%;">
                            <source src="{{'https://api.soundcloud.com/tracks/'.$track_id.'/stream' . '?client_id='.config("app.sound_cloud_client_id")}}"
                                    type="audio/mp3">
                        </audio>
                    </div>
                    <br>
                    <div class="article-content">
                        {!! $lesson->detail_content !!}
                    </div>
                    <hr>
                    <h3 class="card-title text-center">Liên hệ với Elight</h3>

                        <div>
                                        <div role="form" id="contact-form" method="post" action="#">
                                            <input type="hidden" name="_token" value="{{ csrf_token() }}">
                                            <div class="card-block">
                                                <div class="form-group label-floating">
                                                    <label class="control-label">Họ và tên</label>
                                                    <input id="e-name" type="text" name="name" class="form-control" placeholder="Họ và tên người nhận">
                                                </div>
                                                <div class="form-group label-floating">
                                                    <label class="control-label">Email</label>
                                                    <input id ="e-email" type="email" name="email" class="form-control" placeholder="Email người nhận">
                                                </div>
                                                <div class="form-group label-floating">
                                                    <label class="control-label">Lời nhắn</label>
                                                    <textarea id="e-message" name="question" class="form-control" id="message" rows="6" placeholder="Nhập lời nhắn của bạn vào đây"></textarea>
                                                </div>
                                                <div class="row">
                                                    <div class="col-sm-12">
                                                        <div id="alert"> </div>
                                                    </div>
                                                </div>

                                                <div class="row">
                                                    <div class="col-md-6">
                                                    </div>
                                                    <div class="col-md-6">
                                                        <button type="submit" class="btn btn-primary pull-right" id="submit-1">Gửi tin nhắn
                                                        </button></div>
                                </div>
                            </div> 
                        </div>
                    </div>
                    <div class="comments media-area">
                        <div class="fb-comments"
                             data-href="{{config('app.protocol').config('app.domain').'/book/'.$course->id.'/'.$lesson->id}}"
                             data-width="100%" data-numposts="5">
                        </div>
                    </div>
                </div>
            <div class="col-md-4">
                    <div class="dropdown">
                        <input placeholder="Tìm kiếm" class="typeahead" data-provide="typeahead" id="search_lesson"
                               style="width:100%; padding:20px; margin:15px 0 15px 0; border:none; font-size:15px"
                               type="text"/>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="dropdown">
                                <button type="button" data-toggle="dropdown" class="btn btn-round dropdown-toggle btn-block"
                                        aria-expanded="false"
                                        style="background-color: #0275d8; color: white; border-color: #0275d8; text-align: center;">
                                        @if($term_id)
                                            {{\App\Term::find($term_id)->name}} : {{\App\Term::find($term_id)->description}}
                                        @else
                                            Bài học
                                        @endif
                                    <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu"
                                    style="background: white; box-shadow: rgba(0, 0, 0, 0.15) 0px 6px 10px -4px; border-radius: 5px !important; margin-top:6px">
                                    @foreach($terms as $term)
                                        <a  href="/book/{{$course->id}}/{{$term->id}}"
                                            class="dropdown-item"
                                            style="padding: 10px 15px !important; border-radius: 0px !important;text-align: center">
                                            {{$term->name}}
                                        </a>
                                    @endforeach
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        @foreach (\App\Term::find($term_id)->lessons as $less)
                            <div class="col-md-6">
                                <div style="margin-top:6px">
                                    @if($less->id == $lesson->id)
                                        <a href="/book/{{$course->id}}/{{$term->id}}/{{$less->id}}"
                                                class="btn btn-round btn-block"
                                                aria-expanded="false"
                                                style="background-color: #59b2ff; color: white; border-color: #59b2ff; text-align: center;">
                                            {{$less->name}}
                                        </a>
                                    @else
                                        <a href="/book/{{$course->id}}/{{$term_id}}/{{$less->id}}"
                                                 class="btn btn-round btn-block"
                                                aria-expanded="false"
                                                style="background-color: white; color: black; border-color: #59b2ff; text-align: center;">
                                            {{$less->name}}
                                        </a>
                                    @endif
                                </div>
                            </div>
                        @endforeach
                    </div>
            </div>
            <br><br>
        </div>
        <br><br><br>
    </div>

    <div id="modalInfo" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Đánh giá chất lượng</h4>
                </div>
                <div class="modal-header" id="modal-buy-body">
                    <a style="text-align: center">Bạn có cảm thấy các nội dung trên thư viện có hữu ích với bạn?</a>
                </div>
                <div class="modal-body">
                    <form action="" method="GET">
                        <div class="card-block">
                            <div class="form-group label-floating">
                                <label class="control-label">Đánh giá</label>
                                <!-- <div class="radio-inline">
                                    <input type="radio" id="cod" v-model="payment" value="Thanh toán trực tiếp khi nhận hàng(COD)" checked>
                                    <label for="cod">
                                        Rất tốt
                                    </label>
                                </div>
                                <div class="radio-inline">
                                    <input type="radio" id="transfer" v-model="payment" value="Chuyển khoản">
                                    <label for="transfer">
                                        OK
                                    </label> 
                                </div> -->
                                <br>
                                <label class="radio-inline">
                                    <input type="radio" name="optradio" value="Rất tốt"> Rất tốt
                                </label>
                                &nbsp
                                <label class="radio-inline">
                                    <input type="radio" name="optradio" value="OK"> OK
                                </label>
                                &nbsp
                                <label class="radio-inline">
                                    <input type="radio" name="optradio" value="Trung bình"> Trung bình
                                </label>
                                &nbsp
                                <label class="radio-inline">
                                    <input type="radio" name="optradio" value="Kém"> Kém
                                </label>
                            </div>
                            <div class="form-group label-floating">
                                <label class="control-label">Góp ý cho elight</label>
                                <input id="message" type="text" name="message" class="form-control"
                                    placeholder="Góp ý để elight cải thiện chất lượng nhé">
                            </div>
                            <div class="form-group label-floating">
                                <label class="control-label">Email</label>
                                <input id="email" type="text" name="email" class="form-control"
                                    placeholder="Để lại nếu bạn cần Elight hỗ trợ thêm">
                            </div>
                            <div class="row">
                                <div class="col-sm-12">
                                    <div id="alert"> </div>
                                </div>
                            </div>
                            <div class="pull-right">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Đóng</button>
                                <button id="submit" type="button" class="btn btn-primary" data-dismiss="modal" style="background-color:#138edc; border-color:#138edc ">Gửi</button>
                            </div>
                            <div class="clearfix"></div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>            
        window.onload = function (e) {
            setTimeout(function () {
                $('#modalInfo').modal('show');
            }, 60000); //60000
        };

        $(document).ready(function () {
        $("#submit").click(function (event) {
            event.preventDefault();
            event.stopPropagation();
            // console.log("submit");
            var message_str = $('#message').val();
            var email = $('#email').val();
            var radio = $('input[name=optradio]:checked').val()
            // console.log(radio);
            // console.log(name);
            var ok = 0;
            if (email.trim() == "" || message_str.trim() == "" || radio.trim() == "") ok = 1;

            if (!message_str || !email || !radio || ok == 1) {
                alert("Bạn vui lòng nhập đủ thông tin hoặc email không hợp lệ");
                $("#alert").html(
                    "<div class='alert alert-danger'>Bạn vui lòng nhập đủ thông tin và kiểm tra lại email</div>"
                );
            } else {
                var message = "Chúng tôi đã nhận được thông tin của bạn. Bạn vui lòng kiểm tra email";
                alert(message);
                $("#alert").html("<div class='alert alert-success'>" + message + "</div>");
                var url = "{{ url('book_information') }}";
                var data = {
                    message_str: message_str,
                    email: email,
                    radio: radio,
                    _token: "{{csrf_token()}}"
                };
                console.log(data);
                $.post(url, data, function (data, status) {
                        console.log("Data: " + data + "\nStatus: " + status);
                    })
                    .fail(function (error) {
                        console.log(error);
                    });
            }
        });
    });
    </script>
    <script type="text/javascript">
        $(document).ready(function () {
            // Defining the local dataset
            var data = {!! json_encode($lessons) !!};

            // Constructing the suggestion engine
            data = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('id', 'name'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: data
            });

            data.initialize();

            // Initializing the typeahead
            $('#search_lesson').typeahead({
                    hint: true,
                    highlight: true, /* Enable substring highlighting */
                    minLength: 1 /* Specify minimum characters required for showing result */
                },
                {
                    name: 'lessons',
                    display: function (item) {
                        //alert(item.country);
                        return item.name
                    },
                    source: data.ttAdapter(),

                })
            ;
            $('#search_lesson').on('typeahead:selected', function (e, datum) {
                window.open("/book/{{$course->id}}/" + datum.id, "_self");
            });
        });
    </script>
@endpush


