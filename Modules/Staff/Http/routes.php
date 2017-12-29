<?php

Route::group(['domain' => 'manageapi.' . config('app.domain'), 'prefix' => 'staff', 'namespace' => 'Modules\Staff\Http\Controllers'], function () {
    Route::post('/', 'StaffApiController@createStaff');
    Route::get("/", "StaffApiController@getStaffs");
    Route::post('/{staffId}/{workId}','StaffApiController@changeStatusInWork');
});
