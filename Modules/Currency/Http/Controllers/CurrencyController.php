<?php

namespace Modules\Currency\Http\Controllers;

use App\Currency;
use App\Http\Controllers\ManageApiController;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;

class CurrencyController extends ManageApiController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getAllCurrencies(Request $request)
    {
        $currencies = Currency::all();
        return $this->respondSuccessWithStatus([
            "currencies" => $currencies->map(function ($currency) {
                return $currency->tranform();
            })
        ]);
    }

    public function createCurrency(Request $request)
    {
        if ($request->name === null || trim($request->name) == "" ||
            $request->notation === null || trim($request->notation) == "" ||
            $request->ratio === null || trim($request->ratio) == "")
            return $this->respondErrorWithStatus("Thiếu trường");
        $currency = new Currency;
        $currency->name = $request->name;
        $currency->notation = $request->name;
        $currency->ratio = $request->ratio;
        $currency->save();
        return $this->respondSuccessWithStatus([
            "message" => "Tạo thành công"
        ]);
    }

    public function editCurrency($currencyId, Request $request)
    {
        if ($request->name === null || trim($request->name) == "" ||
            $request->notation === null || trim($request->notation) == "" ||
            $request->ratio === null || trim($request->ratio) == "")
            return $this->respondErrorWithStatus("Thiếu trường");
        $currency = Currency::find($currencyId);
        if (!$currency) return $this->respondErrorWithStatus("Không tồn tại");
        $currency->name = $request->name;
        $currency->notation = $request->name;
        $currency->ratio = $request->ratio;
        $currency->save();
        return $this->respondSuccessWithStatus([
            "message" => "Sửa thành công"
        ]);
    }
}
