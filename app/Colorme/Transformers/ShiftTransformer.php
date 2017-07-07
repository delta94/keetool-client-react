<?php
/**
 * Created by PhpStorm.
 * User=> caoanhquan
 * Date=> 7/30/16
 * Time=> 19=>02
 */

namespace App\Colorme\Transformers;


class ShiftTransformer extends Transformer
{


    public function transform($shift)
    {
        $user = $shift->user;
        if ($user) {
            $user = [
                'id' => $shift->user->id,
                'name' => $shift->user->name,
                'color' => $shift->user->color,
                'avatar_url' => $shift->user->avatar_url ? $shift->user->avatar_url : url('img/user.png')
            ];
        }
        return [
            'id' => $shift->id,
            "name" => $shift->shift_session->name,
            'user' => $user,
            'base' => ['name' => $shift->base->name, 'address' => $shift->base->address],
            'start_time' => format_time_shift(strtotime($shift->shift_session->start_time)),
            'end_time' => format_time_shift(strtotime($shift->shift_session->end_time))
        ];
    }
}