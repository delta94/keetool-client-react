<?php

namespace Modules\Base\Http\Controllers;

use App\Base;
use App\District;
use App\Http\Controllers\ManageApiController;
use App\Province;
use App\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ManageBaseApiController extends ManageApiController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function provinces()
    {
        $provinceIds = Base::join("district", DB::raw("CONVERT(district.districtid USING utf32)"), "=", DB::raw("CONVERT(bases.district_id USING utf32)"))
            ->select("district.provinceid as province_id")->pluck("province_id")->toArray();
        $provinceIds = collect(array_unique($provinceIds));
        return $this->respondSuccessWithStatus([
            "provinces" => $provinceIds->map(function ($provinceId) {
                $province = Province::find($provinceId);
                return $province->transform();
            })->values()
        ]);
    }

    public function basesInProvince($provinceId)
    {
        $districtIds = District::join("province", "province.provinceid", "=", "district.provinceid")
            ->where("province.provinceid", $provinceId)->select("district.*")->pluck("districtid");
        $bases = Base::whereIn("district_id", $districtIds)->get();
        return $this->respondSuccessWithStatus([
            "bases" => $bases->map(function ($base) {
                return $base->transform();
            })
        ]);
    }

    public function getBases(Request $request)
    {

    }

    public function createBase(Request $request)
    {
        if ($request->name == null || trim($request->name) == '')
            return $this->respondErrorWithStatus([
                'message' => 'Thiếu tên cơ sở'
            ]);
        $base = new Base;
        $base->name = $request->name;
        $base->center = $request->center ? $request->center : 0;
        $base->longtitude = $request->longtitude;
        $base->latitude = $request->latitude;
        $base->avatar_url = $request->avatar_url;
        $base->district_id = $request->district_id;
        $base->display_status = $request->display_status;
        $base->images_url = $request->images_url;
        $base->description = $request->description;
        $base->save();

        return $this->respondSuccessWithStatus([
            'message' => 'SUCCESS'
        ]);
    }
    public function editBase($baseId, Request $request)
    {
        if ($request->name == null || trim($request->name) == '')
            return $this->respondErrorWithStatus([
                'message' => 'Thiếu tên cơ sở'
            ]);
        $base = Base::find($baseId);
        if($base == null)
            return $this->respondErrorWithStatus([
                'message' => 'Không tồn tại cơ sở'
            ]);
        $base->name = $request->name;
        $base->center = $request->center ? $request->center : 0;
        $base->longtitude = $request->longtitude;
        $base->latitude = $request->latitude;
        $base->avatar_url = $request->avatar_url;
        $base->district_id = $request->district_id;
        $base->display_status = $request->display_status;
        $base->images_url = $request->images_url;
        $base->description = $request->description;
        $base->save();

        return $this->respondSuccessWithStatus([
            'message' => 'SUCCESS'
        ]);
    }

    public function createRoom($baseId, Request $request)
    {
        if ($request->name == null || trim($request->name) == '')
            return $this->respondErrorWithStatus([
                'message' => 'Thiếu tên phòng'
            ]);
        $room = new Room;
        $room->name = $request->name;
        $room->base_id = $baseId;
        $room->type = $request->type;
        $room->seats_count = $request->seats_count;
        $room->images_url = $request->images_url;
        $room->save();
        return $this->respondSuccessWithStatus([
            'message' => 'SUCCESS'
        ]);
    }

    public function editRoom($baseId, $roomId, Request $request)
    {
        if ($request->name == null || trim($request->name) == '')
            return $this->respondErrorWithStatus([
                'message' => 'Thiếu tên phòng'
            ]);
        $room = Room::find($roomId);
        if ($room == null)
            return $this->respondErrorWithStatus([
                'message' => 'Không tồn tại phòng'
            ]);
        $room->name = $request->name;
        $room->base_id = $baseId;
        $room->type = $request->type;
        $room->seats_count = $request->seats_count;
        $room->images_url = $request->images_url;
        $room->save();
        return $this->respondSuccessWithStatus([
            'message' => 'SUCCESS'
        ]);
    }


}
