<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\CheckInCheckOut\Entities\Wifi;

class Base extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    protected $table = 'bases';

    public function rooms()
    {
        return $this->hasMany('App\Room', 'base_id');
    }

    public function classes()
    {
        return $this->hasMany('App\StudyClass', 'base_id');
    }

    public function wifis()
    {
        return $this->hasMany(Wifi::class, "base_id");
    }
}
