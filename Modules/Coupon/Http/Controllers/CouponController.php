<?php

namespace Modules\Coupon\Http\Controllers;

use App\Coupon;
use App\Http\Controllers\ManageApiController;
use Illuminate\Http\Request;

class CouponController extends ManageApiController
{
    public function createCoupon(Request $request)
    {
        $name = trim($request->name);
        $description = $request->description;
        $discount_type = $request->discount_type; //percentage, fix
        $discount_value = $request->discount_value;
        $type = $request->type; //code, program
        $quantity = $request->quantity; //dùng column trong bảng để chứa quantity vì lúc migrate éo đc -.-
        $used_for = trim($request->used_for); //all, order, good, category, customer
        $order_value = $request->order_value;
        $good_id = $request->good_id;
        $customer_id = $request->customer_id;
        $category_id = $request->category_id;
        $start_time = $request->start_time;
        $end_time = $request->end_time;

        $coupon = new Coupon;

        if ($name == null || $discount_type == null || $discount_value == null || $type == null || $used_for == null ||
            ($used_for == 'order' && $order_value == null) ||
            ($used_for == 'good' && $good_id == null) ||
            ($used_for == 'category' && $category_id == null) ||
            ($used_for == 'customer' && $customer_id == null))
            return $this->respondErrorWithStatus([
                'message' => 'missing params'
            ]);
        $coupon->name = $name;
        $coupon->description = $description;
        $coupon->discount_type = $discount_type;
        $coupon->discount_value = $discount_value;
        $coupon->used_for = $used_for;
        $coupon->type = $type;
        $coupon->order_value = $order_value;
        $coupon->good_id = $good_id;
        $coupon->customer_id = $customer_id;
        $coupon->category_id = $category_id;
        $coupon->start_time = $start_time;
        $coupon->end_time = $end_time;
        $coupon->rate = $quantity;
        $coupon->save();

        return $this->respondSuccessWithStatus([
            'message' => 'SUCCESS'
        ]);
    }

    public function deleteCoupon($couponId)
    {
        $coupon = Coupon::find($couponId);
        if ($coupon == null)
            return $this->respondErrorWithStatus([
                'message' => 'non-existing coupon'
            ]);
        $coupon->delete();
        return $this->respondSuccessWithStatus([
            'message' => 'SUCCESS'
        ]);
    }

    public function allCoupons(Request $request)
    {
        $limit = $request->limit ? $request->limit : 20;

        $coupons = Coupon::query();
        $coupons = $coupons->orderBy('created_at', 'desc')->paginate($limit);
        return $this->respondWithPagination($coupons,
            [
                'coupons' => $coupons->map(function ($coupon) {
                    $data = [
                        'name' => $coupon->name,
                        'description' => $coupon->description,
                        'discount_type' => $coupon->discount_type,
                        'discount_value' => $coupon->discount_type,
                        'type' => $coupon->type,
                        'used_for' => $coupon->used_for,
                        'quantity' => $coupon->rate,
                        'start_time' => $coupon->start_time,
                        'end_time' => $coupon->end_time,
                    ];
                    if($coupon->used_for == 'order')
                        $data['order_value'] = $coupon->order_value;
                    if($coupon->used_for == 'good')
                        $data['good'] = [
                            'id' => $coupon->good_id,
                            'name' => $coupon->good->name,
                        ];
                    if($coupon->used_for == 'customer')
                        $data['good'] = [
                           'id' => $coupon->customer_id,
                           'name' => $coupon->user->name
                        ];
                    if($coupon->used_for == 'category')
                        $data['good'] = [
                            'id' => $coupon->customer_id,
                            'name' => $coupon->goodCategory->name
                        ];
                    return $data;
                })
            ]);
    }
}
