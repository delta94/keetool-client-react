<?php

namespace Modules\Base\Http\Controllers;

use App\Base;
use App\District;
use App\Http\Controllers\NoAuthApiController;
use App\Product;
use App\Province;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Room;
use App\RoomServiceRegisterRoom;

class PublicApiController extends NoAuthApiController
{
    public function provinces()
    {
        $provinceIds = Base::join('district', DB::raw('CONVERT(district.districtid USING utf32)'), '=', DB::raw('CONVERT(bases.district_id USING utf32)'))
            ->select('district.provinceid as province_id')->pluck('province_id')->toArray();
        $provinceIds = collect(array_unique($provinceIds));
        return $this->respondSuccessWithStatus([
            'provinces' => $provinceIds->map(function ($provinceId) {
                $province = Province::find($provinceId);
                return $province->transform();
            })->values()
        ]);
    }

    public function basesInProvince($provinceId, Request $request)
    {
        $districtIds = District::join('province', 'province.provinceid', '=', 'district.provinceid')
            ->where('province.provinceid', $provinceId)->select('district.*')->pluck('districtid');
        $bases = Base::whereIn('district_id', $districtIds);
        $bases = $bases->where('name', 'like', '%' . trim($request->search) . '%');
        $bases = $bases->get();
        return $this->respondSuccessWithStatus([
            'bases' => $bases->map(function ($base) {
                return $base->transform();
            })
        ]);
    }

    public function bases(Request $request)
    {
        $bases = Base::query();
        $bases = $bases->where('name', 'like', '%' . trim($request->search) . '%');
        $bases = $bases->get();
        return $this->respondSuccessWithStatus([
            'bases' => $bases->map(function ($base) {
                return $base->transform();
            })
        ]);
    }

    public function baseRooms($baseId, Request $request)
    {
        $base = Base::find($baseId);
        $to = $request->end_time;
        $from = $request->start_time;
        $bookedRoomIds = RoomServiceRegisterRoom::orderBy('created_at', 'desc')
            ->where(function ($query) use ($to, $from) {
                $query->where(function ($query) use ($to) {
                    $query->where('start_time', '<', $to)
                        ->where('end_time', '>', $to);
                })
                    ->orWhere(function ($query) use ($from) {
                        $query->where('start_time', '<', $from)
                            ->where('end_time', '>', $from);
                    })
                ->orWhere(function ($query) use ($from, $to) {
                    $query->where('start_time', '>=', $from)
                        ->where('end_time', '<=', $to);
                });
            })->groupBy('room_id')->pluck('room_id')->toArray();

        $rooms = Room::whereNotIn('id', $bookedRoomIds)->get();

        return $this->respondSuccessWithStatus([
            'rooms' => $rooms->map(function ($room) {
                return $room->getData();
            }),
            'count' => $rooms->count()
        ]);
    }

    public function getAllBlogs(Request $request)
    {
        $limit = $request->limit ? $request->limit : 6;
        $blogs = Product::where('type', 2)->orderBy('created_at', 'desc');
        $blogs = $blogs->where('title', 'like', '%' . trim($request->search) . '%');
        $blogs = $blogs->paginate(6);
        return $this->respondWithPagination($blogs, ['blogs' => $blogs->map(function ($blog) {
            $data = $blog->blogTransform();
            $data['status'] = $blog->status;
            return $data;
        })]);
    }

    public function getDetailBlog($id)
    {
        $product = Product::find($id);
        if ($product == null) {
            return $this->respondErrorWithStatus('Bài viết không tồn tại');
        }
        return $this->respondSuccessWithStatus([
            'product' => $product->blogDetailTransform()
        ]);
    }
}
