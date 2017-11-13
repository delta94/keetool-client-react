<?php

Route::group(['domain' => 'manageapi.' . config('app.domain'), 'prefix' => 'good', 'namespace' => 'Modules\Good\Http\Controllers'], function () {

    Route::get('/all', 'GoodController@getAllGoods');
    Route::get('/get-by-status', 'GoodController@goodsByStatus');
    Route::get('/all/no-paging', 'GoodController@getGoodsWithoutPagination');
    Route::get('/task-setting', 'GoodController@getPropertyItems');
    Route::post('/create', 'GoodController@createGood');
    Route::delete('/{goodId}/delete', 'GoodController@deleteGood');
    Route::get('/all-property-items', 'GoodController@allPropertyItems');
    Route::delete('/delete-property-item/{property_item_id}', 'GoodController@deletePropertyItem');
    Route::post('/create-property-item', 'GoodController@createGoodPropertyItem');
    Route::post('/add-property-item-task/{task_id}', 'GoodController@addPropertyItemsTask');
    Route::get('/property-item/{property_item_id}', 'GoodController@getGoodPropertyItem');
    Route::get('/get-property/{good_id}', 'GoodController@propertiesOfGood');
    Route::post('/{id}/save-good-properties', 'GoodController@saveGoodProperties');
    Route::get('/{goodId}/task/{taskId}/good-properties', 'GoodController@loadGoodTaskProperties');
    Route::get('/good-all','GoodController@getAllGoods');
    Route::put('/{goodId}/update-price', 'GoodController@updatePrice');
    Route::put('/edit/{goodId}', 'GoodController@editGood');
    Route::get('/manufactures', 'GoodController@allManufactures');
    Route::post('/{goodId}/create-child-good', 'GoodController@createChildGood');
    Route::get('/status/count', 'GoodController@statusCount');
    Route::get('/inventories/all', 'GoodController@allInventories');
    Route::get('/inventories-info', 'GoodController@inventoriesInfo');
    Route::get('/{goodId}', 'GoodController@good');
});