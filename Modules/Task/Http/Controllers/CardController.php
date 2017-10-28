<?php

namespace Modules\Task\Http\Controllers;

use App\CalendarEvent;
use App\Card;
use App\Http\Controllers\ManageApiController;
use App\Notification;
use App\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Modules\Task\Repositories\CardRepository;
use Modules\Task\Repositories\ProjectRepository;
use Modules\Task\Repositories\UserCardRepository;

class CardController extends ManageApiController
{
    protected $userCardRepository;
    protected $projectRepository;
    protected $cardRepository;

    public function __construct(
        CardRepository $cardRepository,
        UserCardRepository $userCardRepository,
        ProjectRepository $projectRepository)
    {
        parent::__construct();
        $this->userCardRepository = $userCardRepository;
        $this->projectRepository = $projectRepository;
        $this->cardRepository = $cardRepository;
    }

    public function changeRoleProjectMember($projectId, $memberId, $role)
    {
        $this->projectRepository->assignRoleMember($projectId, $memberId, $role, $this->user);
        return $this->respond(["status" => 1]);
    }

    public function assignMember($cardId, $userId)
    {
        $this->userCardRepository->assign($cardId, $userId, $this->user);
        return $this->respond(["status" => 1]);
    }

    public function assignProjectMember($projectId, $userId)
    {
        $this->projectRepository->assign($projectId, $userId, $this->user);
        return $this->respond(["status" => 1]);
    }

    public function updateCardDeadline($cardId, Request $request)
    {
        $card = Card::find($cardId);
        if (is_null($card)) {
            return $this->responseBadRequest("Thẻ không tồn tại");
        }
        if (is_null($request->deadline) || $request->deadline == "") {
            return $this->responseBadRequest("Thiếu hạn chót");
        }

        $card->deadline = format_time_to_mysql(strtotime($request->deadline));
        $card->save();

        $this->userCardRepository->updateCalendarEvent($cardId);

        $currentUser = $this->user;
        $project = $card->board->project;

        foreach ($card->assignees as $user) {

            if ($currentUser && $currentUser->id != $user->id) {

                $notification = new Notification;
                $notification->actor_id = $currentUser->id;
                $notification->card_id = $cardId;
                $notification->receiver_id = $user->id;
                $notification->type = 8;
                $message = $notification->notificationType->template;

                $message = str_replace('[[ACTOR]]', "<strong>" . $currentUser->name . "</strong>", $message);
                $message = str_replace('[[CARD]]', "<strong>" . $card->title . "</strong>", $message);
                $message = str_replace('[[PROJECT]]', "<strong>" . $project->title . "</strong>", $message);
                $notification->message = $message;

                $notification->color = $notification->notificationType->color;
                $notification->icon = $notification->notificationType->icon;
                $notification->url = '/project/' . $project->id . '/boards' . "?card_id=" . $cardId;

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


        return $this->respondSuccessWithStatus([
            "deadline_elapse" => time_remain_string(strtotime($card->deadline)),
            "deadline" => format_vn_short_datetime(strtotime($card->deadline)),
            "message" => "Sửa hạn chót thành công"
        ]);
    }

    public function card($cardId)
    {
        $data = $this->userCardRepository->loadCardDetail($cardId);
        return $this->respond($data);
    }

    public function updateCardTitle($cardId, Request $request)
    {
        if (is_null($request->title)) {
            return $this->responseBadRequest("Thiếu params");
        }

        $card = Card::find($cardId);
        $oldName = $card->title;
        $card->title = trim($request->title);
        $card->save();

        $currentUser = $this->user;
        $project = $card->board->project;

        foreach ($card->assignees as $user) {

            if ($currentUser && $currentUser->id != $user->id) {

                $notification = new Notification;
                $notification->actor_id = $currentUser->id;
                $notification->card_id = $cardId;
                $notification->receiver_id = $user->id;
                $notification->type = 12;
                $message = $notification->notificationType->template;

                $message = str_replace('[[ACTOR]]', "<strong>" . $currentUser->name . "</strong>", $message);
                $message = str_replace('[[CARD]]', "<strong>" . $oldName . "</strong>", $message);
                $message = str_replace('[[NAME]]', "<strong>" . $card->title . "</strong>", $message);
                $notification->message = $message;

                $notification->color = $notification->notificationType->color;
                $notification->icon = $notification->notificationType->icon;
                $notification->url = '/project/' . $project->id . '/boards' . "?card_id=" . $cardId;

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

        $this->userCardRepository->updateCalendarEvent($card->id);
        return $this->respondSuccessWithStatus(["message" => "success"]);
    }

    public function commentCard(Request $request, $cardId)
    {
        $content = $request->comment_content;
        $commenter_id = $this->user->id;

        if (is_null($content)) {
            return $this->respondErrorWithStatus("Params cần: comment_content, card_id");
        }
        $comment = $this->cardRepository->saveCardComment($content, $commenter_id, $cardId, $this->user);
        return $this->respondSuccessWithStatus(["comment" => $comment->transform()]);
    }

    public function archiveCards($projectId)
    {
        $project = Project::find($projectId);
        $board_ids = $project->boards()->pluck('id');
        $cards = Card::whereIn("board_id", $board_ids)->where("status", "close")->orderBy("updated_at", "desc")->paginate(10);
        return $this->respondWithPagination($cards, ["cards" => $cards->map(function ($card) {
            return $card->transform();
        })]);
    }

    public function getGoodPropertiesFilled($cardId, Request $request)
    {
        $card = Card::find($cardId);
        $goodProperties = collect(json_decode($request->good_properties));

        $properties = [];


        foreach ($card->good->properties as $property) {
            $properties[$property->name] = $property->value;
        }

        foreach ($goodProperties as &$goodProperty) {
            if (array_key_exists($goodProperty->name, $properties)) {
                $goodProperty["value"] = $properties[$goodProperty->name];
            }
        }

        return $this->respondSuccessWithStatus([
            "good_properties" => $goodProperties,
            "properties" => $properties
        ]);
    }

}
