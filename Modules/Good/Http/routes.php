<?php

Route::group(['domain' => 'manageapi.' . config('app.domain'), 'prefix' => 'good', 'namespace' => 'Modules\Good\Http\Controllers'], function () {
    Route::get('/all', 'GoodController@getAll');
    Route::get('/task-setting', 'GoodController@getPropertyItems');
    Route::post("/create", "GoodController@createGood");
    Route::get("/all-property-items", 'GoodController@allPropertyItems');
    Route::delete("/delete-property-item/{property_item_id}", 'GoodController@deletePropertyItem');
    Route::get("/{id}", "GoodController@good");
    Route::post("/create-property-item", 'GoodController@createGoodPropertyItem');
    Route::post('/add-property-item-task/{task_id}', 'GoodController@addPropertyItemsTask');
    Route::get("/property-item/{property_item_id}", 'GoodController@getGoodPropertyItem');
    Route::get("/get-property/{good_id}", 'GoodController@propertiesOfGood');
    Route::post("/{id}/save-good-properties", 'GoodController@saveGoodProperties');
    Route::get("/{goodId}/task/{taskId}/good-properties", 'GoodController@loadGoodTaskProperties');
    Route::get('/good-all','GoodController@getAllGood');
    Route::put('/{goodId}/update-price', 'GoodController@updatePrice');
});
Route::group(['domain' => 'manageapi.' . config('app.domain'), 'prefix' => 'goods', 'namespace' => 'Modules\Good\Http\Controllers'], function () {
    Route::get('/good-all','GoodController@getAllGood');
    Route::put('/edit','GoodController@editGood');
    Route::delete('delete/{good_id}','GoodController@deleteGood');
});