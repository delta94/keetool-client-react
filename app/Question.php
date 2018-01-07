<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $table = 'questions';

    public function survey()
    {
        return $this->belongsTo('App\Survey', 'survey_id');
    }

    public function answers()
    {
        return $this->hasMany('App\Answer', 'question_id');
    }

    public function getData() {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'type' => $this->type,
            'order' => $this->order,
            'answers' => $this->answers->map(function ($answer){
                return $answer->getData();
            })
        ];
    }
}
