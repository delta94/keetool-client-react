<?php


Route::group(['domain' => 'manageapi.' . config('app.domain'), 'prefix' => '/v2/course', 'namespace' => 'Modules\Course\Http\Controllers'], function () {
    Route::get('/get-all','CourseController@getAllCourses');
    Route::delete('/delete/{course_id}','CourseController@deleteCourse');
    Route::get('/get-detailed/{cours_id}', 'CourseController@getCourse');
    Route::post('/create-edit', 'CourseController@createOrEdit');
});

