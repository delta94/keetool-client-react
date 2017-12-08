<?php

namespace Modules\Book\Http\Controllers;

use App\Http\Controllers\ManageApiController;
use Illuminate\Http\Request;
use Modules\Book\Entities\Barcode;
use Picqer\Barcode\BarcodeGeneratorPNG;
use Picqer\Barcode\Exceptions\BarcodeException;

class BarcodeController extends ManageApiController
{


    public function saveBarcode(Request $request)
    {
        if ($request->id == null) {
            $barcode = new Barcode();
        } else {
            $barcode = Barcode::find($request->id);
        }
        if ($request->good_id) {
            $barcode->good_id = $request->good_id;
        } else {
            $barcode->good_id = 0;
        }
        $barcode->value = $request->value;
        $generator = new BarcodeGeneratorPNG();
        if ($request->value) {
            try {
                $barcode->image_url = 'data:image/png;base64,' . base64_encode($generator->getBarcode($request->value, $generator::TYPE_CODE_128));
            } catch (BarcodeException $e) {
            }
        }

        $barcode->save();
        return $this->respondSuccessWithStatus(["barcode" => $barcode]);
    }

    public function barcode($barcodeId)
    {
        $barcode = Barcode::find($barcodeId);
        if ($barcode == null) {
            return $this->respondErrorWithStatus("Barcode không tồn tại");
        }
        return $this->respondSuccessWithStatus(["barcode" => $barcode]);
    }

    public function barcodes()
    {
        $barcodes = Barcode::orderBy("created_at", "desc")->paginate(20);
        return $this->respondWithPagination($barcodes, [
            "barcodes" => $barcodes->map(function ($barcode) {
                return $barcode;
            })
        ]);
    }


}
