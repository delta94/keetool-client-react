<?php

namespace Modules\StudyClass\Http\Controllers;

use App\Group;
use App\Http\Controllers\ManageApiController;
use App\Repositories\ClassRepository;
use App\Repositories\CourseRepository;
use App\Repositories\UserRepository;
use App\StudyClass;
use App\Repositories\GenRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;

class ManageClassApiController extends ManageApiController
{
    protected $classRepository;

    public function __construct(ClassRepository $classRepository)
    {
        parent::__construct();
        $this->classRepository = $classRepository;
    }

    public function get_classes(Request $request)
    {

        $search = $request->search;
        $limit = 10;
        if ($request->limit)
            $limit = $request->limit;

        if ($search) {
            $classes = StudyClass::where('name', 'like', '%' . $search . '%')
                ->orderBy('created_at', 'desc')->paginate($limit);
        } else {
            $classes = StudyClass::orderBy('created_at', 'desc')->paginate($limit);
        }

        if ($request->teacher_id) {
            $classes = StudyClass::where('name', 'like', '%' . $search . '%')
                ->where(function ($query) use ($request) {
                    $query->where('teacher_id', $request->teacher_id)
                        ->orWhere('teaching_assistant_id', $request->teacher_id);
                })
                ->orderBy('created_at', 'desc')->paginate($limit);
        }

        $data = [
            "classes" => $classes->map(function ($class) {
                $data = $this->classRepository->get_class($class);
                $data['edit_status'] = $this->classRepository->edit_status($this->user);
                $data['is_delete_class'] = $this->classRepository->is_delete($this->user, $class);
                $data['is_duplicate'] = $this->classRepository->is_duplicate($this->user);
                return $data;
            }),
            'is_create_class' => $this->classRepository->is_create($this->user)
        ];

        return $this->respondWithPagination($classes, $data);
    }

    public function duplicate_class($class_id)
    {
        $new_class = StudyClass::find($class_id)->replicate();
        $new_class->activated = 0;
        $new_class->save();

        $group = new Group();
        $group->name = "Lớp " . $new_class->name . " duplicate";
        $group->class_id = $new_class->id;
        $group->avatar_url = $new_class->course->icon_url;
        $group->creator_id = $this->user->id;
        $group->save();

        // auto generate time for class lesson
        generate_class_lesson($new_class);

        // create class lessons
        set_class_lesson_time($new_class);

        $data = $this->classRepository->get_class($new_class);

        if ($this->user->role == 2) {
            $data['edit_status'] = true;
        }

        return $this->respondSuccessWithStatus([
            'class' => $data
        ]);
    }

    public function delete_class(Request $request)
    {

        $class = StudyClass::find($request->class_id);

        if ($class) {
            if ($this->classRepository->is_delete($this->user, $class)) {
                return $this->responseWithError("Không thể xóa lớp. Lớp đã có " . $class->registers()->count() . " học viên");
            }

            $class->delete();

            return $this->respondSuccessWithStatus([
                'message' => "Xóa lớp thành công"
            ]);
        }

        return $this->responseWithError("Lớp không tồn tại");
    }

    public function change_status(Request $request)
    {

        if ($this->user->role === 2) {
            $class_id = $request->class_id;
            $class = $this->classRepository->change_status($class_id);
            if ($class) {
                return $this->respondSuccessWithStatus([
                    'class' => [
                        'id' => $class->id,
                        'status' => $class->status
                    ]
                ]);
            }
            return $this->responseWithError("Có lỗi xảy ra");
        }

        return $this->responseUnAuthorized();
    }

    public function get_data_class($class_id)
    {
        $class = StudyClass::find($class_id);

        if (!$class) {
            return $this->responseWithError("Lớp này không tồn tại");
        }

        $data = $this->classRepository->get_class($class);
        $registers = $this->classRepository->get_student($class);
        $attendances = $this->classRepository->get_attendances_class($class);

        if ($registers) {
            $data['registers'] = $registers;
        }

        if ($attendances) {
            $data['attendances'] = $attendances;
        }


        return $this->respondSuccessWithStatus([
            'class' => $data
        ]);
    }
}
