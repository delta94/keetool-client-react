<?php
/**
 * Created by PhpStorm.
 * User: lethergo
 * Date: 27/03/2018
 * Time: 10:20
 */

namespace Modules\Company\Http\Controllers;


use App\Good;
use App\Http\Controllers\ManageApiController;
use App\Warehouse;
use App\ZHistoryGood;
use Illuminate\Http\Request;

class WarehouseController extends ManageApiController
{
    public function getHistoryGood($goodId, Request $request)
    {
        $limit = $request->limit ? $request->limit : 20;
        if($limit !=-1) {
            $historyGood = ZHistoryGood::where('good_id', $goodId)->paginate($limit);

            return $this->respondWithPagination($historyGood, [
                "historyGood" => $historyGood->map(function ($history) {
                    return $history->transform();
                })
            ]);
        } else {
            $historyGood = ZHistoryGood::where('good_id', $goodId)->get();

            return $this->respondSuccessWithStatus([
                "historyGood" => $historyGood->map(function ($history) {
                    return $history->transform();
                })
            ]);
        }
    }

    public function summaryGood(Request $request)
    {
        $limit  = $request->limit ? $request->limit : 20;
        if($limit != -1) {
            $goods = Good::paginate($limit);
            return $this->respondWithPagination($goods, [
                "goods" => $goods->map(function ($good) {
                    $sum_warehouse = [];
                    $warehouses = Warehouse::all();
                    foreach ($warehouses as $warehouse) {
                        $history = ZHistoryGood::where('good_id', $good->id)->where('warehouse_id', $warehouse->id)->get();
                        $sum_quantity = $history->reduce(function ($total, $value) {
                            return $total + $value->quantity;
                        }, 0);
                        array_push($sum_warehouse, [
                            "id" => $warehouse->id,
                            "name" => $warehouse->name,
                            "sum_quantity" => $sum_quantity,
                        ]);
                    }
                    return [
                        "id" => $good->id,
                        "name" => $good->name,
                        "summary_warehouse" => $sum_warehouse,
                    ];
                })
            ]);
        } else {
            $goods = Good::all();
            return $this->respondSuccessWithStatus([
                "goods" => $goods->map(function ($good) {
                    $sum_warehouse = [];
                    $warehouses = Warehouse::all();
                    foreach ($warehouses as $warehouse) {
                        $history = ZHistoryGood::where('good_id', $good->id)->where('warehouse_id', $warehouse->id)->get();
                        $sum_quantity = $history->reduce(function ($total, $value) {
                            return $total + $value->quantity;
                        }, 0);
                        array_push($sum_warehouse, [
                            "id" => $warehouse->id,
                            "name" => $warehouse->name,
                            "sum_quantity" => $sum_quantity,
                        ]);
                    }
                    return [
                        "id" => $good->id,
                        "name" => $good->name,
                        "summary_warehouse" => $sum_warehouse,
                    ];
                })
            ]);
        }
    }
}