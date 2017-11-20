@extends('alibaba::layouts.master')

@section('content')
    <div class="cd-section section-white" id="contact-us">
        <div class="contactus-1 section-image"
             style="background-image: url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?dpr=1&amp;auto=format&amp;fit=crop&amp;w=1500&amp;h=996&amp;q=80&amp;cs=tinysrgb&amp;crop=')">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="card card-contact no-transition">
                            <h3 class="card-title text-center" style="padding-bottom: 30px">Bạn đã đăng kí thành công lớp {{$class->name}}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


@endsection