<?php
/**
 * Created by PhpStorm.
 * User: caoquan
 * Date: 11/13/17
 * Time: 10:54 AM
 */

namespace Modules\Order\Repositories;

use App\HistoryGood;
use App\ImportedGoods;
use App\Order;
use App\User;

class OrderService
{
    public function statusToNum($status)
    {
        switch ($status) {
            case 'place_order':
                return 0;
                break;
            case 'not_reach':
                return 1;
                break;
            case 'confirm_order':
                return 2;
                break;
            case 'ship_order':
                return 3;
                break;
            case 'completed_order':
                return 4;
                break;
            case 'cancel':
                return 5;
                break;
            default:
                return 0;
                break;
        }
    }

    public function returnProcess($orderId, $warehouseId, $staff_id)
    {
        $order = Order::find($orderId);
        $good_orders = $order->goodOrders;
        foreach ($good_orders as $good_order) {
            $history = HistoryGood::where('order_id', $orderId)
                ->where('good_id', $good_order->good_id)
                ->orderBy('created_at', 'desc')->get();
            foreach ($history as $singular_history) {
                if ($good_order->quantity === 0)
                    break;
                $returnHistory = new HistoryGood;
                $lastest_good_history = HistoryGood::where('good_id', $good_order->good_id)->where('warehouse_id', $warehouseId)
                    ->orderBy('created_at', 'desc')->first();
                $remain = $lastest_good_history ? $lastest_good_history->remain : 0;
                $returnHistory->good_id = $singular_history->good_id;
                $returnHistory->quantity = min($good_order->quantity, $singular_history->quantity);
                $returnHistory->remain = $remain + min($good_order->quantity, $singular_history->quantity);
                $returnHistory->warehouse_id = $warehouseId;
                $returnHistory->type = 'return';
                $returnHistory->order_id = $orderId;
                $returnHistory->imported_good_id = $singular_history->imported_good_id;
                $returnHistory->save();

                $good_order->quantity -= min($good_order->quantity, $singular_history->quantity);

                $importedGood = new ImportedGoods;
                $importedGood->order_import_id = $orderId;
                $importedGood->good_id = $singular_history->good_id;
                $importedGood->warehouse_id = $warehouseId;
                $importedGood->import_price = $good_order->price;
                $importedGood->quantity = min($good_order->quantity, $singular_history->quantity);
                $importedGood->import_quantity = min($good_order->quantity, $singular_history->quantity);
                $importedGood->staff_id = $staff_id;
                $importedGood->created_at = $order->created_at;
                $importedGood->save();
            }
        }
    }

    public function fixStatusBackWard($orderId, $warehouseId, $staff_id)
    {
        $order = Order::find($orderId);
        $good_orders = $order->goodOrders;
        foreach ($good_orders as $good_order) {
            $importedGood = new ImportedGoods;
            $importedGood->order_import_id = $orderId;
            $importedGood->good_id = $good_order->good_id;
            $importedGood->warehouse_id = $warehouseId;
            $importedGood->import_price = $good_order->price;
            $importedGood->quantity = $good_order->quantity;
            $importedGood->import_quantity = $good_order->quantity;
            $importedGood->staff_id = $staff_id;
            $importedGood->created_at = $order->created_at;
            $importedGood->save();

            $lastest_good_history = HistoryGood::where('good_id', $importedGood->good_id)
                ->where('warehouse_id', $warehouseId)
                ->orderBy('created_at', 'desc')->first();
            $remain = $lastest_good_history ? $lastest_good_history->remain : 0;
            $history = new HistoryGood;
            $history->good_id = $importedGood->good_id;
            $history->quantity = $importedGood->quantity;
            $history->remain = $remain + $importedGood->quantity;
            $history->warehouse_id = $warehouseId;
            $history->type = 'return';
            $history->order_id = $orderId;
            $history->imported_good_id = $importedGood->id;
            $history->save();
        }
        $order->exported = 0;
        $order->save();
    }

    public function importedGoodsExportProcess($goodOrder, $warehouseId)
    {
        $quantity = $goodOrder->quantity;
        $earn = 0;
        while ($quantity > 0) {
            $importedGood = ImportedGoods::where('status', 'completed')
                ->where('quantity', '>', 0)
                ->where('warehouse_id', $warehouseId)
                ->where('good_id', $goodOrder->good_id)
                ->orderBy('created_at', 'asc')->first();

            $min_quantity = min($quantity, $importedGood->quantity);
            $history = new HistoryGood;
            $lastest_good_history = HistoryGood::where('good_id', $importedGood['good_id'])
                ->where('warehouse_id', $warehouseId)
                ->orderBy('created_at', 'desc')->first();
            $remain = $lastest_good_history ? $lastest_good_history->remain : 0;
            $history->good_id = $goodOrder->good_id;
            $history->quantity = $min_quantity;
            $history->remain = $remain - $min_quantity;
            $history->warehouse_id = $warehouseId;
            $history->type = 'order';
            $history->order_id = $goodOrder->order_id;
            $history->imported_good_id = $importedGood->id;
            $history->save();
            $quantity -= $min_quantity;
            $importedGood->quantity -= $min_quantity;
            $earn += $min_quantity*$importedGood->import_price;
            $importedGood->save();
        }
        $goodOrder->import_price = floor($earn/$goodOrder->quantity);
        $goodOrder->save();
    }

    public function exportOrder($orderId, $warehouseId)
    {
        $order = Order::find($orderId);
        if ($order->exported == true)
            return [
                'status' => 0,
                'message' => 'Đã xuất hàng'
            ];
        foreach ($order->goodOrders as $goodOrder) {
            $quantity = ImportedGoods::where('status', 'completed')
                ->where('good_id', $goodOrder->good_id)
                ->where('warehouse_id', $warehouseId)
                ->sum('quantity');
            if ($goodOrder->quantity > $quantity)
                return [
                    'status' => 0,
                    'message' => 'Thiếu hàng: ' . $goodOrder->good->name,
                ];
        }
        foreach ($order->goodOrders as $goodOrder)
            $this->importedGoodsExportProcess($goodOrder, $warehouseId);
        $order->exported = true;
        $order->warehouse_id = $warehouseId;
        $order->save();
        return [
            'status' => 1,
            'message' => 'SUCCESS',
        ];
    }

    public function changeOrderStatus($orderId, $request, $staff_id)
    {
        $order = Order::find($orderId);
        if ($this->statusToNum($order->status) < 2 && $this->statusToNum($request->status) >= 2 && $this->statusToNum($request->status) != 5) {
            $response = $this->exportOrder($order->id, $order->warehouse_id ? $order->warehouse_id : 4);
            if ($response['status'] == 0)
                return [
                    'status' => 0,
                    'message' => $response['message'],
                ];
            $order->warehouse_export_id = $order->warehouse_id ? $order->warehouse_id : $request->warehouse_id;
        }

        if (($this->statusToNum($order->status) >= 2 && $this->statusToNum($order->status) <= 4)
            && ($this->statusToNum($request->status) < 2 || $this->statusToNum($request->status) == 5)) {
            $this->fixStatusBackWard($order->id, $request->warehouse_id, $staff_id);
        }
        if ($order->type == 'import' && $request->status == 'completed') {
            $importedGoods = $order->importedGoods;
            foreach ($importedGoods as $importedGood) {
                $importedGood->status = 'completed';
                $importedGood->save();
                $history = new HistoryGood;
                $lastest_good_history = HistoryGood::where('good_id', $importedGood->good_id)
                    ->where('warehouse_id', $importedGood->warehouse_id)
                    ->orderBy('created_at', 'desc')->first();
                $remain = $lastest_good_history ? $lastest_good_history->remain : 0;
                $history->good_id = $importedGood->good_id;
                $history->quantity = $importedGood->quantity;
                $history->remain = $remain + $importedGood->quantity;
                $history->warehouse_id = $importedGood->warehouse_id;
                $history->type = 'import';
                $history->order_id = $importedGood->order_import_id;
                $history->imported_good_id = $importedGood->id;
                $history->save();
            }
        }
        $order->status = $request->status;
        $order->staff_id = $staff_id;
        if ($request->label_id) {
            $order->label_id = $request->label_id;
        }
        $order->save();

        return [
            'status' => 1,
            'message' => 'SUCCESS'
        ];
    }
}