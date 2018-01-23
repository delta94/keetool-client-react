<?php

namespace Modules\Survey\Http\Controllers;

use App\Answer;
use App\Http\Controllers\ManageApiController;
use App\Lesson;
use App\Question;
use App\Survey;
use App\UserLessonSurvey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Survey\Services\SurveyService;

class SurveyController extends ManageApiController
{
    protected $surveyService;

    public function __construct(
        SurveyService $surveyService
    )
    {
        parent::__construct();
        $this->surveyService = $surveyService;
    }

    public function createUserLessonSurvey($surveyId, Request $request)
    {
        $survey = Survey::find($surveyId);
        if ($survey == null) {
            return $this->respondErrorWithStatus("Survey không tồn tại");
        }

        $userLessonSurvey = $this->surveyService->startSurvey($this->user->id, $survey->id);

        return $this->respondSuccessWithStatus([
            'user_lesson_survey' => $userLessonSurvey->transform(),
            'survey' => $survey->getDetailedData(),
        ]);

    }

    public function deleteQuestion($questionId)
    {
        $question = Question::find($questionId);
        if ($question === null) {
            return $this->respondErrorWithStatus("Câu hỏi không tồn tại");
        }

        $question->delete();

        $survey = $question->survey;

        $order = 0;

        foreach ($survey->questions()->orderBy("order")->get() as $question) {
            $question->order = $order;
            $order += 1;
            $question->save();
        }

        return $this->respondSuccessWithStatus([
            "message" => "success"
        ]);
    }

    public function duplicateQuestion($surveyId, $questionId)
    {
        $survey = Survey::find($surveyId);
        if ($survey == null) {
            return $this->respondErrorWithStatus("Khảo sát không tồn tại");
        }
        $question = Question::find($questionId);
        $newQuestion = $question->replicate();

        $maxOrder = $survey->questions()->select(DB::raw("max(`order`) as max_order"))->pluck("max_order")->first();

        $newQuestion->order = $maxOrder + 1;
        $newQuestion->save();

        return $this->respondSuccessWithStatus([
            "question" => $newQuestion->getData()
        ]);
    }

    public function updateQuestionOrder(Request $request)
    {
        if ($request->questions == null) {
            return [
                "status" => 0,
                "message" => "Bạn cần phải truyền danh sách câu hỏi lên"
            ];
        }

        $questions = json_decode($request->questions);

        foreach ($questions as $item) {
            $question = Question::find($item->id);
            $question->order = $item->order;
            $question->save();
        }

        return [
            "status" => 1
        ];
    }

    public function saveAnswer($answerId, Request $request)
    {
        $answer = Answer::find($answerId);
        if ($answer == null) {
            return [
                "status" => 0,
                "message" => "Câu trả lời này không tồn tại"
            ];
        }

        $answer->content = $request->content_data;
        $answer->save();

        return [
            "status" => 1,
            "answer" => $answer->getData()
        ];
    }

    public function updateQuestion($surveyId, Request $request, $questionId = null)
    {
        $survey = Survey::find($surveyId);
        $question = $survey->questions()->where("id", $questionId)->first();
        if ($question == null) {
            $question = new Question();
            $maxOrder = $survey->questions()->select(DB::raw("max(`order`) as max_order"))->pluck("max_order")->first();
            $question->order = $maxOrder + 1;
        }
        $question->survey_id = $surveyId;
        $question->content = $request->content_data;
        $question->type = $request->type;

        $question->save();

        if ($question->type === 0) {
            $question->answers()->delete();
        } else {
            if ($request->answers) {
                $question->answers()->delete();
                $answers = json_decode($request->answers);

                foreach ($answers as $a) {
                    $answer = new Answer();
                    $answer->question_id = $question->id;
                    $answer->content = $a->content;
                    $answer->correct = $a->correct;
                    $answer->save();
                }
            }
        }


        return $this->respondSuccessWithStatus([
            "question" => $question->getData()
        ]);
    }

    public function assignSurveyInfo(&$survey, $request)
    {
        $survey->name = $request->name;
        $survey->user_id = $this->user->id;
        $survey->is_final = $request->is_final;
        $survey->save();
        if ($request->questions) {
            $questions = json_decode($request->questions);
            $order = 0;
            foreach ($questions as $question) {
                $newQuestion = new Question;
                $newQuestion->survey_id = $survey->id;
                $newQuestion->content = $question->content;
                $newQuestion->type = $question->type;
                $newQuestion->image_url = $question->image_url;
                $newQuestion->order = ++$order;
                $newQuestion->save();
                $answers = $newQuestion->answers;
                foreach ($answers as $answer) {
                    $newAnswer = new Answer;
                    $newAnswer->question_id = $newQuestion->id;
                    $newAnswer->content = $answer->content;
                    $newAnswer->image_url = $answer->image_url;
                    $newAnswer->correct = $answer->correct;
                    $newAnswer->save();
                }
            }
        }
    }

    public function getSurveys(Request $request)
    {
        $limit = $request->limit ? $request->limit : 20;
        $search = $request->search;

        $surveys = Survey::query();

        $surveys = $surveys->where('name', 'like', '%' . $search . '%');

        if ($request->user_id)
            $surveys = $surveys->where('user_id', $request->user_id);

        $surveys = $surveys->orderBy('created_at', 'desc')->paginate($limit);

        return $this->respondWithPagination($surveys,
            [
                'surveys' => $surveys->map(function ($survey) {
                    return $survey->getData();
                }),
            ]
        );
    }

    public function getSurvey($surveyId, Request $request)
    {
        $survey = Survey::find($surveyId);
        if ($survey == null)
            return $this->respondErrorWithStatus([
                'message' => 'Không tồn tại bộ câu hỏi'
            ]);
        return $this->respondSuccessWithStatus([
            'survey' => $survey->getDetailedData(),
        ]);
    }

    public function createSurvey(Request $request)
    {
        $survey = new Survey;
        //validate

        $this->assignSurveyInfo($survey, $request);
        return $this->respondSuccessWithStatus([
            'message' => 'SUCCESS'
        ]);
    }

    public function editSurvey($surveyId, Request $request)
    {
        $survey = Survey::find($surveyId);
        if ($survey == null)
            return $this->respondErrorWithStatus([
                'message' => 'Không tồn tại đề'
            ]);
        //validate

        $this->assignSurveyInfo($survey, $request);
        return $this->respondSuccessWithStatus([
            'message' => 'SUCCESS'
        ]);
    }

    public function deleteSurvey($surveyId, Request $request)
    {
        $survey = Survey::find($surveyId);
        if ($survey == null)
            return $this->respondErrorWithStatus([
                'message' => 'Không tồn tại đề'
            ]);
        //validate

        $survey->delete();
        return $this->respondSuccessWithStatus([
            'message' => 'SUCCESS'
        ]);
    }

    public function getSurveyLessons($surveyId)
    {
        $survey = Survey::find($surveyId);
        $lessons = $survey->lessons;

        $surveyLessons = $lessons->map(function ($lesson) {
            $course = $lesson->course;
            return [
                "lesson_id" => $lesson->id,
                "course" => $course->shortTransform(),
                "lesson" => $lesson->shortTransform(),
                'time_display' => $lesson->pivot->time_display,
                'start_time_display' => $lesson->pivot->start_time_display
            ];
        });

        return $this->respondSuccessWithStatus([
            "survey_lessons" => $surveyLessons
        ]);
    }

    public function removeSurveyLesson($surveyId, $lessonId)
    {
        $survey = Survey::find($surveyId);
        $survey->lessons()->detach($lessonId);
        return $this->respondSuccessWithStatus([
            "message" => "success"
        ]);
    }

    public function addSurveyLesson($surveyId, $lessonId, Request $request)
    {
        $startTimeDisplay = $request->start_time_display;
        $timeDisplay = $request->time_display;
        $survey = Survey::find($surveyId);
        $lesson = Lesson::find($lessonId);
        $course = $lesson->course;
        $exist_lesson = $survey->lessons()->where('id', $lessonId)->first();
        if ($exist_lesson == null) {
            $survey->lessons()->attach($lessonId, [
                'time_display' => $timeDisplay,
                'start_time_display' => $startTimeDisplay
            ]);
            return $this->respondSuccessWithStatus([
                "survey_lesson" => [
                    "course" => $course->shortTransform(),
                    'time_display' => $timeDisplay,
                    'start_time_display' => $startTimeDisplay
                ]
            ]);
        } else {
            return response()->json(['message' => 'Buổi này đã được thêm vào survey', 'status' => 0]);
        }
    }
}
