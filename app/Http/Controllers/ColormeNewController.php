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
use App\User;
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

    public function home($saler_id = null, $campaign_id = null)
    {
        $current_gen = Gen::getCurrentGen();
        $this->data['saler_id'] = $saler_id;
        $this->data['campaign_id'] = $campaign_id;
        $this->data['gen_cover'] = $current_gen->cover_url;
        $this->data['saler'] = User::find($saler_id);
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
        $this->data['saler'] = User::find($saler_id);
        return view('colorme_new.course', $this->data);
    }

    public function courseOnline($courseId, $lessonId = null)
    {
        $lesson = Lesson::find($lessonId);

        $course = Course::find($courseId);

        if ($course == null) {
            return view('colorme_new.404.not_found_course', $this->data);
        }

        $this->data['course'] = $course;

        if ($this->user == null || $this->user->registers()->where('course_id', $course->id)->where('status', 1)->first() == null) {
            return view('colorme_new.course_detail', $this->data);
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

        return view('colorme_new.course_online_lesson', $this->data);
    }

    public function profileProcess($username)
    {
        $user = User::where('username', $username)->first();

//        dd($this->data['paid_courses_user']);
        if ($user) {
            $user->avatar_url = generate_protocol_url($user->avatar_url);
            $this->data['user_profile'] = $user;
            $courses = $user->registers()->get()->map(function ($register) {
                $data = [
                    "id" => $register->studyClass->course->id,
                    "type_id" => $register->studyClass->course->type_id,
                    "name" => $register->studyClass->course->name,
                    "linkId" => convert_vi_to_en($register->studyClass->course->name),
                    "icon_url" => $register->studyClass->course->icon_url,
                    "duration" => $register->studyClass->course->duration,
                    "description" => $register->studyClass->course->description,
                    "image_url" => $register->studyClass->course->image_url,
                    "first_lesson" => $register->studyClass->course->lessons()->orderBy('order')->first(),
                    "total_lesson" => $register->studyClass->course->lessons()->count(),
                    "total_passed" => $register->studyClass->course->lessons()
                        ->join('class_lesson', 'class_lesson.lesson_id', '=', 'lessons.id')
                        ->where('class_lesson.class_id', $register->studyClass->id)
                        ->whereRaw('date(now()) >= date(class_lesson.time)')->count()
                ];
                return $data;
            });
            $this->data['paid_courses_user'] = $courses;
//            dd($this->data['paid_courses_user']);
            return view('colorme_new.profile.process', $this->data);
        }
        return redirect("/");
    }

    public function profile($username)
    {
        $user = User::where('username', $username)->first();
        $user->avatar_url = generate_protocol_url($user->avatar_url);
        $this->data['user_profile'] = $user;
        if ($user) {
            return view('colorme_new.profile.profile_react', $this->data);
        }
        return redirect("/");
    }

    public function social()
    {
        return view('colorme_new.colorme_react', $this->data);
    }

}
