<?php

Route::group(['domain' => 'manageapi.' . config('app.domain'), 'prefix' => 'email', 'namespace' => 'Modules\Email\Http\Controllers'], function () {
    Route::get('/subscribers-list', 'ManageEmailApiController@subscribers_list');
    Route::delete('/subscribers-list/{subscribers_list_id}', 'ManageEmailApiController@delete_subscribers_list');
    Route::post('/subscribers-list/store', 'ManageEmailApiController@store_subscribers_list');
});
