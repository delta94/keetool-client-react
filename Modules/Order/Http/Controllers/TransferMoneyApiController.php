<?php

namespace Modules\Order\Http\Controllers;

use App\Register;
use App\TransferMoney;
use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\ManageApiController;
use Illuminate\Support\Facades\DB;

class TransferMoneyApiController extends ManageApiController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getTransfers(Request $request)
    {
        $limit = $request->limit ? $request->limit : 20;

        $transfers = TransferMoney::query();
        if ($request->user_id)
            $transfers = $transfers->where('user_id', $request->user_id);
        if ($request->status)
            $transfers = $transfers->where('status', $request->status);
        if ($request->bank_account_id)
            $transfers = $transfers->where('bank_account_id', $request->bank_account_id);
//        $request = $request->join('users', '')

        if ($limit == -1) {
            $transfers = $transfers->orderBy('created_at', 'desc')->get();
            return $this->respondSuccessWithStatus([
                'transfers' => $transfers->map(function ($transfer) {
                    return $transfer->transform();
                })
            ]);
        }

        $transfers = $transfers->orderBy('created_at', 'desc')->paginate($limit);
        return $this->respondWithPagination($transfers,
            [
                'transfers' => $transfers->map(function ($transfer) {
                    return $transfer->transform();
                })
            ]);
    }

    public function editTransfer($transferId, Request $request)
    {
        $transfer = TransferMoney::find($transferId);
        if ($transfer == null)
            return $this->respondErrorWithStatus('Không tồn tại chuyển khoản');
        $transfer->money = $request->money;
        $transfer->note = $request->note;
        $transfer->purpose = $request->purpose;
        $transfer->save();
        return $this->respondSuccess('Sửa thành công');
    }

    public function changeTransferStatus($transferId, Request $request)
    {
        $transfer = TransferMoney::find($transferId);
        if ($transfer == null)
            return $this->respondErrorWithStatus('Không tồn tại chuyển khoản');
        if ($transfer->status == 'accept' || $transfer->status == 'cancel')
            return $this->respondErrorWithStatus('Không cho phép chuyển trạng thái chấp nhận hoặc hủy');
        if ($request->status == 'accept') {
            //cong tien vao vi user o day
        }
        if ($request->status == 'cancel')
            $transfer->staff_note = $request->note;
        $transfer->status = $request->status;
        $transfer->save();
        return $this->respondSuccess('Đổi trạng thái thành công');
    }
}
