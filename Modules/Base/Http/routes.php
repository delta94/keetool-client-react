<?php

Route::group(['domain' => 'manageapi.' . config('app.domain'), 'prefix' => '/v2/base', 'namespace' => 'Modules\Base\Http\Controllers'], function () {
    Route::get('/provinces', 'ManageBaseApiController@provinces');
    Route::get('/province/{provinceId}', 'ManageBaseApiController@basesInProvince');

    Route::get('/', 'ManageBaseApiController@getBases');
    Route::post('/', 'ManageBaseApiController@createBase');
    Route::put('/{baseId}', 'ManageBaseApiController@editBase');

    Route::post('/{baseId}/room', 'ManageBaseApiController@createRoom');
    Route::put('/{baseId}/room/{roomId}', 'ManageBaseApiController@editRoom');
});

Route::group(['domain' => 'manageapi.' . config('app.domain'), 'prefix' => '/v2/room', 'namespace' => 'Modules\Base\Http\Controllers'], function () {
    Route::post('/{roomId}/seat', 'ManageBaseApiController@createSeat');
    Route::put('/{roomId}/seat/{seatId}', 'ManageBaseApiController@editSeat');
});

Route::group(['domain' => 'api.' . config('app.domain'), 'prefix' => '/v2', 'namespace' => 'Modules\Base\Http\Controllers'], function () {
    Route::get('/base/{baseId}/room', 'ManageBasePublicApiController@baseRooms');
});