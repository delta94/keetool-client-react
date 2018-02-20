<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ItemOrder extends Model
{
    //
    protected $table = "item_orders";
    public function exportOrder(){
        return $this->hasMany(ExportOrder::class,'item_order_id');
    }
    public function company(){
        return $this->belongsTo(Company::class,'company_id');
    }
    public function transform(){
        return [
            "id" => $this->id,
            "company" =>[
                "id" => $this->company->id,
                "name" => $this->company->name,
            ],
            "command_code" => $this->command_code,
            "status" => $this->status,
            "goods" => $this->good->map(function($good){
                return $good->transform();
            })
        ];
    }
}
