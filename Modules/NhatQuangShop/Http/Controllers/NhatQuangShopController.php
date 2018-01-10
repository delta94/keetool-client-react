<?php

namespace Modules\NhatQuangShop\Http\Controllers;

use App\Good;
use App\Order;
use App\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Modules\Good\Entities\GoodProperty;
use Modules\Graphics\Repositories\BookRepository;

class NhatQuangShopController extends Controller
{
    private $bookRepository;
    protected $data;
    protected $user;

    public function __construct(BookRepository $bookRepository)
    {
        $this->bookRepository = $bookRepository;
        $this->data = array();
        if (!empty(Auth::user())) {
            $this->user = Auth::user();
            $this->data['user'] = $this->user;
        }
    }

    public function index()
    {
        $books = Good::where('display_status', 1)->groupBy('code')->get();
        $book_arr = [];
        foreach ($books as $book) {
            $properties = GoodProperty::where('good_id', $book->id)->get();
            $bookdata = [
                'id' => $book->id,
                'cover' => $book->cover_url,
                'avatar' => $book->avatar_url,
                'type' => $book->type,
                'name' => $book->name,
                'description' => $book->description,
                'price' => $book->price
            ];
            foreach ($properties as $property) {
                $bookdata[$property->name] = $property->value;
            }
            $book_arr[] = $bookdata;
        }
        $this->data["books"] = $book_arr;
        return view('nhatquangshop::index', $this->data);
    }

    public function about_us()
    {
        return view('nhatquangshop::about_us');
    }


    public function addGoodToCart($goodId, Request $request)
    {
        $goods_str = $request->session()->get('goods');
        $number = $request->number;

        if ($goods_str) {
            $goods = json_decode($goods_str);
        } else {
            $goods = [];
        }

        $added = false;
        foreach ($goods as &$good) {
            if ($good->id == $goodId) {
                if ($number) {
                    $good->number = $number;
                } else {
                    $good->number += 1;
                }
                $added = true;
            }
        }

        if (!$added) {
            $temp = new \stdClass();
            $temp->id = $goodId;
            $temp->number = 1;
            $goods[] = $temp;
        }


        $goods_str = json_encode($goods);
        $request->session()->put('goods', $goods_str);
        return ["status" => 1];
    }

    public function countGoodsFromSession(Request $request)
    {
        $goods_str = $request->session()->get('goods');
        $goods = json_decode($goods_str);

        $count = 0;
        if ($goods) {
            foreach ($goods as $good) {
                $count += $good->number;
            }
        }

        return $count;
    }

    public function removeBookFromCart($goodId, Request $request)
    {
        $goods_str = $request->session()->get('goods');
        $number = $request->number;

        $goods = json_decode($goods_str);

        $new_goods = [];

        foreach ($goods as &$good) {
            if ($good->id == $goodId) {
                $good->number = $number;
            }
            if ($good->number > 0) {
                $temp = new \stdClass();
                $temp->id = $good->id;
                $temp->number = $good->number;
                $new_goods[] = $temp;
            }
        }


        $goods_str = json_encode($new_goods);
        $request->session()->put('goods', $goods_str);
        return ["status" => 1];
    }

    public function getGoodsFromSession(Request $request)
    {
        $goods_str = $request->session()->get('goods');
        $goods_arr = json_decode($goods_str);

        $goods = [];

        if ($goods_arr) {
            foreach ($goods_arr as $item) {
                $good = Good::find($item->id);
                $good->number = $item->number;
                $properties = GoodProperty::where('good_id', $good->id)->get();
                foreach ($properties as $property) {
                    $good[$property->name] = $property->value;
                }
                $goods[] = $good;
            }
        }

        $totalPrice = 0;

        foreach ($goods as $good) {
            $totalPrice += $good->price * $good->number;
        }
        $data = [
            "books" => $goods,
            "total_price" => $totalPrice
        ];
        return view("nhatquangshop::goods_cart", $data);
    }

    public function book($good_id)
    {
        $book = Good::find($good_id);
        if ($book == null)
            return view('nhatquangshop::404');
        $properties = GoodProperty::where('good_id', $good_id)->get();

        $data = [
            'id' => $book->id,
            'cover' => $book->cover_url,
            'avatar' => $book->avatar_url,
            'type' => $book->type,
            'name' => $book->name,
            'description' => $book->description,
            'price' => $book->price
        ];
        foreach ($properties as $property) {
            $data[$property->name] = $property->value;
        }
        return view('nhatquangshop::book', [
            'properties' => $data,
        ]);
    }

    public function contact_us()
    {
        return view('nhatquangshop::contact_us');
    }


    public function contact_info( $subfix, Request $request)
    {
        $data = ['email' => $request->email, 'name' => $request->name, 'message_str' => $request->message_str];

        Mail::send('emails.contact_us', $data, function ($m) use ($request) {
            $m->from('no-reply@colorme.vn', 'Graphics');
            $subject = "Xác nhận thông tin";
            $m->to($request->email, $request->name)->subject($subject);
        });
        Mail::send('emails.contact_us', $data, function ($m) use ($request) {
            $m->from('no-reply@colorme.vn', 'Graphics');
            $subject = "Xác nhận thông tin";
            $m->to($request->email, $request->name)->subject($subject);
        });
        return "OK";
    }

    public function post($post_id)
    {
        $post = Product::find($post_id);
        $post->author;
        $post->category;
        $post->url = config('app.protocol') . $post->url;
        if (trim($post->author->avatar_url) === '') {
            $post->author->avatar_url = config('app.protocol') . 'd2xbg5ewmrmfml.cloudfront.net/web/no-avatar.png';
        } else {
            $post->author->avatar_url = config('app.protocol') . $post->author->avatar_url;
        }
        $posts_related = Product::where('id', '<>', $post_id)->inRandomOrder()->limit(3)->get();
        $posts_related = $posts_related->map(function ($p) {
            $p->url = config('app.protocol') . $p->url;
            return $p;
        });
        $post->comments = $post->comments->map(function ($comment) {
            $comment->commenter->avatar_url = config('app.protocol') . $comment->commenter->avatar_url;

            return $comment;
        });
//        dd($post);
        return view('nhatquangshop::post',
            [
                'post' => $post,
                'posts_related' => $posts_related
            ]
        );
    }

    public function blog(Request $request)
    {
        $blogs = Product::where('type', 2)->orderBy('created_at', 'desc')->paginate(9);
        $display = "";
        if ($request->page == null) $page_id = 2; else $page_id = $request->page + 1;
        if ($blogs->lastPage() == $request->page) $display = "display:none";
        return view('nhatquangshop::blogs', [
            'blogs' => $blogs,
            'page_id' => $page_id,
            'display' => $display,
        ]);
    }

    public function saveOrder(Request $request)
    {
        $email = $request->email;
        $name = $request->name;
        $phone = $request->phone;
        $address = $request->address;
        $payment = $request->payment;

        $goods_str = $request->session()->get('goods');
        $goods_arr = json_decode($goods_str);

        if (count($goods_arr) > 0) {
//            $this->bookRepository->saveOrder($email, $phone, $name, $address, $payment, $goods_arr);
            $request->session()->flush();
            return [
                "status" => 1
            ];
        } else {
            return [
                "status" => 0,
                "message" => "Bạn chưa đặt cuốn sách nào"
            ];
        }
    }

    public function test(Request $request)
    {
        $blogs = Product::where('type', 2)->orderBy('created_at', 'desc')->paginate(9);
        $display = "";
        if ($request->page == null) $page_id = 2; else $page_id = $request->page + 1;
        if ($blogs->lastPage() == $request->page) $display = "display:none";
        return view('nhatquangshop::test', [
            'blogs' => $blogs,
            'page_id' => $page_id,
            'display' => $display,
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return redirect()->intended("/");
    }
}
