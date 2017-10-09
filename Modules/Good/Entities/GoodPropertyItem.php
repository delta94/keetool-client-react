<?php

namespace Modules\Good\Entities;

use App\Task;
use App\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GoodPropertyItem extends Model
{
    use SoftDeletes;
    protected $table = "good_property_items";

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'good_property_item_task', 'good_property_item_id','task_id');
    }

    public function transform()
    {
        return [
            "name" => $this->name,
            "prevalue" => $this->prevalue,
            "preunit" => $this->preunit,
            "type" => $this->type,
            "creator" => [
                "id" => $this->creator->id,
                "name" => $this->creator->name,
                "email" => $this->creator->email
            ]
        ];
    }
}
