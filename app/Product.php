<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{

    use SoftDeletes;

    protected $table = 'products';

    protected $dates = ['deleted_at'];

    public function author()
    {
        return $this->belongsTo('App\User', 'author_id');
    }

    public function feature()
    {
        return $this->belongsTo('App\User', 'feature_id');
    }

    public function likes()
    {
        return $this->hasMany('App\Like', 'product_id');
    }

    public function comments()
    {
        return $this->hasMany('App\Comment', 'product_id');
    }

    public function notifications()
    {
        return $this->hasMany('App\Notification', 'product_id');
    }

    public function category()
    {
        return $this->belongsTo(CategoryProduct::class, 'category_id');
    }

    public function productCategories()
    {
        return $this->belongsToMany(CategoryProduct::class, 'product_category_product', 'product_id', 'category_product_id');
    }

    public function language()
    {
        return $this->belongsTo(Language::class, 'language_id');
    }

    public function images()
    {
        return $this->hasMany('App\Image', 'product_id');
    }

    public function colors()
    {
        return $this->hasMany('App\Color', 'product_id');
    }

    public function topicAttendance()
    {
        return $this->hasOne(TopicAttendance::class, 'product_id', 'id');
    }

    public function blogTransform()
    {
        return [
            "id" => $this->id,
            "url" => $this->url,
            "share_url" => config('app.protocol') . config('app.domain') . '/blog/post/' . $this->id,
            "description" => $this->description,
            "author" => [
                "id" => $this->author->id,
                "name" => $this->author->name,
                "avatar_url" => $this->author->avatar_url
            ],
            "title" => $this->title,
            "category" => $this->category ? $this->category->name : null,
            "thumb_url" => $this->thumb_url,
            "slug" => $this->slug,
            "meta_description" => $this->meta_description,
            "meta_title" => $this->meta_title,
            "keyword" => $this->keyword,
        ];
    }

    public function blogDetailTransform()
    {
        $data = $this->blogTransform();
        if ($this->author) {
            $data["author"] = [
                "id" => $this->author->id,
                "email" => $this->author->email,
                "name" => $this->author->name,
                "avatar_url" => $this->author->avatar_url
            ];
        }


        $data["categories"] = $this->productCategories;
        $data["language"] = $this->language->id;

        $data["created_at"] = format_date($this->created_at);
        $data["content"] = $this->content;
        $data['tags'] = $this->tags;
        $data["related_posts"] = $posts_related = Product::where('id', '<>', $this->id)->inRandomOrder()->limit(3)->get()->map(function ($post) {
            return $post->blogTransform();
        });
        return $data;
    }

}
