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

    public function transform()
    {
        return [
            "id" => $this->id,
            "payer" => $this->payer->transform(),
            "receiver" => $this->receiver->transform(),
            "description" => $this->description,
            "bill_image_url" => $this->bill_image_url,
            "money_value" => $this->money_value,
            "type" => $this->type,
        ];
    }
}
