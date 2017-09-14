<?php
/**
 * Created by PhpStorm.
 * User: phanmduong
 * Date: 9/9/17
 * Time: 13:13
 */

namespace App\Repositories;


use App\StudyClass;
use App\TeachingLesson;
use DateTime;
use Illuminate\Support\Facades\DB;

class ClassRepository
{
    protected $genRepository;
    protected $courseRepository;
    protected $attendancesRepository;
    protected $registerRepository;

    public function __construct(GenRepository $genRepository, CourseRepository $courseRepository, UserRepository $userRepository,
                                AttendancesRepository $attendancesRepository, RegisterRepository $registerRepository)
    {
        $this->genRepository = $genRepository;
        $this->courseRepository = $courseRepository;
        $this->userRepository = $userRepository;
        $this->attendancesRepository = $attendancesRepository;
        $this->registerRepository = $registerRepository;
    }

    public function get_class($class)
    {
        $data = [
            'id' => $class->id,
            'name' => $class->name,
            'datestart' => format_date($class->datestart),
            'study_time' => $class->study_time,
            'status' => $class->status,
            'activated' => $class->activated,
            'total_paid' => $class->registers()->where('status', 1)->count(),
            'target' => $class->target,
            'total_register' => $class->registers()->count(),
            'regis_target' => $class->regis_target,
            'created_at' => format_full_time_date($class->created_at)
        ];

        $teacher = $this->userRepository->user($class->teach);
        $teacher_assistant = $this->userRepository->user($class->assist);
        $gen = $this->genRepository->gen($class->gen);
        $course = $this->courseRepository->course($class->course);

        if ($gen)
            $data['gen'] = $gen;

        if ($course)
            $data['course'] = $course;

        if ($teacher)
            $data['teacher'] = $teacher;

        if ($teacher_assistant)
            $data['teacher_assistant'] = $teacher_assistant;

        return $data;
    }

    public function change_status($class_id)
    {
        if ($class_id != null) {
            $class = StudyClass::find($class_id);
            $class->status = ($class->status == 1) ? 0 : 1;
            $class->save();
            return $class;
        }
    }

    public function get_student($class)
    {
        if ($class) {

            $registers = $class->registers->map(function ($register) {
                $data = $this->registerRepository->register($register);
                $data['student'] = $this->userRepository->student($register->user);
                $data['total_attendances'] = $this->attendancesRepository->get_total_attendances($register);
                $data['attendances'] = $this->attendancesRepository->get_attendances($register);
                return $data;
            });

            return $registers;
        }
    }

    public function get_attendances_class($class)
    {
        return $this->attendancesRepository->get_attendances_class_lessons($this->get_class_lession($class));
    }

    public function get_class_lession($class)
    {
        return $class->classLessons()->join('lessons', 'class_lesson.lesson_id', '=', 'lessons.id')
            ->select('class_lesson.*', 'lessons.order', 'lessons.name')
            ->orderBy('order')->get();
    }

    public function is_create($user)
    {
        if ($user->role == 2) {
            return true;
        }

        return false;
    }

    public function is_delete($user, $class)
    {
        if ($user->role == 2 && $class->registers()->count() <= 0) {
            return true;
        }

        return false;
    }

    public function edit_status($user)
    {
        if ($user->role == 2) {
            return true;
        }

        return false;
    }

    public function is_duplicate($user)
    {
        if ($user->role == 2) {
            return true;
        }

        return false;
    }

    public function generateClassLesson($class)
    {
        $course = $class->course;
        $class_lessons = $class->lessons;
        $course_lessons = $course->lessons;

        foreach ($course_lessons as $lesson) {
            if (!($class->lessons->contains($lesson))) {
                DB::table('class_lesson')->insert([
                    ['class_id' => $class->id, 'lesson_id' => $lesson->id]
                ]);
                $class_lessons->push($lesson);
            }
        }
        foreach ($class_lessons as $lesson) {
            if (!($course_lessons->contains($lesson))) {
                DB::table('class_lesson')->where('lesson_id', '=', $lesson->id)->where('class_id', $class->id)->delete();
            }
        }
    }

    public function setClassLessonTime($class)
    {
        $start_date = new DateTime(date('Y-m-d', strtotime($class->datestart)));
        $start_date->modify('yesterday');

        $schedule = $class->schedule;
        $studySessions = $schedule->studySessions;

        $classLessons = $class->classLessons()
            ->join('lessons', 'class_lesson.lesson_id', '=', 'lessons.id')
            ->orderBy('lessons.order')->select('class_lesson.*')->get();


        $duration = $class->course->duration;
        $week = ceil($duration / count($studySessions));
        $count = 0;

        for ($i = 0; $i < $week; $i++) {
            foreach ($studySessions as $studySession) {
                $weekday = weekdayViToEn($studySession->weekday);

                $start_date->modify('next ' . $weekday);
                $classLessons[$count]->time = $start_date->format('Y-m-d');
                $classLessons[$count]->start_time = format_time_only_mysql(strtotime($studySession->start_time));
                $classLessons[$count]->end_time = format_time_only_mysql(strtotime($studySession->end_time));
                $classLessons[$count]->save();

                $class = $classLessons[$count]->studyClass;
                $this->renderTeachingLessons($classLessons[$count]->id, $class->teacher_id, $class->teaching_assistant_id);

                $count++;
                if ($count == $duration) {
                    break;
                }
            }
        }
    }

    public function renderTeachingLessons($classLessonId, $teacherId, $teachingAssitantId)
    {
        $teachingLesson = TeachingLesson::where('class_lesson_id', $classLessonId)->first();
        if (is_null($teachingLesson)) {
            $teachingLesson = new TeachingLesson();
            $teachingLesson->class_lesson_id = $classLessonId;
            $teachingLesson->teaching_assistant_id = $teachingAssitantId;
            $teachingLesson->teacher_id = $teacherId;
            $teachingLesson->save();
        }

    }
}