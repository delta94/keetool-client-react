<?php

Route::group(['domain' => 'manageapi.' . config('app.domain'), 'prefix' => '/v2/survey', 'namespace' => 'Modules\Survey\Http\Controllers'], function () {
    Route::get('', 'SurveyController@getSurveys');
    Route::get('{surveyId}', 'SurveyController@getSurvey');
    Route::post('', 'SurveyController@createSurvey');

    Route::put('/questions', 'SurveyController@updateQuestionOrder');
    Route::put('{surveyId}', 'SurveyController@editSurvey');

    Route::delete('{surveyId}', 'SurveyController@deleteSurvey');
    Route::post('/{surveyId}/question', 'SurveyController@updateQuestion');
    Route::put('/{surveyId}/question/{questionId}', 'SurveyController@updateQuestion');
    Route::post('/{surveyId}/question/{questionId}', 'SurveyController@duplicateQuestion');
    Route::delete('/question/{questionId}', 'SurveyController@deleteQuestion');

});
