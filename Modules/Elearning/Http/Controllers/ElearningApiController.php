<?php
/**
 * Created by PhpStorm.
 * User: phanmduong
 * Date: 1/6/18
 * Time: 09:49
 */

namespace Modules\Elearning\Http\Controllers;


use App\Comment;
use App\Http\Controllers\Controller;
use App\Http\Requests\Request;
use Illuminate\Support\Facades\Auth;

class ElearningApiController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->data = array();

        if (!empty(Auth::user())) {
            $this->user = Auth::user();
            $this->data['user'] = $this->user;
        }
    }

    public function uploadImageComment(Request $request)
    {

    }

    public function storeComment($lesson_id, Request $request)
    {

        $comment = Comment::find($request->comment_id);

        if ($comment == null) {
            $comment = new Comment();
        }

        $comment->commenter_id = $this->user->id;
        $comment->content = $request->content_comment;
        $comment->image_url = $request->image_url;
        $comment->parent_id = $request->parent_id;
        $comment->save();


        return [
            "status" => 1,
            "$comment" => $comment
        ];


    }
}