<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = "events";

    public function creator(){
        return $this->belongsTo(User::class,'user_id');
    }
    public function getData()
    {
        return [
            "name" => $this->name,
            "id" => $this->id,
            "address" => $this->address,
            "detail" => $this->detail,
            "status" => $this->status,
            "cover_url" => $this->cover_url,
            "avatar_url" => $this->avatar_url,
            "slug" => $this->slug,
            "creator" => $this->creator->getData(),
        ];
    }
}

