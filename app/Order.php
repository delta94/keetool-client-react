<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';

    public function good()
    {
        return $this->belongsTo('App\Good', 'good_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function staff()
    {
        return $this->belongsTo('App\User', 'staff_id');
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id');
    }

    public function goodOrders()
    {
        return $this->hasMany(GoodOrder::class, 'order_id');
    }

    public function orderPaidMoneys()
    {
        return $this->hasMany(OrderPaidMoney::class, 'order_id');
    }

    public function importedGoods()
    {
        return $this->hasMany(ImportedGoods::class, 'order_import_id');
    }

    public function goods()
    {
        return $this->belongsToMany(Good::class,
            "good_order",
            "order_id",
            "good_id")->withPivot("quantity", "price");
    }

    public function ship_infor()
    {
        return $this->belongsTo(ShipInfor::class, 'ship_infor_id');
    }

    public function transform()
    {
        $goodOrders = $this->goodOrders->map(function ($goodOrder) {
            $goodOrderData = [
                'id' => $goodOrder->id,
                'price' => $goodOrder->price,
                'quantity' => $goodOrder->quantity,
                'name' => $goodOrder->good->name,
                'code' => $goodOrder->good->code,
            ];
            if ($goodOrder->discount_money)
                $goodOrderData['discount_money'] = $goodOrder->discount_money;
            if ($goodOrder->discount_percent)
                $goodOrderData['discount_percent'] = $goodOrder->discount_percent;
            return $goodOrderData;
        });
        $data = [
            'id' => $this->id,
            'label_id' => $this->label_id,
            'code' => $this->code,
            'payment' => $this->payment,
            'created_at' => format_vn_short_datetime(strtotime($this->created_at)),
            'status' => $this->status,
            'total' => $this->goodOrders->reduce(function ($total, $goodOrder) {
                return $total + $goodOrder->price * $goodOrder->quantity;
            }, 0),
            'paid' => $this->orderPaidMoneys->reduce(function ($paid, $orderPaidMoney) {
                return $paid + $orderPaidMoney->money;
            }, 0),
            'debt' => $this->goodOrders->reduce(function ($total, $goodOrder) {
                    return $total + $goodOrder->price * $goodOrder->quantity;
                }, 0) - $this->orderPaidMoneys->reduce(function ($paid, $orderPaidMoney) {
                    return $paid + $orderPaidMoney->money;
                }, 0),
        ];
        if ($goodOrders)
            $data['good_orders'] = $goodOrders;
        if ($this->staff)
            $data['staff'] = [
                'id' => $this->staff->id,
                'name' => $this->staff->name,
            ];
        if ($this->warehouse)
            if ($this->warehouse->base)
                $data['base'] = [
                    'name' => $this->warehouse->base->name,
                    'address' => $this->warehouse->base->address,
                ];
        if ($this->user) {
            $data['customer'] = [
                'name' => $this->user->name,
                'address' => $this->user->address,
                'phone' => $this->user->phone,
                'email' => $this->user->email,
            ];
        }
        if ($this->ship_infor) {
            $data['ship_infor'] = [
                'name' => $this->ship_infor->name,
                'phone' => $this->ship_infor->phone,
                'province' => $this->ship_infor->province,
                'district' => $this->ship_infor->district,
                'address' => $this->ship_infor->address,
            ];
        }
        return $data;
    }

    public function detailedTransform()
    {
        $data = [
            'code' => $this->code,
            'created_at' => format_vn_short_datetime(strtotime($this->created_at)),
            'note' => $this->note,
            'payment' => $this->payment,
            'status' => $this->status,
            'good_orders' => $this->goodOrders->map(function ($goodOrder) {
                $goodOrderData = [
                    'id' => $goodOrder->id,
                    'price' => $goodOrder->price,
                    'quantity' => $goodOrder->quantity,
                    'name' => $goodOrder->good->name,
                    'code' => $goodOrder->good->code,
                ];
                if ($goodOrder->discount_money)
                    $goodOrderData['discount_money'] = $goodOrder->discount_money;
                if ($goodOrder->discount_percent)
                    $goodOrderData['discount_percent'] = $goodOrder->discount_percent;
                return $goodOrderData;
            }),
            'paid_history' => $this->orderPaidMoneys->map(function ($orderPaidMoney) {
                return [
                    "id" => $orderPaidMoney->id,
                    "money" => $orderPaidMoney->money,
                    "note" => $orderPaidMoney->note,
                    "order_id" => $orderPaidMoney->order_id,
                    "payment" => $orderPaidMoney->payment,
                    "created_at" => format_full_time_date($orderPaidMoney->created_at)
                ];
            })
        ];
        if ($this->staff)
            $data['staff'] = [
                'id' => $this->staff->id,
                'name' => $this->staff->name,
            ];
        if ($this->warehouse)
            if ($this->warehouse->base)
                $data['base'] = [
                    'name' => $this->warehouse->base->name,
                    'address' => $this->warehouse->base->address,
                ];
        if ($this->user) {
            $data['customer'] = [
                'name' => $this->user->name,
                'address' => $this->user->address,
                'phone' => $this->user->phone,
                'email' => $this->user->email,
            ];
        } else {
            $data['customer'] = [
                'name' => $this->name,
                'address' => $this->address,
                'phone' => $this->phone,
                'email' => $this->email,
            ];
        }
        return [
            'total' => $this->goodOrders->reduce(function ($total, $goodOrder) {
                return $total + $goodOrder->price * $goodOrder->quantity;
            }, 0),
            'paid' => $this->orderPaidMoneys->reduce(function ($paid, $orderPaidMoney) {
                return $paid + $orderPaidMoney->money;
            }, 0),
            'debt' => $this->goodOrders->reduce(function ($total, $goodOrder) {
                    return $total + $goodOrder->price * $goodOrder->quantity;
                }, 0) - $this->orderPaidMoneys->reduce(function ($paid, $orderPaidMoney) {
                    return $paid + $orderPaidMoney->money;
                }, 0),
            'order' => $data,
        ];
    }
}
