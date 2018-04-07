<?php

/**
 * Created by PhpStorm.
 * User: phanmduong
 * Date: 8/23/17
 * Time: 11:05
 */

namespace App\Http\Controllers;

use App\Product;
use App\Category;
use App\CategoryProduct;
use Illuminate\Http\Request;
use Symfony\Component\CssSelector\Parser\Reader;

class ManageBlogController extends ManageApiController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function create_category(Request $request)
    {
        $name = $request->name;

        $category = new CategoryProduct;

        $category->name = $name;

        $category->save();

        return $this->respondSuccessWithStatus([
            'message' => 'Tạo category thành công'
        ]);
    }

    public function editCategory($id, Request $request)
    {
        $name = $request->name;

        $category = CategoryProduct::find($id);

        if ($category == null)
            return $this->respondErrorWithStatus('Không tồn tại loại blog');

        $category->name = $name;

        $category->save();

        return $this->respondSuccessWithStatus([
            'message' => 'Tạo category thành công'
        ]);
    }

    public function deleteCategory($id, Request $request)
    {
        $category = CategoryProduct::find($id);

        if ($category == null)
            return $this->respondErrorWithStatus('Không tồn tại category');
        if ($category->products()->count() > 0)
            return $this->respondErrorWithStatus('Tồn tại bài viết sử dụng category này');
        $category->delete();

        return $this->respondSuccessWithStatus([
            'message' => 'Xoá category thành công'
        ]);
    }

    public function save_post(Request $request)
    {
        if ($request->id) {
            $product = Product::find($request->id);
        } else {
            $product = new Product();
        }

        $product->slug = $request->slug;
        $product->meta_title = $request->meta_title;
        $product->keyword = $request->keyword;
        $product->meta_description = $request->meta_description;

        $product->description = $request->description;
        $product->title = $request->title;
        $product->content = $request->product_content;
        $product->author_id = $this->user->id;
        $product->tags = $request->tags_string;
        $product->category_id = $request->category_id;
        $product->type = 2;
        $product->url = trim_url($request->image_url);
        if ($request->status) {
            $product->status = $request->status;
        } else {
            $product->status = 0;
        }
        $product->save();

        $arr_ids = json_decode($request->categories);
        $product->productCategories()->detach();
        foreach ($arr_ids as $arr_id)
            $product->productCategories()->attach($arr_id->id);

        return $this->respondSuccessWithStatus([
            'product' => $product
        ]);
    }

    public function get_post($postId)
    {
        $post = Product::find($postId);

        if ($post) {
            $post->url = generate_protocol_url($post->url);
            return $this->respondSuccessWithStatus([
                'post' => $post->blogDetailTransform()
            ]);
        } else {
            return $this->respondErrorWithStatus('Bài viết không tồn tại');
        }
    }

    public function get_posts(Request $request)
    {
        $q = trim($request->search);
        $category_id = $request->category_id;
        $limit = 20;
        $posts = Product::leftJoin('product_category_product', 'product_category_product.product_id', '=', 'products.id')
        ->where('products.type', 2);
        if ($category_id) {
            $posts = $posts->where('product_category_product.category_product_id', $category_id);
        }
        if ($q) {
            $posts = $posts->where('products.title', 'like', '%' . $q . '%');
        }
        $posts = $posts->orderBy('products.created_at', 'desc')->groupBy('products.id')->paginate($limit);
        $data = [
            'posts' => $posts->map(function ($post) {
                $data = [
                    'id' => $post->id,
                    'title' => $post->title,
                    'status' => $post->status,
                    'image_url' => $post->url,
                    'thumb_url' => $post->thumb_url,
                    'description' => $post->description,
                    'author' => [
                        'id' => $post->author->id,
                        'name' => $post->author->name,
                        'avatar_url' => $post->author->avatar_url ? $post->author->avatar_url : 'http://colorme.vn/img/user.png',
                    ],
                    'created_at' => format_vn_short_datetime(strtotime($post->created_at)),
                ];
                if ($post->category) {
                    $data['category'] = [
                        'id' => $post->category->id,
                        'name' => $post->category->name,
                    ];
                }

                return $data;
            })
        ];
        return $this->respondWithPagination($posts, $data);
    }

    public function getAllCategory(Request $request)
    {
        $categories = CategoryProduct::all();
        return $this->respondSuccessWithStatus([
            'categories' => $categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                ];
            })
        ]);
    }

    public function changeStatusPost($postId, Request $request)
    {
        $post = Product::find($postId);
        if (!$post) {
            return $this->respondErrorWithStatus('Không tồn tại post');
        }
        $post->status = 1 - $post->status;
        $post->save();
        return $this->respondSuccessWithStatus([
            'message' => 'Thành công'
        ]);
    }

    public function delete_post($postId)
    {
        $post = Product::find($postId);

        if ($post) {
            $post->delete();
            return $this->respondSuccessWithStatus([
                'message' => 'Xóa bài viết thành công',
            ]);
        } else {
            return $this->respondErrorWithStatus('Bài viết không tồn tại');
        }
    }
}
