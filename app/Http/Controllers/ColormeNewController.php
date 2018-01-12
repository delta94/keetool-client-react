<?php

namespace App\Http\Controllers;

use App\Base;
use App\Colorme\Transformers\CourseTransformer;
use App\Colorme\Transformers\ProductTransformer;
use App\Course;
use App\Gen;
use App\Lesson;
use App\Order;
use App\Product;
use App\Repositories\CourseRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ColormeNewController extends CrawlController
{
    protected $productTransformer;
    protected $courseTransformer;
    protected $courseRepository;

    public function __construct(ProductTransformer $productTransformer, CourseTransformer $courseTransformer, CourseRepository $courseRepository)
    {
        parent::__construct();
        $this->productTransformer = $productTransformer;
        $this->courseTransformer = $courseTransformer;
        $this->courseRepository = $courseRepository;
        $bases = Base::orderBy('created_at')->get();
        $courses = Course::where('status', '1')->orderBy('created_at', 'asc')->get();
        $this->data['courses'] = $courses;
        $this->data['paid_courses'] = $this->courseRepository->paid_courses($this->user);
        $this->data['bases'] = $bases;
    }

    public function home()
    {

        $current_gen = Gen::getCurrentGen();
        $this->data['gen_cover'] = $current_gen->cover_url;
        return view('colorme_new.home', $this->data);
    }

    public function course($course_id, $saler_id = null, $campaign_id = null)
    {
        $course = Course::find($course_id);
        if ($course == null) {
            $courses = Course::all();
            foreach ($courses as $key) {
                if (convert_vi_to_en($key->name) === $course_id)
                    $course = $key;
            }
        }
        $course_id = $course->id;
        $current_gen = Gen::getCurrentGen();
        $this->data['current_gen_id'] = $current_gen->id;
        $this->data['gen_cover'] = $current_gen->cover_url;
        $this->data['course'] = $course;
        $this->data['course_id'] = $course_id;
        $this->data['bases'] = Base::orderBy('created_at', 'asc')->get()->filter(function ($base) use ($course_id, $current_gen) {
            return $base->classes()->where('course_id', $course_id)->where('gen_id', $current_gen->id)->count() > 0;
        });
        $this->data['saler_id'] = $saler_id;
        $this->data['campaign_id'] = $campaign_id;
        $this->data['pixels'] = $course->coursePixels;
        return view('colorme_new.course', $this->data);
    }


    public function courseOnline($courseId, $lessonId = null)
    {
        $lesson = Lesson::find($lessonId);

        $course = Course::find($courseId);
        if ($course == null) {
            return view('colorme_new.404.not_found_course', $this->data);
        }

        if ($lesson == null) {
            $term = $course->terms()->orderBy('order')->first();
            if ($term) {
                $lesson = $term->lessons()->orderBy('order')->first();
            }
        }

        if ($lesson == null) {
            return view('colorme_new.404.not_found_lesson', $this->data);
        }

        $lessons = $course->lessons()->get()->map(function ($lesson) {
            return [
                'id' => $lesson->id,
                'name' => $lesson->name
            ];
        });

        $this->data['course'] = $course;
        $this->data['lesson_selected'] = $lesson;
        $this->data['lessons'] = $lessons;
        $this->data['comments'] = $lesson ? $lesson->comments()->where('parent_id', '0')->orderBy('created_at', 'desc')->get()->map(function ($comment) {
            $data = $comment->transform($this->user);
            $data['child_comments'] = $comment->child_comments()->orderBy('created_at', 'desc')->get()->map(function ($commentChild) {
                $dataComment = $commentChild->transform($this->user);
                return $dataComment;
            });
            return $data;
        }) : [];

        return view('colorme_new.course_online_detail', $this->data);
    }

}
