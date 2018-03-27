<?php

$publicRoutes = function () {
    Route::get('/', 'UpCoworkingSpaceController@index');
    Route::get('/tin-tuc-startup', 'UpCoworkingSpaceController@blog');
    Route::get('/blog/post/{post_id}', 'UpCoworkingSpaceController@post');
    Route::get('/conference-room', 'UpCoworkingSpaceController@conferenceRoom');
    Route::get('/conference-room/{conferenceRoomId}', 'UpCoworkingSpaceController@conferenceRoom');
    Route::get('/member-register/{userId?}/{campaignId?}', 'UpCoworkingSpaceController@memberRegister');
<<<<<<< HEAD
=======
    Route::get('/su-kien', 'UpCoworkingSpaceController@event');
    Route::get('/events/{slug}',['as' => 'detail', 'uses' => 'UpCoworkingSpaceController@eventDetail']);
    Route::get('events/{slug}/sign-up-form',['as' => 'event-form', 'uses' => 'UpCoworkingSpaceController@eventSignUpForm']);
    Route::get('/su-kien-data','UpCoworkingSpaceController@getEventOfCurrentMonth');


>>>>>>> dd21963974154168b271828de4c4e8b537bd1ff7
    Route::get('/{slug}', 'UpCoworkingSpaceController@postBySlug');
};

Route::group(['middleware' => 'web', 'domain' => 'keetool7.xyz', 'namespace' => 'Modules\UpCoworkingSpace\Http\Controllers'], $publicRoutes);
Route::group(['middleware' => 'web', 'domain' => 'keetool4.test', 'namespace' => 'Modules\UpCoworkingSpace\Http\Controllers'], $publicRoutes);
