<?php

namespace App\Http\Controllers;

use App\Color;
use App\Colorme\Transformers\NotificationTransformer;
use App\CV;
use App\Group;
use App\GroupMember;
use App\Notification;
use App\Order;
use App\Product;
use App\Topic;
use App\TopicAction;
use App\TopicAttendance;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class UserApiController extends ApiController
{
    protected $notificationTransformer;

    public function __construct(NotificationTransformer $notificationTransformer)
    {
        parent::__construct();
        $this->notificationTransformer = $notificationTransformer;
    }

    public function join_topic(Request $request)
    {
        $userId = $request->user_id;
        $topicId = $request->topic_id;

        $topicAttendance = new TopicAttendance();

        $topicAttendance->topic_id = $topicId;
        $topicAttendance->user_id = $userId;

        $topicAttendance->save();
        return $this->respondSuccessWithStatus([
            'id' => $topicId
        ]);

    }

    public function add_user_to_group(Request $request)
    {
        $user_id = $request->user_id;
        $group_link = $request->group_link;
        $group = Group::where('link', $group_link)->first();
        if ($group) {
            $groupMember = new GroupMember();
            $groupMember->group_id = $group->id;
            $groupMember->user_id = $user_id;
            $groupMember->join_date = format_time_to_mysql(time());
            $groupMember->acceptor_id = $this->user->id;
            $groupMember->position = "member";
            $groupMember->state = "joined";
            $groupMember->save();
        } else {
            return $this->respondErrorWithStatus("Nhóm không tồn tại");
        }
    }

    public function change_avatar(Request $request)
    {
        $avatar_name = uploadFileToS3($request, 'avatar', 250, $this->user->avatar_name);
        if ($avatar_name != null) {
            $this->user->avatar_name = $avatar_name;
            $this->user->avatar_url = $this->s3_url . $avatar_name;
        }
        $this->user->save();
        return $this->respond([
            "message" => "Tải lên thành công",
            "avatar_url" => $this->user->avatar_url
        ]);
    }

    public function notifications(Request $request)
    {
        if ($request->limit) {
            $limit = $request->limit;
        } else {
            $limit = 20;
        }
        $notifications = $this->user->received_notifications()->orderBy('created_at', 'desc')->paginate($limit);
        return $this->respondWithPagination($notifications, [
            'notifications' => $this->notificationTransformer->transformCollection($notifications),
            'unseen' => $this->user->received_notifications()->where('seen', 0)->count()
        ]);
    }

    public function seen_all_notifications()
    {
        $notifications = $this->user->received_notifications()->where('seen', 0)->get();
        $notifications->map(function ($notification) {
            $notification->seen = 1;
            $notification->save();
        });
        return $this->respond(['message' => "success"]);
    }


    public function upload_image(Request $request)
    {
        $size = $request->size;
        $old_name = $request->old_name;
        $thumb_size = $request->thumb_size;
        $old_thumb_name = $request->old_thumb_name;
        $data = ["type" => "image"];
        $image_name = uploadFileToS3($request, 'image', $size, $old_name);
        if ($image_name != null) {
            $data["image_url"] = $this->s3_url . $image_name;
            $data["image_name"] = $image_name;
        }
        if ($thumb_size) {
            $thumb_name = uploadThunbImageToS3($request, 'image', $thumb_size, $old_thumb_name);
            if ($thumb_name != null) {
                $data["thumb_name"] = $thumb_name;
                $data["thumb_url"] = $this->s3_url . $thumb_name;
            }
        }

        $data["message"] = "Tải lên thành công";
        $data['size'] = $size;
        $data['thumb_size'] = $thumb_size;
        return $this->respond($data);
    }

    public function delete_product($product_id)
    {
        $product = Product::find($product_id);
        if ($product->author_id == $this->user->id) {
            foreach ($product->notifications as $notification) {
                $notification->delete();
            }
            $topicAttend = $product->topicAttendance;
            if ($topicAttend) {
                $topicAttend->product_id = null;
                $topicAttend->save();
            }
            $product->delete();
            return $this->respond(['message' => 'delete success']);
        } else {
            return $this->responseUnAuthorized(['Bạn không phải là tác giả của bài viết này']);
        }
    }

//    public function upload_video( Request $request)
//    {
//        $old_name = $request->old_name;
//
//        $video_name = uploadLargeFileToS3UseCloudConvert($request, 'video', $old_name);
//        if ($video_name != null) {
//            return $this->respond([
//                "message" => "Tải lên thành công",
//                "video_url" => $this->s3_url . $video_name,
//                "video_name" => $video_name,
//                "type" => "video"
//            ]);
//        } else {
//            return $this->responseBadRequest(['Có lỗi xảy ra, không upload được video']);
//        }
//    }

    public function upload_video(Request $request)
    {
        $old_name = $request->old_name;

        $video_name = uploadAndTranscodeVideoToS3($request, 'video', $old_name);
        if ($video_name != null) {
            return $this->respond([
                "message" => "Tải lên thành công",
                "video_url" => $this->s3_url . $video_name,
                "video_name" => $video_name,
                "type" => "video"
            ]);

        } else {
            return $this->responseBadRequest(['Có lỗi xảy ra, không upload được video']);
        }
    }

    public function delete_file(Request $request)
    {
//        deleteFileFromS3($request->file_name);
        return $this->respond(['message' => "Xoá file thành công"]);
    }

    private function send_save_product_topic_noti($receivers, $currentUser, $topic, $class)
    {
        foreach ($receivers as $user) {
            if ($currentUser && $currentUser->id != $user->id) {

                $notification = new Notification;
                $notification->actor_id = $currentUser->id;
                $notification->receiver_id = $user->id;
                $notification->type = 13;
                $message = $notification->notificationType->template;

                $message = str_replace('[[TEACHER]]', "<strong>" . $user->name . "</strong>", $message);
                $message = str_replace('[[STUDENT]]', "<strong>" . $currentUser->name . "</strong>", $message);
                $message = str_replace('[[TOPIC]]', "<strong>" . $topic->title . "</strong>", $message);
                $message = str_replace('[[CLASS]]', "<strong>" . $class->name . "</strong>", $message);
                $notification->message = $message;

                $notification->color = $notification->notificationType->color;
                $notification->icon = $notification->notificationType->icon;
                $notification->url = config("app.protocol") . config("app.domain") . "/post/bai-tap-colorme-" . $product->id;

                $notification->save();

                $data = array(
                    "message" => $message,
                    "link" => $notification->url,
                    'created_at' => format_time_to_mysql(strtotime($notification->created_at)),
                    "receiver_id" => $notification->receiver_id,
                    "actor_id" => $notification->actor_id,
                    "icon" => $notification->icon,
                    "color" => $notification->color
                );

                $publish_data = array(
                    "event" => "notification",
                    "data" => $data
                );

                Redis::publish(config("app.channel"), json_encode($publish_data));
            }
        }
    }

    public function save_product(Request $request)
    {
        if ($request->id) {
            $product = Product::find($request->id);
        } else {
            $product = new Product();
        }

        $product->description = $request->description;
        $product->title = $request->title;
        $product->content = $request->product_content;
        $product->author_id = $this->user->id;
        $product->tags = $request->tags_string;
        $product->category_id = $request->category_id;

        if ($request->video_url) {
            $product->url = $request->video_url;
            $product->image_name = $request->video_name;
            $product->thumb_url = $request->thumb_url;
        } else {
            $product->url = $request->image_url;
            $product->image_name = $request->image_name;
            $product->thumb_name = $request->thumb_name;
            $product->thumb_url = $request->thumb_url;
        }
        $product->type = 2;

        $product->save();

        $receivers = [];

        if ($request->topicId) {
            $topicAttendance = TopicAttendance::where('user_id', $this->user->id)->where('topic_id', $request->topicId)->first();
            if ($topicAttendance) {
                $topicAttendance->product_id = $product->id;
                $topicAttendance->save();
                $topicAction = new TopicAction();
                $topicAction->topic_id = $request->topicId;
                $topicAction->user_id = $this->user->id;
                $topicAction->content = "Đã nộp bài";
                $topicAction->save();
            }
            $topic = Topic::find($request->topicId);
            $group = $topic->group;
            if ($group) {
                $class = $group->studyClass;
                if ($class) {
                    if ($class->teach) {
                        $receivers[] = $class->teach;
                    }
                    if ($class->assist) {
                        $receivers[] = $class->assist;
                    }
                    $this->send_save_product_topic_noti($receivers, $this->user, $topic, $class);
                }
            }

        }

        foreach ($product->colors as $color) {
            $color->delete();
        }

        $colorStr = $request->colorStr;
        $colors = explode("#", $colorStr);
        foreach ($colors as $c) {
            $color = new Color();
            $color->product_id = $product->id;
            $color->value = $c;
            $color->save();
        }


        return $this->respond(['message' => "Đăng bài thành công", "url" => convert_vi_to_en($product->title) . "-" . $product->id]);
    }

    public function update_user_info(Request $request)
    {
        $errors = [];
        $user1 = User::where('email', '=', $request->email)->first();
        if ($request->email != $this->user->email && $user1) {
            $errors['email'] = "Email đã có người sử dụng";
        }
        $username = trim($request->username);
        $user2 = User::where('username', '=', $username)->first();
        if ($username != $this->user->username && $user2) {
            $errors['username'] = "Username đã có người sử dụng";
        }

        if (!empty($errors)) {
            return $this->responseBadRequest($errors);
        }
        $this->user->name = $request->name;
        $this->user->phone = $request->phone;
        $this->user->email = $request->email;
        $this->user->university = $request->university;
        $this->user->work = $request->work;
        $this->user->address = $request->address;
        $this->user->how_know = $request->how_know;
        $this->user->username = $username;
        $this->user->description = $request->description;
        $this->user->facebook = $request->facebook;
        $this->user->gender = $request->gender;
        $this->user->dob = $request->dob;
        $this->user->save();
        return $this->respond([
            "message" => "Cập nhật thông tin thành công"
        ]);
    }

    public function request_cv()
    {
        $this->user->is_request_cv = 1;
        $this->user->save();
        return $this->respondSuccessWithStatus([]);
    }

    public function set_current_cv($cv_id)
    {
        $this->user->cv_id = $cv_id;
        $this->user->save();
        return $this->respondSuccessWithStatus([]);
    }

    public function cvs()
    {
        if ($this->user->is_request_cv == 0) {
            $this->user->is_request_cv = 1;
            $this->user->save();
        }
        $current_cv_id = $this->user->cv_id;
        $cvs = $this->user->cvs;
        return $this->respondSuccessWithStatus([
            "cvs" => $cvs->map(function ($cv) use ($current_cv_id) {
                return [
                    "id" => $cv->id,
                    "cv_id" => $cv->cv_id,
                    "cv_name" => $cv->cv_name,
                    "thumb_url" => $cv->thumb_url,
                    "url" => $cv->url,
                    "is_current_cv" => $current_cv_id == $cv->id
                ];
            })
        ]);
    }
}
