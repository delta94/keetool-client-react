<?php

namespace Modules\Order\Http\Controllers;

use App\Colorme\Transformers\DeliveryOrderTransformer;
use App\Good;
use App\HistoryGood;
use App\ImportedGoods;
use App\Order;
use App\OrderPaidMoney;
use App\Register;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\ManageApiController;
use Illuminate\Support\Facades\Hash;
use Modules\Good\Entities\GoodProperty;
use Modules\Order\Repositories\OrderService;

class DeliveryOrderApiController extends ManageApiController
{
    private $deliveryOrderTransformer;

    public function __construct(DeliveryOrderTransformer $deliveryOrderTransformer, OrderService $orderService)
    {
        parent::__construct();

        $this->deliveryOrderTransformer = $deliveryOrderTransformer;
        $this->orderService = $orderService;
    }

    public function assignDeliveryOrderInfo(&$order, $request)
    {
        $order->note = $request->note;
        $order->code = $request->code;
        $order->staff_id = $this->user->id;
        $order->attach_info = $request->attach_info;
        $order->quantity = $request->quantity;
        $order->price = $request->price;
        $order->email = $request->email;
        $order->status = $request->status ? $request->status : 'place_order';

        $user = User::where('phone', $request->phone)->first();
        if ($user == null) {
            $user = new User;
            $user->password = Hash::make($request->phone);
        }

        $user->name = $request->name ? $request->name : $request->phone;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->save();

        $order->user_id = $user->id;
    }

    public function getDeliveryOrders(Request $request)
    {
        $limit = $request->limit ? $request->limit : 20;
        $keyWord = $request->search;

        $deliveryOrders = Order::where('type', 'delivery');
        //queries
        if ($keyWord) {
            $userIds = User::where(function ($query) use ($keyWord) {
                $query->where("name", "like", "%$keyWord%")->orWhere("phone", "like", "%$keyWord%");
            })->pluck('id')->toArray();
            $deliveryOrders = $deliveryOrders->where(function ($query) use ($keyWord, $userIds) {
                $query->whereIn('user_id', $userIds)->orWhere("code", "like", "%$keyWord%")->orWhere("email", "like", "%$keyWord%");
            });
        }

        if ($request->staff_id)
            $deliveryOrders = $deliveryOrders->where('staff_id', $request->staff_id);
        if ($request->start_time)
            $deliveryOrders = $deliveryOrders->whereBetween('created_at', array($request->start_time, $request->end_time));
        if ($request->status)
            $deliveryOrders = $deliveryOrders->where('status', $request->status);
        if ($request->user_id)
            $deliveryOrders = $deliveryOrders->where('user_id', $request->user_id);

        if ($limit == -1) {
            $deliveryOrders = $deliveryOrders->orderBy('created_at', 'desc')->get();
            return $this->respondSuccessWithStatus([
                'delivery_orders' => $this->deliveryOrderTransformer->transformCollection($deliveryOrders)
            ]);
        }
        $deliveryOrders = $deliveryOrders->orderBy('created_at', 'desc')->paginate($limit);

        return $this->respondWithPagination(
            $deliveryOrders,
            [
                'delivery_orders' => $this->deliveryOrderTransformer->transformCollection($deliveryOrders)
            ]
        );
    }

    public function infoDeliveryOrders(Request $request)
    {
        $keyWord = $request->search;

        $deliveryOrders = Order::where('type', 'delivery');
        //queries
        if ($keyWord) {
            $userIds = User::where(function ($query) use ($keyWord) {
                $query->where("name", "like", "%$keyWord%")->orWhere("phone", "like", "%$keyWord%");
            })->pluck('id')->toArray();
            $deliveryOrders = $deliveryOrders->where('type', 'order')->where(function ($query) use ($keyWord, $userIds) {
                $query->whereIn('user_id', $userIds)->orWhere("code", "like", "%$keyWord%")->orWhere("email", "like", "%$keyWord%");
            });
        }

        if ($request->staff_id)
            $deliveryOrders = $deliveryOrders->where('staff_id', $request->staff_id);
        if ($request->start_time)
            $deliveryOrders = $deliveryOrders->whereBetween('created_at', array($request->start_time, $request->end_time));
        if ($request->status)
            $deliveryOrders = $deliveryOrders->where('status', $request->status);
        if ($request->user_id)
            $deliveryOrders = $deliveryOrders->where('user_id', $request->user_id);

        $deliveryOrders = $deliveryOrders->orderBy('created_at', 'desc')->get();

        return $this->respondSuccessWithStatus([
            'total_delivery_orders' => 10,
            'not_locked' => 2,
            'total_money' => 15000000,
            'total_paid_money' => 10000000
        ]);
    }

    public function createDeliveryOrder(Request $request)
    {
        $request->code = $request->code ? $request->code :
            'DELIV' . rebuild_date('Ymd', strtotime(Carbon::now()->toDateTimeString())) . str_pad($this->orderService->getTodayOrderId('delivery') + 1, 4, '0', STR_PAD_LEFT);
        if ($request->phone == null || $request->email == null)
            return $this->respondErrorWithStatus([
                'message' => 'Thiếu thông tin người dùng'
            ]);

        $order = new Order;
        $this->assignDeliveryOrderInfo($order, $request);
        $order->status = 'place_order';
        $order->type = 'delivery';
        $order->save();
        return $this->respondSuccessWithStatus(['message' => 'SUCCESS']);
    }

    public function editDeliveryOrder($orderId, Request $request)
    {
        if ($request->phone == null || $request->email == null)
            return $this->respondErrorWithStatus([
                'message' => 'Thiếu thông tin người dùng'
            ]);

        $order = Order::find($orderId);
        $request->code = $order->code;
        if ($order == null)
            return $this->respondErrorWithStatus([
                'message' => 'Không tồn tại đơn hàng'
            ]);
        $this->assignDeliveryOrderInfo($order, $request);
        $order->save();

        return $this->respondSuccessWithStatus(['message' => 'SUCCESS']);
    }

    public function getDetailedDeliveryOrder($deliveryOrderId, Request $request)
    {
        $deliveryOrder = Order::find($deliveryOrderId);
        if ($deliveryOrder == null)
            return $this->respondErrorWithStatus('Không tồn tại đơn đặt hàng');
        return $this->respondSuccessWithStatus([
            'delivery_order' => $this->deliveryOrderTransformer->transform($deliveryOrder)
        ]);
    }

    public function deleteDeliveryOrder($deliveryOrderId)
    {
        $deliveryOrder = Order::find($deliveryOrderId);
        if ($deliveryOrder == null)
            return $this->respondErrorWithStatus('Không tồn tại đơn đặt hàng');
        $deliveryOrder->delete();
        return $this->respondSuccessWithStatus([
            'message' => 'SUCCESS'
        ]);
    }

    public function changeNote($deliveryOrderId, Request $request)
    {
        $order = Order::find($deliveryOrderId);
        if ($order == null)
            return $this->respondErrorWithStatus('Không tồn tại đơn đặt hàng');
        $order->note = $request->note == null ? '' : $request->note;
        $order->save();
        return $this->respondSuccessWithStatus([
            'message' => 'SUCCESS'
        ]);
    }

    public function deliveryInventories(Request $request)
    {
        $limit = $request->limit ? $request->limit : 20;
        $keyWord = $request->search;

        $deliveryOrders = Order::where('type', 'delivery')->where('delivery_warehouse_status', 'arrived');
        if ($keyWord) {
            $userIds = User::where(function ($query) use ($keyWord) {
                $query->where("name", "like", "%$keyWord%")->orWhere("phone", "like", "%$keyWord%");
            })->pluck('id')->toArray();
            $deliveryOrders = $deliveryOrders->where(function ($query) use ($keyWord, $userIds) {
                $query->whereIn('user_id', $userIds)->orWhere("code", "like", "%$keyWord%")->orWhere("email", "like", "%$keyWord%");
            });
        }

        if ($request->staff_id)
            $deliveryOrders = $deliveryOrders->where('staff_id', $request->staff_id);
        if ($request->start_time)
            $deliveryOrders = $deliveryOrders->whereBetween('created_at', array($request->start_time, $request->end_time));
        if ($request->user_id)
            $deliveryOrders = $deliveryOrders->where('user_id', $request->user_id);

        if ($limit == -1) {
            $deliveryOrders = $deliveryOrders->orderBy('created_at', 'desc')->get();
            return $this->respondSuccessWithStatus([
                'delivery_orders' => $this->deliveryOrderTransformer->transformCollection($deliveryOrders)
            ]);
        }
        $deliveryOrders = $deliveryOrders->orderBy('created_at', 'desc')->paginate($limit);

        return $this->respondWithPagination(
            $deliveryOrders,
            [
                'delivery_orders' => $this->deliveryOrderTransformer->transformCollection($deliveryOrders)
            ]
        );
    }

    public function deliveryInventoriesInfo(Request $request)
    {
        $limit = $request->limit ? $request->limit : 20;
        $keyWord = $request->search;

        $deliveryOrders = Order::where('type', 'delivery')->where('delivery_warehouse_status', 'imported');
        if ($keyWord) {
            $userIds = User::where(function ($query) use ($keyWord) {
                $query->where("name", "like", "%$keyWord%")->orWhere("phone", "like", "%$keyWord%");
            })->pluck('id')->toArray();
            $deliveryOrders = $deliveryOrders->where(function ($query) use ($keyWord, $userIds) {
                $query->whereIn('user_id', $userIds)->orWhere("code", "like", "%$keyWord%")->orWhere("email", "like", "%$keyWord%");
            });
        }

        if ($request->staff_id)
            $deliveryOrders = $deliveryOrders->where('staff_id', $request->staff_id);
        if ($request->start_time)
            $deliveryOrders = $deliveryOrders->whereBetween('created_at', array($request->start_time, $request->end_time));
        if ($request->user_id)
            $deliveryOrders = $deliveryOrders->where('user_id', $request->user_id);

        if ($limit == -1) {
            $deliveryOrders = $deliveryOrders->orderBy('created_at', 'desc')->get();
            return $this->respondSuccessWithStatus([
                'delivery_orders' => $this->deliveryOrderTransformer->transformCollection($deliveryOrders)
            ]);
        }
        $deliveryOrders = $deliveryOrders->orderBy('created_at', 'desc')->get();

        $totalQuantity = $deliveryOrders->reduce(function ($total, $deliveryOrder) {
            return $total + $deliveryOrder->quantity;
        }, 0);
        $totalMoney = $deliveryOrders->reduce(function ($total, $deliveryOrder) {
            return $total + $deliveryOrder->quantity * $deliveryOrder->price;
        }, 0);
        return $this->respondSuccessWithStatus([
            'total_quantity' => $totalQuantity,
            'total_money' => $totalMoney,
        ]);
    }

    public function changeStatus($deliveryOrderId, Request $request)
    {
        $response = $this->orderService->changeDeliveryOrderStatus($deliveryOrderId, $request, $this->user->id);
        if ($response['status'] == 0)
            return $this->respondErrorWithStatus([
                'message' => $response['message']
            ]);
        return $this->respondSuccessWithStatus([
            'message' => $response['message']
        ]);
    }

    public function importDeliveryOrder($deliveryOrderId, Request $request)
    {
        $deliveryOrder = Order::find($deliveryOrderId);
        if ($deliveryOrder == null)
            return $this->respondErrorWithStatus('Không tìm thấy đơn nhập');
        if ($request->warehouse_id == null)
            return $this->respondErrorWithStatus('Cần phải chọn kho hàng để nhập');
        if ($request->name == null || $request->code == null) {
            return $this->respondErrorWithStatus("Sản phẩm cần có: name, code");
        }
        if (!$deliveryOrder->delivery_warehouse_status == 'arrived')
            return $this->respondErrorWithStatus('Hàng chưa về, đã xuất hoặc đã chuyển kho');
        $good = new Good;
        $good->name = trim($request->name);
        $good->code = trim($request->code);
        $good->description = $request->description;
        $good->avatar_url = $request->avatar_url;
        $good->cover_url = $request->cover_url;
        $good->sale_status = $request->sale_status ? $request->sale_status : 0;
        $good->highlight_status = $request->highlight_status ? $request->highlight_status : 0;
        $good->display_status = $request->display_status ? $request->display_status : 0;
        $good->manufacture_id = $request->manufacture_id;
        $good->good_category_id = $request->good_category_id;
        $good->price = $deliveryOrder->price;
        $good->barcode = $request->barcode;
        $good->save();

        $property = new GoodProperty();
        $property->name = 'images_url';
        $property->value = $request->images_url ? $request->images_url : '';
        $property->good_id = $good->id;
        $property->editor_id = $this->user->id;
        $property->save();

        $importOrder = new Order;
        $importOrder->code = $request->code ? $request->code : 'IMPORT' . rebuild_date('Ymd', strtotime(Carbon::now()->toDateTimeString()));
        $importOrder->note = $request->note;
        $importOrder->warehouse_id = $request->warehouse_id;
        $importOrder->staff_id = $this->user->id;
        $importOrder->user_id = 0;
        $importOrder->type = 'import';
        $importOrder->status = 'completed';
        $importOrder->save();

        $importedGood = new ImportedGoods;
        $importedGood->order_import_id = $importOrder->id;
        $importedGood->good_id = $good->id;
        $importedGood->quantity = $deliveryOrder->quantity;
        $importedGood->import_quantity = $deliveryOrder->quantity;
        $importedGood->import_price = $deliveryOrder->price;
        $importedGood->status = 'completed';
        $importedGood->staff_id = $this->user->id;
        $importedGood->warehouse_id = $request->warehouse_id;
        $importedGood->save();

        $historyGood = new HistoryGood;
        $lastest_good_history = HistoryGood::where('good_id', $good->id)->orderBy('created_at', 'desc')->first();
        $remain = $lastest_good_history ? $lastest_good_history->remain : 0;
        $historyGood->good_id = $good->id;
        $historyGood->quantity = $deliveryOrder->quantity;
        $historyGood->remain = $remain + $deliveryOrder->quantity;
        $historyGood->warehouse_id = $request->warehouse_id;
        $historyGood->type = 'import';
        $historyGood->order_id = $importOrder->id;
        $historyGood->imported_good_id = $importedGood->id;
        $historyGood->save();
        $deliveryOrder->delivery_warehouse_status = 'transfered';
        return $this->respondSuccess('Nhập kho hàng sẵn thành công');
    }

    public function sendPrice(Request $request)
    {
        $deliveryOrders = json_decode($request->delivery_orders);
        foreach ($deliveryOrders as $deliveryOrder) {
            $order = Order::find($deliveryOrder->id);
            if ($order == null)
                return $this->respondErrorWithStatus('Không tồn tại đơn có id ' . $deliveryOrder->id);
            if ($order->status != 'place_order')
                return $this->respondErrorWithStatus('Không thể báo giá đơn có trạng thái ' . $order->status);
        }

        foreach ($deliveryOrders as $deliveryOrder) {
            $order = Order::find($deliveryOrder->id);
            $order->attach_info = $deliveryOrder->attach_info;
            $order->status = 'sent_price';
            $order->price = json_decode($deliveryOrder->attach_info)->money;
            $order->quantity = json_decode($deliveryOrder->attach_info)->quantity;
            $order->save();
        }
        //mail and text customer
        return $this->respondSuccess('Báo giá thành công');
    }

    public function payDeliveryOrder($deliveryOrderId, Request $request)
    {
        $deliveryOrder = Order::find($deliveryOrderId);
        if ($deliveryOrder == null)
            return $this->respondErrorWithStatus('Không tìm thấy đơn hàng đặt');
        if ($deliveryOrder->status == 'place_order')
            return $this->respondErrorWithStatus('Báo giá đơn hàng trước khi thanh toán');
        if ($request->money == 0)
            return $this->respondErrorWithStatus('Vui lòng nhập số tiền lớn hơn 0');
        $user = User::find($deliveryOrder->user_id);
        $debt = $deliveryOrder->price - $deliveryOrder->orderPaidMoneys->reduce(function ($paid, $orderPaidMoney) {
                return $paid + $orderPaidMoney->money;
            }, 0);
        if ($debt == 0)
            return $this->respondErrorWithStatus('Đơn hàng đã được thanh toán xong trước đó');
        $money = 0;
        if ($request->deposit == 1) {
            if ($request->money > $user->deposit)
                return $this->respondErrorWithStatus('Tài khoản cọc của khách hàng nhỏ hơn số tiền đã nhập');
            $money = min($debt, $request->money);
        } else {
            if ($request->money > $user->money)
                return $this->respondErrorWithStatus('Tài khoản của khách hàng nhỏ hơn số tiền đã nhập');
            $money = min($debt, $request->money);
        }

        $orderPaidMoney = new OrderPaidMoney;
        $orderPaidMoney->order_id = $deliveryOrder->id;
        $orderPaidMoney->money = $money;
        $orderPaidMoney->note = "ok";
        $orderPaidMoney->payment = $request->payment;
        $orderPaidMoney->staff_id = $this->user->id;
        $orderPaidMoney->save();
        if ($request->deposit == 1)
            $user->deposit -= $money;
        else
            $user->money -= $money;
        return $this->respondSuccessWithStatus([
            'message' => 'Thêm thanh toán thành công. Số tiền: ' . $money,
        ]);
    }
}
