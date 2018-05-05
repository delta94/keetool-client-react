<?php

$productCategoryRoutes = function () {
    Route::group(['prefix' => 'v2'], function () {
        Route::get('/blog', 'ProductManageApiController@allBlogs');
        Route::get('/product-category', 'ProductCategoryController@allProductCategories');
        Route::post('/product-category', 'ProductCategoryController@createProductCategory');
        Route::put('/product-category/{productCategoryId}', 'ProductCategoryController@editProductCategory');
        Route::delete('/product-category/{productCategoryId}', 'ProductCategoryController@deleteProductCategory');
    });
};

Route::group(['domain' => config('app.domain'), 'prefix' => 'manageapi/v3', 'namespace' => 'Modules\Product\Http\Controllers'], $productCategoryRoutes);
