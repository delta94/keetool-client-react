@extends('nhatquangshop::layouts.master')
@section('content')
    <div class="container" style="padding-top:150px">
        <div class="row">
            <div class="col-md-4">
                <a href="/manage/orders" class="list-group-item border-0" style="color: #66615b">Đơn hàng có sẵn</a>
                <a href="/manage/account" class="list-group-item border-0" style="color: #66615b">Thông tin tài khoản</a>
                <a href="/manage/orders" class="list-group-item border-0" style="color: #66615b">Đơn hàng</a>
                <a href="/manage/transfermoney" class="list-group-item border-0" style="color: #66615b">Báo chuyển khoản</a>
            </div>
            <div class="col-md-8">
                @yield('data')
            </div>
        </div>
    </div>

@endsection
