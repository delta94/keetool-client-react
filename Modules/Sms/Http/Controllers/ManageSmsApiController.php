<?php

/**
 * Created by PhpStorm.
 * User: batman
 * Date: 29/03/2018
 * Time: 11:59
 */

namespace Modules\Sms\Http\Controllers;


use App\GroupUser;
use App\Http\Controllers\ManageApiController;
use App\SmsList;
use App\SmsTemplate;
use App\SmsTemplateType;
use App\Group;
use App\StudyClass;
use App\User;
use Illuminate\Http\Request;

class ManageSmsApiController extends ManageApiController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function assignCampaignInfo($campaign, $request, $user_id)
    {
        $campaign->name = $request->name;
        $campaign->description = $request->description;
        $campaign->status = $request->status;
        $campaign->needed_quantity = $request->needed_quantity;
        $campaign->user_id = $user_id;
        $campaign->save();
    }

    public function assignTemplateInfo($template, $request, $user_id, $campaignId)
    {
        $template->name = $request->name;
        $template->content = $request->content;
        $template->user_id = $user_id;
        $template->sms_template_type_id = $request->sms_template_type_id;
        $template->send_time = $request->send_time;
        $template->sms_list_id = $campaignId;
    }

    public function getCampaignsList(Request $request)
    {
        $query = trim($request->search);
        $limit = $request->limit ? intval($request->limit) : 20;
        $campaigns = SmsList::query();
        if ($query) {
            $campaigns = $campaigns->where('name', 'like', "%$query%");
        }
        if ($limit == -1) {
            $campaigns = $campaigns->orderBy('created_at', 'desc')->get();
            return $this->respondSuccessWithStatus([
                'campaigns' => $campaigns->map(function ($campaign) {
                    return $campaign->getData();
                })
            ]);
        }
        $campaigns = $campaigns->orderBy('created_at', 'desc')->paginate($limit);
        return $this->respondWithPagination($campaigns, [
            'campaigns' => $campaigns->map(function ($campaign) {
                return $campaign->getData();
            })
        ]);
    }

    public function getTemplateTypes(Request $request)
    {
        $query = trim($request->search);
        $limit = $request->limit ? intval($request->limit) : 20;
        $templateTypes = SmsTemplateType::query();
        if ($query) {
            $templateTypes = $templateTypes->where('name', 'like', "%$query%");
        }
        if ($limit == -1) {
            $templateTypes = $templateTypes->orderBy('created_at', 'desc')->get();
            return $this->respondSuccessWithStatus([
                'template_types' => $templateTypes->map(function ($templateType) {
                    return $templateType->getData();
                })
            ]);
        }
        $templateTypes = $templateTypes->orderBy('created_at', 'desc')->paginate($limit);
        return $this->respondWithPagination($templateTypes, [
            'template_types' => $templateTypes->map(function ($templateType) {
                return $templateType->getData();
            })
        ]);
    }

    public function createCampaign(Request $request)
    {
        $campaign = new SmsList;
        $group = new Group;
        $group->save();
        $campaign->group_id = $group->id;
        $this->assignCampaignInfo($campaign, $request, $this->user->id);
        return $this->respondSuccessWithStatus([
            'message' => 'Tạo chiến dịch thành công'
        ]);
    }

    public function editCampaign($campaignId, Request $request)
    {
        $campaign = SmsList::find($campaignId);
        if ($campaign == null) {
            return $this->respondErrorWithStatus([
                'message' => 'Không tồn tại chiến dịch này'
            ]);
        }
        $this->assignCampaignInfo($campaign, $request, $campaign->user_id);
        return $this->respondSuccessWithStatus([
            'message' => 'Sửa chiến dịch thành công'
        ]);
    }

    public function changeCampaignStatus($campaignId, Request $request)
    {
        $campaign = SmsList::find($campaignId);
        if ($campaign == null) {
            return $this->respondErrorWithStatus([
                'message' => 'Không tồn tại chiến dịch này'
            ]);
        }
        $campaign->status = $request->status;
        $campaign->save();
        return $this->respondSuccessWithStatus([
            'message' => 'Thay đổi trạng thái thành công'
        ]);
    }

    public function createTemplate($campaignId, Request $request)
    {
        $template = new SmsTemplate;
        $this->assignTemplateInfo($template, $request, $this->user->id, $campaignId);
        $template->sent_quantity = 0;
        $template->save();

        return $this->respondSuccessWithStatus([
            'message' => 'Tạo tin nhắn thành công'
        ]);
    }

    public function editTemplate($templateId, Request $request)
    {
        $template = SmsTemplate::find($templateId);
        if ($template == null) {
            return $this->respondErrorWithStatus([
                'message' => 'Không tồn tại tin nhắn này'
            ]);
        }
        $this->assignTemplateInfo($template, $request, $template->user_id, $template->sms_list_id);
        $template->save();
        return $this->respondSuccessWithStatus([
            'message' => 'Sửa tin nhắn thành công'
        ]);
    }

    public function getCampaignTemplates($campaignId, Request $request)
    {
        $campaign = SmsList::find($campaignId);
        $limit = $request->limit ? intval($request->limit) : 20;
        $search = trim($request->search);

        if ($campaign == null) {
            return $this->respondErrorWithStatus('Không có chiến dịch này');
        }
        $templates = $campaign->templates()->where(function ($query) use ($search) {
            $query->where('name', 'like', "%$search%")
                ->orWhere('content', 'like', "%$search%");
        });

        if ($limit == -1) {
            $templates = $templates->orderBy('created_at', 'desc')->get();
        } else {
            $templates = $templates->orderBy('created_at', 'desc')->paginate($limit);
        }
        return $this->respondWithPagination($templates, [
            "campaign" => $campaign->getData(),
            'templates' => $templates->map(function ($template) {
                return $template->transform();
            })
        ]);
    }

    public function getCampaignReceivers($campaignId, Request $request)
    {
        $campaign = SmsList::find($campaignId);
        $limit = $request->limit ? intval($request->limit) : 20;
        $search = trim($request->search);
        if ($campaign == null) {
            return $this->respondErrorWithStatus('Không có chiến dịch này');
        }
        $users = $campaign->group->user()->where(function ($query) use ($search) {
            $query->where('name', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%")->orWhere('phone', 'like', "%$search%");
        });
        if ($limit == -1) {
            $users = $users->orderBy('created_at', 'desc')->get();
        } else {
            $users = $users->orderBy('created_at', 'desc')->paginate($limit);
        }
        return $this->respondWithPagination($users, [
            'receivers' => $users->map(function ($user) {
                return $user->getReceivers();
            })
        ]);
    }

    public function createTemplateType(Request $request)
    {
        $template_type = new SmsTemplateType;
        $check = SmsTemplateType::where('name', trim($request->name))->get();
        if (count($check) > 0)
            return $this->respondErrorWithStatus([
                'message' => 'Đã tồn tại loại tin nhăn này'
            ]);
        $template_type->name = $request->name;
        $template_type->color = $request->color;
        $template_type->save();
        return $this->respondSuccessWithStatus([
            'message' => 'Tạo loại tin nhắn thành công'
        ]);
    }

    public function editTemplateType($templateTypeId, Request $request)
    {
        $template_type = SmsTemplateType::find($templateTypeId);
        $check = SmsTemplateType::where('name', trim($request->name))->get();
        if (count($check) > 0 && $template_type->name !== $request->name)
            return $this->respondErrorWithStatus([
                'message' => 'Không thể chỉnh sửa vì bị trùng tên'
            ]);
        $template_type->name = $request->name;
        $template_type->color = $request->color;
        $template_type->save();
        return $this->respondSuccessWithStatus([
            'message' => 'Sửa loại tin nhắn thành công'
        ]);
    }

    public function addUsersIntoCampaign($campaignId, Request $request)
    {
        $campaign = SmsList::find($campaignId);
        if ($campaign == null) {
            return $this->respondErrorWithStatus([
                'message' => 'Không tồn tại chiến dịch này'
            ]);
        }
        $group = $campaign->group;
        $users = json_decode($request->users);
        foreach ($users as $user) {
            $groups_users = new GroupUser;
            $groups_users->group_id = $group->id;
            $groups_users->user_id = $user->id;
            $groups_users->save();
        }
        return $this->respondSuccessWithStatus([
            'message' => 'Thêm người nhận vào chiến dịch thành công'
        ]);
    }

    public function getReceiversChoice(Request $request)
    {

        $startTime = $request->start_time;
        $endTime = date("Y-m-d", strtotime("+1 day", strtotime($request->end_time)));
        $courses = json_decode($request->courses);
        $classes = json_decode($request->classes);
        $limit = $request->limit ? $request->limit : 20;
        // $paid_course_quantity = $request->paid_course_quantity;
        if ($request->carer_id) {
            $users = User::find($request->carer_id)->getCaredUsers();
        } else $users = User::query();

        if ($startTime != null && $endTime != null) {
            $users = $users->whereBetween('users.created_at', array($startTime, $endTime));
        }

        if ($courses) {
            $classes_courses = StudyClass::query()->join("courses", "courses.id", "=", "classes.course_id")->select("classes.*")->where(function ($query) use ($courses) {
                for ($index = 0; $index < count($courses); ++$index) {
                    $course_id = $courses[$index]->id;
                    if ($index == 0)
                        $query->where('courses.id', '=', $course_id);
                    else
                        $query->orWhere('courses.id', '=', $course_id);
                }
            })->get();
        }

//        return $this->respondWithPagination($classes, [
//            'users' => $classes->map(function ($user) {
//                return [
//                    'id'=>$user->id
//                ];
//            })
//        ]);
        if ($classes)
            $classes = array_merge($classes_courses, json_decode($request->classes));

        else
            $classes = array_merge($classes_courses, []);
        if ($classes) {
            $users = $users->join('registers', 'registers.user_id', '=', 'users.id')
                ->select('users.*')->where(function ($query) use ($classes) {
                    for ($index = 0; $index < count($classes); ++$index) {
                        $class_id = $classes[$index]->id;
                        if ($index == 0)
                            $query->where('registers.class_id', '=', $class_id);
                        else
                            $query->orWhere('registers.class_id', '=', $class_id);
                    }

                });
        }
        if ($request->top) {
            $users = $users->simplePaginate($request->top);
        } else {
            $users = $users->paginate($limit);
        }
        if ($request->top) {
            return $this->respondWithSimplePagination($users, [
                'users' => $users->map(function ($user) {
                    return $user->getReceivers();
                })
            ]);
        } else {
            return $this->respondWithPagination($users, [
                'users' => $users->map(function ($user) {
                    return $user->getReceivers();
                })
            ]);
        }
    }

}