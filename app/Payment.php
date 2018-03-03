<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    //
    protected $table = 'payments';

    public function payer()
    {
        return $this->belongsTo(Company::class, 'payer_id');
    }

    public function receiver()
    {
        return $this->belongsTo(Company::class, 'receiver_id');
    }
    public function staff()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function transform()
    {
        return [
            "id" => $this->id,
            "payer" => $this->payer ? $this->payer->transform() : [],
            "receiver" => $this->receiver ? $this->receiver->transform() : [],
            "description" => $this->description,
            "bill_image_url" => $this->bill_image_url,
            "money_value" => $this->money_value,
            "type" => $this->type,
            "status" => $this->status,
        ];
    }

    public function transform_for_up()
    {
        return [
            "id" => $this->id,
            "staff" => $this->staff ? [
                "id" => $this->staff->id,
                "username" => $this->staff->username,
                "phone" => $this->staff->phone,
                "avatar_url" => $this->staff->avatar_url,
                "name" => $this->staff->name,
             ]:[],
            "description" => $this->description,
            "money_value" => $this->money_value,
            "status" => $this->status,
        ];
    }
}
