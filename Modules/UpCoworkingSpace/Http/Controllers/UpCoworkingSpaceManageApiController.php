<?php

namespace Modules\UpCoworkingSpace\Http\Controllers;

use App\Http\Controllers\ApiPublicController;
use App\Http\Controllers\ManageApiController;
use App\RoomServiceRegister;
use App\RoomServiceSubscription;
use App\RoomServiceSubscriptionKind;
use App\RoomServiceUserPack;
use App\TeleCall;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class UpCoworkingSpaceManageApiController extends ManageApiController
{

    public function __construct()
    {
        parent::__construct();
    }




    public function getRegisters(Request $request)
    {
        $limit = $request->limit ? $request->limit : 20;
        $search = $request->search;

        if ($limit != -1) {
            if ($search)
                $registers = RoomServiceRegister::join('users', 'users.id', '=', 'room_service_registers.user_id')
                    ->select('room_service_registers.*')->where(function ($query) use ($search) {
                        $query->where("users.name", "like", "%$search%")->orWhere("room_service_registers.code", "like", "%$search%");
                    });
            else $registers = RoomServiceRegister::query();


//        if ($request->user_id)
//            $registers = $registers->where('user_id', $request->user_id);

            if ($request->staff_id)
                $registers = $registers->where('staff_id', $request->staff_id);
            if ($request->campaign_id)
                $registers = $registers->where('campaign_id', $request->campaign_id);
            if ($request->status)
                $registers = $registers->where('status', $request->status);

            $registers = $registers->orderBy('created_at', 'desc')->paginate($limit);

            return $this->respondWithPagination($registers, [
                'room_service_registers' => $registers->map(function ($register) {
                    return $register->getData();
                })
            ]);
        } else {
            $registers = RoomServiceRegister::all();
            return $this->respondSuccessWithStatus([
                'room_service_registers' => $registers->map(function ($register) {
                    return $register->getData();
                })
            ]);
        }
    }

    public function getUserPacks(Request $request)
    {
        $limit = $request->limit ? $request->limit : 20;
        $userPacks = RoomServiceUserPack::query();

        if ($limit == -1) {
            $userPacks = $userPacks->orderBy('created_at', 'desc')->get();
            return $this->respondSuccessWithStatus([
                'user_packs' => $userPacks->map(function ($userPack) {
                    return $userPack->getData();
                })
            ]);
        }

        $userPacks = $userPacks->orderBy('created_at', 'desc')->paginate($limit);
        return $this->respondWithPagination($userPacks, [
            'user_packs' => $userPacks->map(function ($userPack) {
                return $userPack->getData();
            })
        ]);
    }

    public function getSubscriptions($userPackId, Request $request)
    {
        $subscriptions = RoomServiceSubscription::where('user_pack_id', $userPackId);

        $subscriptions = $subscriptions->orderBy('created_at', 'desc')->get();
        return $this->respondSuccessWithStatus([
            'subscriptions' => $subscriptions->map(function ($subscription) {
                return $subscription->transform();
            })
        ]);
    }

    public function getUserPack($userPackId, Request $request)
    {
        $userPack = RoomServiceUserPack::find($userPackId);
        return $this->respondSuccessWithStatus([
            "userPack" => $userPack->getData()
        ]);
    }

    public function createSubscriptions($userPackId, Request $request)
    {
        if ($request->subscription_kind_id == null || $request->subscription_kind_id == 0)
            return $this->respondErrorWithStatus('Thiếu subscription_kind_id');
        $subscription = new RoomServiceSubscription;
        $subscription->user_pack_id = $userPackId;
        $subscription->description = $request->description;
        $subscription->price = $request->price;
        $subscription->subscription_kind_id = $request->subscription_kind_id;
        $subscription->save();
        return $this->respondSuccess('Tạo gói thành viên thành công');
    }

    public function editSubscriptions($userPackId, $subcriptionId, Request $request)
    {
        if ($request->subscription_kind_id == null || $request->subscription_kind_id == 0)
            return $this->respondErrorWithStatus('Thiếu subscription_kind_id');
        $subscription = RoomServiceSubscription::find($subcriptionId);
        $subscription->user_pack_id = $userPackId;
        $subscription->description = $request->description;
        $subscription->price = $request->price;
        $subscription->subscription_kind_id = $request->subscription_kind_id;

        $subscription->save();

        return $this->respondSuccess('Sửa gói thành viên thành công');
    }

    public function getSubscriptionKinds(Request $request)
    {
        $search = $request->search;

        $subscriptionKinds = RoomServiceSubscriptionKind::query();
        $subscriptionKinds = $subscriptionKinds->where('name', 'like', '%' . $search . '%');
        $subscriptionKinds = $subscriptionKinds->orderBy('created_at', 'desc')->get();
        return $this->respondErrorWithStatus([
            'subscription_kinds' => $subscriptionKinds->map(function ($subscriptionKind) {
                return $subscriptionKind->getData();
            })
        ]);
    }

    public function createSubscriptionKind(Request $request)
    {
        if ($request->name == null || trim($request->name) == '')
            return $this->respondErrorWithStatus('Thiếu tên');

        $subscriptionKind = new RoomServiceSubscriptionKind;

        $subscriptionKind->name = $request->name;
        $subscriptionKind->hours = $request->hours;

        $subscriptionKind->save();

        return $this->respondSuccess('Tạo thành công');
    }

    public function createUserPack(Request $request)
    {
        if ($request->name === null || trim($request->name) == "" ||
            $request->avatar_url === null || trim($request->avatar_url) == "")
            return $this->respondErrorWithStatus("Thiếu trường");
        $userPack = new RoomServiceUserPack;
        $userPack->name = $request->name;
        $userPack->avatar_url = $request->avatar_url;
        $userPack->detail = $request->detail;
        $userPack->save();
        return $this->respondSuccessWithStatus([
            "message" => "Tạo thành công"
        ]);
    }

    public function editUserPack($userPackId, Request $request)
    {
        $userPack = RoomServiceUserPack::find($userPackId);
        if (!$userPack) return $this->respondErrorWithStatus("Không tồn tại");
        if ($request->name === null || trim($request->name) == "" ||
            $request->avatar_url === null || trim($request->avatar_url) == "")
            return $this->respondErrorWithStatus("Thiếu trường");
        $userPack->name = $request->name;
        $userPack->avatar_url = $request->avatar_url;
        $userPack->detail = $request->detail;
        $userPack->save();
        return $this->respondSuccessWithStatus([
            "message" => "Sửa thành công"
        ]);
    }

    public function changeStatusUserPack($userPackId, Request $request)
    {
        $userPack = RoomServiceUserPack::find($userPackId);
        if (!$userPack) return $this->respondErrorWithStatus("Không tồn tại");
        $userPack->status = 1 - $userPack->status;
        $userPack->save();
        return $this->respondSuccessWithStatus([
            "message" => "Đổi thành công"
        ]);
    }

    public function saveCall(Request $request)
    {
        $teleCall = new TeleCall;
        $teleCall->caller_id = $this->user->id;
        $teleCall->gen_id = 0;
        $teleCall->call_status = $request->call_status;
        $teleCall->student_id = $request->listener_id;
        $teleCall->note = $request->note;
        $teleCall->register_id = $request->register_id;
        $teleCall->save();
        return $this->respondSuccessWithStatus([
            "message" => "Lưu thành công",
            "teleCall" => $teleCall->transform(),
        ]);
    }
}
