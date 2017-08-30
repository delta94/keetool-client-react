<?php

namespace App\Http\Controllers;

use App\Colorme\Transformers\RegisterTransformer;
use App\Colorme\Transformers\StudentTransformer;
use App\Gen;
use App\Register;
use App\TeleCall;
use App\Transaction;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\DB;

class StudentApiController extends ApiController
{
    protected $studentTransformer, $registerTransformer;

    public function __construct(StudentTransformer $studentTransformer, RegisterTransformer $registerTransformer)
    {
        parent::__construct();
        $this->studentTransformer = $studentTransformer;
        $this->registerTransformer = $registerTransformer;
    }

    public function get_newest_code()
    {
        return $this->respond(['newest_code' => Register::orderBy('code', 'desc')->first()->code]);
    }

    public function search_student(Request $request)
    {
        $search = $request->search ? $request->search : '';
//        if ($search == '' || $search == null) {
//            return $this->responseBadRequest('No search term provided!');
//        }
        $limit = $request->limit ? $request->limit : 10;
        $students = User::where('role', 0)
            ->whereExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('registers')
                    ->where('status', 0)
                    ->whereRaw('registers.user_id = users.id');
            })
            ->where(function ($query) use ($search) {
                $query->where('email', 'like', '%' . $search . '%')
                    ->orWhere('phone', 'like', '%' . $search . '%')
                    ->orWhere('name', 'like', '%' . $search . '%');
            })->paginate($limit);

        $newest_code = Register::orderBy('code', 'desc')->first()->code;
        return $this->respondWithPagination($students,
            [
                'data' => $this->studentTransformer->transformCollection($students),
                'newest_code' => $newest_code
            ]);
    }

    public function get_money(Request $request)
    {
        if ($request->register_id == null || $request->money == null ||
            $request->code == null || $request->received_id_card == null
        ) {
            return $this->responseBadRequest('Not enough parameters!');
        }
        $register_id = $request->register_id;
        $money = str_replace(array('.', ','), '', $request->money);
        $code = $request->code;

        $register = Register::find($register_id);

        if ($register->status == 1) {
            return $this->responseBadRequest('Học viên này đã đóng tiền rồi');
        }

        $register->money = $money;

        $register->paid_time = format_time_to_mysql(time());
        $register->received_id_card = $request->received_id_card;
        $register->note = $request->note;
        $register->staff_id = $this->user->id;
        $regis_by_code = Register::where('code', $code)->first();


        if ($regis_by_code != null) {
            return $this->responseBadRequest('code is already existed');
        } else {
            $register->code = $code;
            $register->status = 1;
            $register->save();

            $transaction = new Transaction();
            $transaction->money = $money;
            $transaction->sender_id = $this->user->id;
            $transaction->receiver_id = $register->id;
            $transaction->sender_money = $this->user->money;
            $transaction->note = "Học viên " . $register->user->name . " - Lớp " . $register->studyClass->name;
            $transaction->status = 1;
            $transaction->type = 1;
            $transaction->save();
            DB::insert(DB::raw("
                insert into attendances(`register_id`,`checker_id`,class_lesson_id)
                (select registers.id,-1,class_lesson.id
                from class_lesson
                join registers on registers.class_id = class_lesson.class_id
                where registers.id = $register->id
                )
                "));

            $current_money = $this->user->money;
            $this->user->money = $current_money + $money;
            $this->user->save();
            send_mail_confirm_receive_studeny_money($register, ["colorme.idea@gmail.com"]);
            send_sms_confirm_money($register);
        }
        $return_data = array(
            'data' => [
                'id' => $register->id,
                'money' => $register->money,
                'code' => $register->code,
                'note' => $register->note,
                'received_id_card' => $register->received_id_card,
                'paid_time' => format_date_full_option($register->paid_time)
            ],
            'message' => "success"
        );


        $code = Register::orderBy('code', 'desc')->first()->code;

        $nextNumber = explode("M", $code)[1] + 1;
        $return_data["next_code"] = 'CM' . $nextNumber;

        $waiting_code = Register::where('code', 'like', 'CCM%')->orderBy('code', 'desc')->first()->code;
        $waiting_code = explode("M", $waiting_code)[1] + 1;
        $return_data["next_waiting_code"] = 'CCM' . $waiting_code;


        return $this->respond($return_data);
    }

    public function registerlist(Request $request)
    {
        if ($request->gen_id) {
            $gen = Gen::find($request->gen_id);
        } else {
            $gen = Gen::getCurrentGen();
        }

        if ($request->limit) {
            $limit = $request->limit;
        } else {
            $limit = 20;
        }


        $search = $request->search;
        if ($search) {
            $users_id = User::where('email', 'like', '%' . $search . '%')
                ->orWhere('phone', 'like', '%' . $search . '%')
                ->orWhere('name', 'like', '%' . $search . '%')->get()->pluck('id')->toArray();
//            dd($users_id);
            $registers = $gen->registers()->whereIn('user_id', $users_id);
        } else {
            $registers = $gen->registers();
        }


        if ($request->saler_id != null) {
            $registers = $registers->where('saler_id', $request->saler_id);
        }

        if ($request->status != null) {
            $registers = $registers->where('status', $request->status);
        }
        $registers = $registers->orderBy('created_at', 'desc')->paginate($limit);

        foreach ($registers as &$register) {
            $register->study_time = 1;
            $user = $register->user;
            foreach ($user->registers()->where('id', '!=', $register->id)->get() as $r) {
                if ($r->studyClass->course_id == $register->studyClass->course_id) {
                    $register->study_time += 1;
                }
            }
            if ($register->call_status == 0) {
                if (($register->time_to_reach == 0)) {
                    $register->time_to_reach = $register->time_to_call != '0000-00-00 00:00:00' ?
                        ceil(diffDate(date('Y-m-d H:i:s'), $register->time_to_call)) : 0;
                }
            } else {
                if ($register->call_status == 2) {
                    $register->time_to_reach = null;
                }
            }
        }

        return $this->respondWithPagination($registers, ['registers' => $this->registerTransformer->transformCollection($registers)]);
    }

    public function callHistory(Request $request)
    {
        if ($request->page) {
            $page = $request->page;
        } else {
            $page = 1;
        }

        $limit = 30;
        $offset = ($page - 1) * $limit;

        if ($request->gen_id) {
            $current_gen = Gen::find($request->gen_id);
        } else {
            $current_gen = Gen::getCurrentGen();
        }

        if ($request->user_id) {
//            where('gen_id', $current_gen->id)->
            $telecalls = TeleCall::where('student_id', $request->user_id)->orderBy('updated_at', 'desc');
        } else {
            $telecalls = TeleCall::orderBy('updated_at', 'desc');
        }

        $user = $this->user;

        $data = [
            'telecalls' => $telecalls->take($limit)->skip($offset)->get()->map(function ($item) use ($current_gen, $user) {
                $data = [
                    "id" => $item->id,
                    "caller" => [
                        "id" => $item->caller->id,
                        "name" => $item->caller->name
                    ],
                    "student" => [
                        'id' => $item->student->id,
                        'avatar_url' => $item->student->avatar_url,
                        'name' => $item->student->name,
                        'phone' => $item->student->phone,
                        'email' => $item->student->email,
                        'university' => $item->student->university,
                        'work' => $item->student->work,
                        'address' => $item->student->address,
                        'is_called' => $item->student->is_called->map(function ($item) {
                            return [
                                'id' => $item->id,
                                'updated_at' => format_time_to_mysql(strtotime($item->updated_at)),
                                'caller_name' => $item->caller->name,
                                'call_status' => $item->call_status,
                                'note' => $item->note
                            ];
                        }),
                        "registers" => $item->student->registers->map(function ($regis) {
                            $data = [
                                'id' => $regis->id,
                                "course_name" => $regis->studyClass->course->name,
                                "course_duration" => $regis->studyClass->course->duration,
                                "course_price" => $regis->studyClass->course->price,
                                "class_name" => $regis->studyClass->name,
                                "study_time" => $regis->studyClass->study_time,
                                "created_at" => format_time_to_mysql(strtotime($regis->created_at))
                            ];
                            if ($regis->saler) {
                                $data['saler_name'] = $regis->saler->name;
                            }
                            return $data;
                        })
                    ],
                    "call_status_value" => $item->call_status,
                    "call_status" => call_status($item->call_status),
                    "note" => $item->note,
                    "call_time" => format_time_to_mysql(strtotime($item->created_at))
                ];
                if ($item->caller_id == $user->id && $item->call_status == 2) {
                    $data['is_calling'] = true;
                } else {
                    $data['is_calling'] = false;
                }
                return $data;

            })
        ];

        return $data;
    }


}
