<?php
/**
 * Created by PhpStorm.
 * User: phanmduong
 * Date: 9/1/17
 * Time: 17:02
 */

namespace App\Http\Controllers;


use App\Colorme\Transformers\ProgressTransformer;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ManageStudentApiController extends ManageApiController
{
    protected $progressTransformer;

    public function __construct(ProgressTransformer $progressTransformer)
    {
        $this->progressTransformer = $progressTransformer;
    }

    public function get_info_student($studentId)
    {
        $student = User::find($studentId);
        return $this->respondSuccessWithStatus([
            'student' => $student
        ]);
    }

    public function get_registers($studentId)
    {
        $student = User::find($studentId);

        $registers = $student->registers()->orderBy('created_at', 'desc')->get();

        $registers = $registers->map(function ($register) {
            $data = [];
            $class = $register->studyClass()->first();

            $data['class'] = [
                'id' => $class->id,
                'name' => $class->name,
                'avatar_url' => $class->course->icon_url,
                "study_time" => $class->study_time,
                "description" => $class->description,
                "room" => $class->room->name,
                "base" => $class->base->address
            ];

            if ($register->saler) {
                $data['saler'] = [
                    'id' => $register->saler->id,
                    'name' => $register->saler->name,
                    'color' => $register->saler->color
                ];
            }

            if ($register->marketing_campaign) {
                $data["campaign"] = [
                    'id' => $register->marketing_campaign->id,
                    'name' => $register->marketing_campaign->name,
                    "color" => $register->marketing_campaign->color
                ];
            }

            return $data;
        });
        return $this->respondSuccessWithStatus([
            'registers' => $registers
        ]);
    }

    public function history_calls($studentId)
    {
        $student = User::find($studentId);

        $history_calls = $student->is_called->map(function ($item) {
            return [
                'id' => $item->id,
                'updated_at' => format_date_full_option($item->updated_at),
                'caller' => [
                    'name' => $item->caller ? $item->caller->name : 'Không có',
                    'color' => $item->caller ? $item->caller->color : ''
                ],
                'call_status' => call_status_text($item->call_status),
                'note' => $item->note
            ];
        });

        return $this->respondSuccessWithStatus([
            'history_calls' => $history_calls,
        ]);
    }

    public function get_progress($studentId)
    {
        $target_user = User::find($studentId);
        if ($target_user) {
            $registers = $target_user->registers()
                ->where('status', 1)->whereExists(function ($query) {
                    $query->select(DB::raw(1))
                        ->from('classes')
                        ->whereRaw('classes.id = registers.class_id')
                        ->where('name', 'like', '%.%');
                })->orderBy('created_at', 'desc')->get();
            return $this->respondSuccessWithStatus([
                'progress' => $this->progressTransformer->transformCollection($registers)
            ]);
        } else {
            return $this->responseBadRequest("student not existed");
        }
    }

    public function edit_student(Request $request)
    {
        $student = User::find($request->id);
        $student->name = $request->name;
        $student->email = $request->email;
        $student->phone = $request->phone;
        $student->save();
        return $this->respondSuccessWithStatus([
            'student' => $student
        ]);
    }
}