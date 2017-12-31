<?php

Route::group(['domain' => 'manageapi.' . config('app.domain'), 'prefix' => 'work', 'namespace' => 'Modules\Work\Http\Controllers'], function()
{
    Route::post('/', 'WorkApiController@createWork');
    Route::get('/{workId}','WorkApiController@getDetailWork');
    Route::get('/','WorkApiController@getAll');
    Route::put('/{workId}','WorkApiController@editWork');
    Route::delete('/{workId}','WorkApiController@deleteWork');
    Route::post('{workId}/extension','WorkApiController@extensionWork');
});
