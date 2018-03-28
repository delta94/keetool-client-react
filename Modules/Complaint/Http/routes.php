<?php

$routes = function () {
    Route::group(['prefix' => 'complaint'], function () {
        Route::post('/', 'ManageComplaintApiController@createComplaint');
        Route::get('/abc/{id}','ManageComplaintApiController@getComplain');
    });
};

Route::group(['domain' => config('app.domain'), 'prefix' => 'manageapi/v3', 'namespace' => 'Modules\Complaint\Http\Controllers'], $routes);