<?php
/**
 * Created by PhpStorm.
 * User: phanmduong
 * Date: 7/20/17
 * Time: 17:25
 */

namespace App\Http\Controllers;


use App\Providers\AppServiceProvider;
use App\StudyClass;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;

class ManageStaffApiController extends ApiController
{

    public function __construct()
    {
        parent::__construct();
    }

    public function add_staff(Request $request){
        $errors = [];
        $user = User::where('email', '=', $request->email)->first();
        if ($user) {
            $errors['email'] = "Email đã có người sử dụng";
        }
        $username = trim($request->username);
        $user = User::where('username', '=', $username)->first();
        if ($user) {
            $errors['username'] = "Username đã có người sử dụng";
        }

        if (!empty($errors)) {
            return $this->respondErrorWithStatus($errors);
        }
        $user = new User;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->username = $username;
        $user->marital = $request->marital;
        $user->role= 1;
        $user->role_id= 17;


        $user->password = bcrypt('123456');
        $user->save();
        return $this->respondSuccessWithStatus([
            "user" => $user
        ]);
    }
}