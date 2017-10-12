<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Modules\Good\Entities\GoodPropertyItem;
use Modules\Task\Entities\TaskList;

class Task extends Model
{
    public function taskList()
    {
        return $this->belongsTo(TaskList::class, 'task_list_id');
    }

    public function member()
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function editor()
    {
        return $this->belongsTo(User::class, 'editor_id');
    }

    public function goodPropertyItems()
    {
        return $this->belongsToMany(GoodPropertyItem::class, 'good_property_item_task','task_id','good_property_item_id');
    }

    public function transform()
    {
        $data = [
            "title" => $this->title,
            "status" => $this->status,
            "id" => $this->id,
            "span" => $this->span,
            "good_property_items" => $this->goodPropertyItems,
            "task_list_id" => $this->task_list_id,
            "order" => $this->order,
            "current_board_id" => $this->current_board_id,
            "target_board_id" => $this->target_board_id
        ];
        if ($this->deadline && $this->deadline != "0000-00-00 00:00:00") {
            $data["deadline_str"] = time_remain_string(strtotime($this->deadline));
            $data["deadline"] = date("H:i d-m-Y", strtotime($this->deadline));
        }
        if ($this->member) {
            $data["member"] = [
                "id" => $this->member->id,
                "name" => $this->member->name,
                "avatar_url" => generate_protocol_url($this->member->avatar_url),
            ];
        }
        return $data;
    }
}
