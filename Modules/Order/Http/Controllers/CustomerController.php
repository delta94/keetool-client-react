<?php
/**
 * Created by PhpStorm.
 * User: tt
 * Date: 12/11/2017
 * Time: 15:45
 */

namespace Modules\Order\Http\Controllers;


use App\CustomerGroup;
use App\Http\Controllers\ManageApiController;
use App\Order;
use App\User;
use Illuminate\Http\Request;

class CustomerController extends ManageApiController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function allCustomers(Request $request)
    {

        $limit = $request->limit ? $request->limit : 20;
        $keyword = $request->search;
        $status = $request->status;

        if ($status == "1" || $status == "0") {
            $customerIds = Order::where('status_paid', $status)->select('user_id')->get();
            $users = User::where('type', 'customer')->whereIn('id', $customerIds)->where(function ($query) use ($keyword) {
                $query->where('name', 'like', "%$keyword%")->orWhere('phone', 'like', "%$keyword%")->orWhere('id', $keyword);
            })->orderBy("created_at", "desc")->paginate($limit);
        } else {
            $users = User::where('type', 'customer')->where(function ($query) use ($keyword) {
                $query->where('name', 'like', "%$keyword%")->orWhere('phone', 'like', "%$keyword%")->orWhere('id', $keyword);
            })->orderBy("created_at", "desc")->paginate($limit);
        }


        return $this->respondWithPagination(
            $users,
            [
                'customers' => $users->map(function ($user) use ($status) {

                    $orders = Order::where("user_id", $user->id)->get();
                    if (count($orders) > 0) $canDelete = "false"; else $canDelete = "true";
                    $totalMoney = 0;
                    $totalPaidMoney = 0;
                    $lastOrder = 0;
                    foreach ($orders as $order) {
                        $goodOrders = $order->goodOrders()->get();
                        foreach ($goodOrders as $goodOrder) {
                            $totalMoney += $goodOrder->quantity * $goodOrder->price;
                        }
                        $lastOrder = $order->created_at;
                    }
                    foreach ($orders as $order) {
                        $orderPaidMoneys = $order->orderPaidMoneys()->get();
                        foreach ($orderPaidMoneys as $orderPaidMoney) {
                            $totalPaidMoney += $orderPaidMoney->money;
                        }
                    }
                    $groups = $user->infoCustomerGroups;
                    $count_groups = $user->infoCustomerGroups()->count();
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'phone' => $user->phone,
                        'email' => $user->email,
                        'address' => $user->address,
                        'birthday' => $user->dob,
                        'gender' => $user->gender,
                        'avatar_url' => $user->avatar_url ? $user->avatar_url : "http://api.colorme.vn/img/user.png",
                        'last_order' => $lastOrder ? format_vn_short_datetime(strtotime($lastOrder)) : "Chưa có",
                        'total_money' => $totalMoney,
                        'total_paid_money' => $totalPaidMoney,
                        'debt' => $totalMoney - $totalPaidMoney,
                        'can_delete' => $canDelete,
                        'count_groups' => $count_groups,
                        'groups' => $groups->map(function ($group) {
                            return [
                                "id" => $group->id,
                                "name" => $group->name,
                                "description" => $group->description,
                                "color" => $group->color,
                            ];
                        }),
                    ];

                }),
            ]
        );
    }

    public function countMoney()
    {
        $users = User::where("type", "customer")->get();
        $TM = 0; // Tong tien
        $TDEBT = 0; //Tong no
        if ($users) {
            foreach ($users as $user) {
                $orders = Order::where("user_id", $user->id)->get();
                $totalMoney = 0;
                $totalPaidMoney = 0;
                foreach ($orders as $order) {
                    $goodOrders = $order->goodOrders()->get();
                    foreach ($goodOrders as $goodOrder) {
                        $totalMoney += $goodOrder->quantity * $goodOrder->price;
                    }

                }
                foreach ($orders as $order) {
                    $orderPaidMoneys = $order->orderPaidMoneys()->get();
                    foreach ($orderPaidMoneys as $orderPaidMoney) {
                        $totalPaidMoney += $orderPaidMoney->money;
                    }
                }
                $TM += $totalMoney;
                $TDEBT += $totalMoney - $totalPaidMoney;
            }
        }
        return $this->respondSuccessWithStatus([
            "total_moneys" => $TM,
            "total_debt_moneys" => $TDEBT
        ]);
    }

    public
    function addCustomer(Request $request)
    {
        if (!$request->name || !$request->phone || !$request->address || !$request->email || !$request->dob || !$request->gender || trim($request->name) == "" || trim($request->phone) == "" || trim($request->address) == "" || trim($request->email) == "" || trim($request->dob) == "")
            return $this->respondErrorWithStatus("Thiếu thông tin");

        if (!filter_var($request->email, FILTER_VALIDATE_EMAIL)) return $this->respondErrorWithStatus("Email không hợp lệ");

        $user = User::where("email", $request->email)->get();
        if (count($user) > 0) return $this->respondErrorWithStatus("Đã tồn tại khách hàng");
        else {
            $user = new User;
            $user->name = $request->name;
            $user->phone = $request->phone;
            $user->address = $request->address;
            $user->email = $request->email;
            $user->dob = $request->dob;
            $user->gender = $request->gender;
            $user->type = "customer";
            $user->save();
        }
        $orders = Order::where("user_id", $user->id)->get();
        if (count($orders) > 0) $canDelete = "false"; else $canDelete = "true";
        $totalMoney = 0;
        $totalPaidMoney = 0;
        $lastOrder = 0;
        foreach ($orders as $order) {
            $goodOrders = $order->goodOrders()->get();
            foreach ($goodOrders as $goodOrder) {
                $totalMoney += $goodOrder->quantity * $goodOrder->price;
            }
            $lastOrder = $order->created_at;
        }
        foreach ($orders as $order) {
            $orderPaidMoneys = $order->orderPaidMoneys()->get();
            foreach ($orderPaidMoneys as $orderPaidMoney) {
                $totalPaidMoney += $orderPaidMoney->money;
            }
        }
        $data["id"] = $user->id;
        $data["name"] = $user->name;
        $data["phone"] = $user->phone;
        $data["email"] = $user->email;
        $data["address"] = $user->address;
        $data["birthday"] = $user->dob;
        $data["gender"] = $user->gender;
        $data["last_order"] = $lastOrder ? format_vn_short_datetime(strtotime($lastOrder)) : "Chưa có";
        $data["total_money"] = $totalMoney;
        $data["total_paid_money"] = $totalPaidMoney;
        $data["debt"] = $totalMoney - $totalPaidMoney;
        $data["can_delete"] = $canDelete;
        return $this->respondSuccessWithStatus([
            "message" => "Thêm thành công",
            "user" => $data
        ]);
    }

    public function editCustomer($customerId, Request $request)
    {
        if ($request->name === null || $request->phone === null ||
            $request->address === null || $request->email === null || $request->gender === null || $request->dob === null)
            return $this->respondErrorWithStatus("Thiếu trường");

        $user = User::find($customerId);
        if (!$user) return $this->respondErrorWithStatus("Không tồn tại khách hàng");

        $userr = User::where("email", $request->email)->first();
        if (count($userr) > 0 && $userr->id != $customerId) return $this->respondErrorWithStatus("Đã tồn tại email");

        $user->name = $request->name;
        $user->phone = $request->phone;
        $user->address = $request->address;
        $user->email = $request->email;
        $user->gender = $request->gender;
        $user->dob = $request->dob;
        $user->save();

        if ($request->stringId != null) {
            $user->infoCustomerGroups()->detach();
            $id_lists = explode(';', $request->stringId);
            foreach ($id_lists as $id_list) {
                $user->infoCustomerGroups()->attach($id_list);
            }

        } else if ($request->stringId == "" && $user->infoCustomerGroups) $user->infoCustomerGroups()->detach();
        $orders = Order::where("user_id", $user->id)->get();
        if (count($orders) > 0) $canDelete = "false"; else $canDelete = "true";
        $totalMoney = 0;
        $totalPaidMoney = 0;
        $lastOrder = 0;
        foreach ($orders as $order) {
            $goodOrders = $order->goodOrders()->get();
            foreach ($goodOrders as $goodOrder) {
                $totalMoney += $goodOrder->quantity * $goodOrder->price;
            }
            $lastOrder = $order->created_at;
        }
        foreach ($orders as $order) {
            $orderPaidMoneys = $order->orderPaidMoneys()->get();
            foreach ($orderPaidMoneys as $orderPaidMoney) {
                $totalPaidMoney += $orderPaidMoney->money;
            }
        }
        $data["id"] = $user->id;
        $data["name"] = $user->name;
        $data["phone"] = $user->phone;
        $data["email"] = $user->email;
        $data["address"] = $user->address;
        $data["birthday"] = $user->dob;
        $data["gender"] = $user->gender;
        $data["last_order"] = $lastOrder ? format_vn_short_datetime(strtotime($lastOrder)) : "Chưa có";
        $data["total_money"] = $totalMoney;
        $data["total_paid_money"] = $totalPaidMoney;
        $data["debt"] = $totalMoney - $totalPaidMoney;
        $data["can_delete"] = $canDelete;
        $groups = $user->infoCustomerGroups;
        $count_groups = $user->infoCustomerGroups()->count();
        $data["count_groups"] = $count_groups;
        $data["groups"] = $groups->map(function ($group) {
            return [
                "id" => $group->id,
                "name" => $group->name,
                "description" => $group->description,
                "color" => $group->color,
            ];
        });

        return $this->respondSuccessWithStatus([
            "message" => "Sửa thành công",
            "user" => $data
        ]);


    }

    public function getInfoCustomer($customerId, Request $request)
    {
        $user = User::find($customerId);
        if (!$user) return $this->respondErrorWithStatus("Không tồn tại khách hàng");
        $orders = Order::where("user_id", $user->id)->get();
        if (count($orders) > 0) $canDelete = "false"; else $canDelete = "true";
        $totalMoney = 0;
        $totalPaidMoney = 0;
        $lastOrder = 0;
        foreach ($orders as $order) {
            $goodOrders = $order->goodOrders()->get();
            foreach ($goodOrders as $goodOrder) {
                $totalMoney += $goodOrder->quantity * $goodOrder->price;
            }
            $lastOrder = $order->created_at;
        }
        foreach ($orders as $order) {
            $orderPaidMoneys = $order->orderPaidMoneys()->get();
            foreach ($orderPaidMoneys as $orderPaidMoney) {
                $totalPaidMoney += $orderPaidMoney->money;
            }
        }
        $data["id"] = $user->id;
        $data["name"] = $user->name;
        $data["phone"] = $user->phone;
        $data["email"] = $user->email;
        $data["address"] = $user->address;
        $data["birthday"] = $user->dob;
        $data["gender"] = $user->gender;
        $data["last_order"] = $lastOrder ? format_vn_short_datetime(strtotime($lastOrder)) : "Chưa có";
        $data["total_money"] = $totalMoney;
        $data["total_paid_money"] = $totalPaidMoney;
        $data["debt"] = $totalMoney - $totalPaidMoney;
        $data["can_delete"] = $canDelete;
        $groups = $user->infoCustomerGroups;
        $count_groups = $user->infoCustomerGroups()->count();
        $data["count_groups"] = $count_groups;
        $data["groups"] = $groups->map(function ($group) {
            return [
                "id" => $group->id,
                "name" => $group->name,
                "description" => $group->description,
                "color" => $group->color,
            ];
        });
        return $this->respondSuccessWithStatus([
            'user' => $data
        ]);
    }

}