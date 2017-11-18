<?php

namespace Modules\Order\Http\Controllers;

use App\Good;
use App\Http\Controllers\ManageApiController;
use App\ImportedGoods;
use App\User;
use Illuminate\Http\Request;
use App\Order;

class ImportApiController extends ManageApiController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function allImportOrders(Request $request)
    {
        $limit = $request->limit ? $request->limit : 20;
        $keyword = trim($request->search);
        $startTime = $request->start_time;
        $endTime = $request->end_time;
        $status = $request->status;
        $staff_id = $request->staff_id;

        $importOrders = Order::where('type', 'import');
        if ($keyword) {
            $userIds = User::where(function ($query) use ($keyword) {
                $query->where('name', 'like', "%$keyword%")->orWhere('phone', 'like', "%$keyword%")->orWhere('email', 'like', "%$keyword%");
            })->select('id')->first();
            $importOrders = $importOrders->where('user_id', $userIds);
        }

        //$importOrders = $importOrders->where('code', 'like', "%$keyword%");
        if ($staff_id)
            $importOrders = $importOrders->where('staff_id', $staff_id);
        if ($startTime)
            $importOrders = $importOrders->whereBetween('created_at', array($startTime, $endTime));
        if ($status)
            $importOrders = $importOrders->where('status', $status);
        $importOrders = $importOrders->orderBy('created_at', 'desc')->paginate($limit);

        return $this->respondWithPagination(
            $importOrders,
            [
                'import_orders' => $importOrders->map(function ($importOrder) {
                    $total_money = $importOrder->importedGoods->reduce(function ($total, $importedGood) {
                        return $total + $importedGood->quantity * $importedGood->import_price;
                    }, 0);
                    $total_quantity = $importOrder->importedGoods->reduce(function ($total, $importedGood) {
                        return $total + $importedGood->quantity;
                    }, 0);
                    $debt = $total_money - $importOrder->orderPaidMoneys->reduce(function ($total, $orderPaidMoney) {
                            return $total + $orderPaidMoney->money;
                        }, 0);
                    $importOrderData = [
                        'id' => $importOrder->id,
                        'code' => $importOrder->code,
                        'status' => $importOrder->status,
                        'created_at' => format_vn_short_datetime(strtotime($importOrder->created_at)),
                        'import_price' => $importOrder->import_price,
                        'warehouse_id' => $importOrder->warehouse_id,
                        'total_money' => $total_money,
                        'total_quantity' => $total_quantity,
                        'debt' => $debt,
                    ];
                    if (isset($importOrder->staff)) {
                        $staff = [
                            'id' => $importOrder->staff->id,
                            'name' => $importOrder->staff->name,
                        ];
                        $importOrderData['staff'] = $staff;
                    }
                    if (isset($importOrder->user)) {
                        $user = [
                            'id' => $importOrder->user->id,
                            'name' => $importOrder->user->name,
                        ];
                        $importOrderData['user'] = $user;
                    }
                    return $importOrderData;
                })
            ]
        );
    }

    public function detailedImportOrder($importOrderId)
    {
        $importOrder = Order::find($importOrderId);
        $total_money = $importOrder->importedGoods->reduce(function ($total, $importedGood) {
            return $total + $importedGood->quantity * $importedGood->import_price;
        }, 0);
        $total_quantity = $importOrder->importedGoods->reduce(function ($total, $importedGood) {
            return $total + $importedGood->quantity;
        }, 0);
        $debt = $total_money - $importOrder->orderPaidMoneys->reduce(function ($total, $orderPaidMoney) {
                return $total + $orderPaidMoney->money;
            }, 0);
        $data = [
            'id' => $importOrder->id,
            'name' => $importOrder->name,
            'code' => $importOrder->code,
            'created_at' => format_vn_short_datetime(strtotime($importOrder->created_at)),
            'note' => $importOrder->note,
            'total_money' => $total_money,
            'total_quantity' => $total_quantity,
            'debt' => $debt,
        ];
        $data['imported_goods'] = $importOrder->importedGoods->map(function ($importedGood) {
            return [
                'name' => $importedGood->good->name,
                'code' => $importedGood->good->code,
                'quantity' => $importedGood->quantity,
                'import_price' => $importedGood->import_price
            ];
        });
        $data['order_paid_money'] = $importOrder->orderPaidMoneys->map(function ($orderPaidMoney) {
            return [
                'id' => $orderPaidMoney->id,
                'money' => $orderPaidMoney->money,
                'note' => $orderPaidMoney->note,
            ];
        });
        if (isset($importOrder->user)) {
            $user = [
                'id' => $importOrder->user->id,
                'name' => $importOrder->user->name,
            ];
            $data['user'] = $user;
        }
        return $this->respondSuccessWithStatus([
            'import_order' => $data,
        ]);
    }

    public function addImportedGood(Request $request)
    {
        $importedGood = new ImportedGoods;
        if ($request->order_import_id == null || Order::find($request->order_import_id) == null)
            return $this->respondErrorWithStatus([
                'message' => 'Không tồn tại đơn nhập hàng'
            ]);
        if ($request->good_id == null || Good::find($request->good_id) == null)
            return $this->respondErrorWithStatus([
                'message' => 'Không tồn tại sản phẩm'
            ]);
        if ($request->quantity == null)
            return $this->respondErrorWithStatus([
                'message' => 'Thiếu số lượng hàng'
            ]);
        if ($request->import_price == null)
            return $this->respondErrorWithStatus([
                'message' => 'Thiếu giá nhập hàng'
            ]);
        $importedGood->order_import_id = $request->order_import_id;
        $importedGood->good_id = $request->good_id;
        $importedGood->quantity = $request->quantity;
        $importedGood->import_price = $request->import_price;
        $importedGood->staff_id = Order::find($request->order_import_id)->staff->id;
        $importedGood->warehouse_id = Order::find($request->order_import_id)->warehouse->id;
        $importedGood->save();
        return $this->respondSuccessWithStatus([
            'message' => 'SUCCESS'
        ]);
    }
}