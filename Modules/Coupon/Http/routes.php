<?php

Route::group(['domain' => 'manageapi.' . config('app.domain'), 'prefix' => 'coupon', 'namespace' => 'Modules\Coupon\Http\Controllers'], function()
{
    Route::post('/create', 'CouponController@createCoupon');
    Route::delete('/{couponId}/delete', 'CouponController@deleteCoupon');
    Route::get('/all', 'CouponController@allCoupons');
});
