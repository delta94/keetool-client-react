<?php

Route::group(['middleware' => 'web', 'domain' => "graphics.dev", 'namespace' => 'Modules\Graphics\Http\Controllers'], function () {
    Route::get('/', 'GraphicsController@index');
    Route::get('/contact-us', 'GraphicsController@contact_us');
    Route::get('/about-us', 'GraphicsController@aboutUs');
    Route::post('/contact_information', 'GraphicsController@contact_info');
    Route::get('/book/{good_id}', 'GraphicsController@book');
    Route::get('/add-book/{goodId}', 'GraphicsController@addGoodToCart');
    Route::get('/remove-book/{goodId}', 'GraphicsController@removeBookFromCart');
    Route::get('/load-books-from-session', 'GraphicsController@getGoodsFromSession');

});


