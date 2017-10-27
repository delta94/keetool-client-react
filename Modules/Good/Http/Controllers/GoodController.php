<?php

namespace Modules\Good\Http\Controllers;

use App\Good;
use App\Http\Controllers\ManageApiController;
use App\Project;
use App\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Good\Entities\GoodProperty;
use Modules\Good\Entities\GoodPropertyItem;
use Modules\Good\Entities\GoodPropertyItemTask;
use Modules\Good\Repositories\GoodRepository;


class GoodController extends ManageApiController
{
    private $goodRepository;

    public function __construct(GoodRepository $goodRepository)
    {
        $this->goodRepository = $goodRepository;
        parent::__construct();
    }

    public function loadGoodTaskProperties($goodId, $taskId)
    {
        $task = Task::find($taskId);
        $goodPropertyNames = $task->goodPropertyItems->pluck("name");
        $goodProperties = GoodProperty::where("good_id", $goodId)->whereIn("name", $goodPropertyNames)->get();
        return $this->respondSuccessWithStatus([
            "good_properties" => $goodProperties->map(function ($goodProperty) {
                return [
                    "name" => $goodProperty->name,
                    "value" => $goodProperty->value
                ];
            })
        ]);
    }

    public function saveGoodProperties($id, Request $request)
    {
        $goodProperties = collect(json_decode($request->good_properties));
        $goodPropertyNames = $goodProperties->pluck("name")->toArray();


        GoodProperty::where("good_id", $id)->whereIn("name", $goodPropertyNames)->delete();

        foreach ($goodProperties as $property) {
            $goodProperty = new GoodProperty();
            $goodProperty->name = $property->name;
            $goodProperty->value = $property->value;
            $goodProperty->good_id = $id;
            $goodProperty->save();
        }
        return $this->respondSuccessWithStatus(["message" => "success"]);
    }

    public function createGood(Request $request)
    {
        $name = $request->name;
        $code = $request->code;
        $description = $request->description;
        $price = $request->price;
        $avatarUrl = $request->avatar_url;
        $coverUrl = $request->cover_url;

        if (is_null("name") && is_null("code")) {
            return $this->respondErrorWithStatus("Sản phẩm cần có: name, code");
        }

        $id = $request->id;
        if ($id) {
            $good = Good::find($id);
        } else {
            $good = new Good();
        }
        $good->name = $name;
        $good->code = $code;
        $good->description = $description;
        $good->price = $price;
        $good->avatar_url = $avatarUrl;
        $good->cover_url = $coverUrl;
        if ($request->type) {
            $good->type = $request->type;
        }
        $good->save();

//        $properties = json_decode($request->properties);

        $properties = json_decode($request->properties);

        DB::table('good_properties')->where('good_id', '=', $good->id)->delete();

        foreach ($properties as $p) {
            $property = new GoodProperty();
            $property->name = $p->name;
            $property->value = $p->value;
            $property->creator_id = $this->user->id;
            $property->editor_id = $this->user->id;
            $property->good_id = $good->id;
            $property->save();
        }

        $files = json_decode($request->files_str);

        foreach ($files as $file) {
            if (!$good->files->contains($file->id)) {
                $good->files()->attach($file->id);
            }
        }

        return $this->respondSuccessWithStatus(["message" => "success"]);
    }

    public function good($id)
    {
        $good = Good::find($id);
        return $this->respondSuccessWithStatus([
            "good" => $good->transform()
        ]);
    }

    public function createGoodPropertyItem(Request $request)
    {
        if ($request->name == null)
            return $this->respondErrorWithStatus("Thiếu trường name");

        $goodPropertyItem = GoodPropertyItem::where("name", $request->name)->first();
        $user = $this->user;
        if ($request->id) {
            if ($goodPropertyItem != null && $goodPropertyItem->id != $request->id) {
                return $this->respondErrorWithStatus("Đã tồn tại thuộc tính với tên là " . $request->name);
            }
            $good_property_item = GoodPropertyItem::find($request->id);
            $good_property_item->editor_id = $user->id;
        } else {
            if ($goodPropertyItem != null) {
                return $this->respondErrorWithStatus("Đã tồn tại thuộc tính với tên là " . $request->name);
            }
            $good_property_item = new GoodPropertyItem();
            $good_property_item->creator_id = $user->id;
            $good_property_item->editor_id = $user->id;
        }
        $good_property_item->name = $request->name;
        $good_property_item->prevalue = $request->prevalue;
        $good_property_item->preunit = $request->preunit;
        $good_property_item->type = $request->type;
        $good_property_item->save();
        return $this->respondSuccessWithStatus(["message" => "success"]);
    }

    public function getGoodPropertyItem($id)
    {
        $goodPropertyItem = GoodPropertyItem::find($id);
        if ($goodPropertyItem == null) {
            return $this->respondErrorWithStatus("Thuộc tính không tồn tại");
        }
        return $this->respondSuccessWithStatus(["good_property_item" => $goodPropertyItem->transform()]);
    }

    public function propertiesOfGood($good_id)
    {
        $goodProperties = GoodProperty::where('good_id', $good_id);
        return $this->respondSuccessWithStatus([
            'properties' => $goodProperties,
        ]);
    }

    public function allPropertyItems(Request $request)
    {
        $limit = 20;
        $keyword = $request->search;
        if ($request->type)
            $goodPropertyItems = GoodPropertyItem::where("type", $request->type)
                ->where(function ($query) use ($keyword) {

                    $query->where("name", "like", "%$keyword%")
                        ->orWhere("prevalue", "like", "%$keyword%")
                        ->orWhere("preunit", "like", "%$keyword%");
                })->orderBy("created_at", "desc")->paginate($limit);
        else
            $goodPropertyItems = GoodPropertyItem::where(function ($query) use ($keyword) {
                $query->where("prevalue", "like", "%$keyword%")->orWhere("preunit", "like", "%$keyword%");
            })->orderBy("created_at", "desc")->paginate($limit);
        return $this->respondWithPagination(
            $goodPropertyItems,
            [
                "good_property_items" => $goodPropertyItems->map(function ($goodPropertyItem) {
                    return $goodPropertyItem->transform();
                })
            ]
        );
    }

    public function deletePropertyItem($property_item_id, Request $request)
    {
        $goodPropertyItem = GoodPropertyItem::find($property_item_id);
        $goodPropertyItem->delete();
        return $this->respondSuccessWithStatus([
            'message' => "success"
        ]);
    }

    public function addPropertyItemsTask($task_id, Request $request)
    {
        $goodPropertyItems = json_decode($request->good_property_items);
        $task = Task::find($task_id);
        $task->current_board_id = $request->current_board_id;
        $task->target_board_id = $request->target_board_id;
        $task->goodPropertyItems()->detach();
        $task->goodPropertyItems()->attach(collect($goodPropertyItems)->pluck("id")->toArray());
        $task->save();

        return $this->respondSuccessWithStatus([
            'task' => $task->transform()
        ]);
    }

    public function getPropertyItems(Request $request)
    {
        $type = $request->type;
        $propertyItems = $this->goodRepository->getPropertyItems($type);
        $boards = $this->goodRepository->getProjectBoards($type);

        return $this->respondSuccessWithStatus([
            "good_property_items" => $propertyItems,
            "boards" => $boards
        ]);
    }

    public function getAllGoods(Request $request)
    {
        $keyword = $request->search;
        $type = $request->type;
        if ($request->limit)
            $limit = $request->limit;
        else
            $limit = 20;
        if ($type) {
            $goods = Good::where("type", $type)->where(function ($query) use ($keyword) {
                $query->where("name", "like", "%$keyword%")->orWhere("description", "like", "%$keyword%");
            });
        } else {
            $goods = Good::where(function ($query) use ($keyword) {
                $query->where("name", "like", "%$keyword%")->orWhere("description", "like", "%$keyword%");
            });
        }

        $goods = $goods->orderBy("created_at", "desc")->paginate($limit);

        return $this->respondWithPagination(
            $goods,
            [
                "goods" => $goods->map(function ($good) {
                    return $good->transform();
                })
            ]
        );
    }

    public function editGood($goodId, Request $request)
    {
        $good = Good::find($goodId);
        if ($good == null)
            return $this->respondErrorWithData([
                "message" => "Không tìm thấy sản phẩm"
            ]);
        if (!$request->price || !$request->name || !$request->manufacture_id || !$request->category_id)
            return $this->respondErrorWithStatus([
                'message' => 'Thiếu trường'
            ]);
        $good->name = $request->name;
        $good->avatar_url = $request->avatat_url;
        $good->price = $request->price;
        $good->manufacture_id = $request->manufacture_id;
        $good->category_id = $request->category_id;
        $good->save();
        return $this->respondSuccessWithStatus([
            'message' => 'SUCCESS'
        ]);
    }

    public function deleteGood($good_id, Request $request)
    {
        $good = Good::find($good_id);
        if ($good == null) return $this->respondErrorWithData([
            "message" => "Không tìm thấy sản phẩm"
        ]);
        $good->delete();
        return $this->respondErrorWithData([
            "message" => "Xóa sản phẩm thành công"
        ]);
    }

    public function updatePrice($goodId, Request $request)
    {
        $good = Good::find($goodId);
        if (!$good)
            return $this->respondErrorWithStatus([
                'message' => 'khong co san pham'
            ]);
        if (!$request->price)
            return $this->respondErrorWithStatus([
                'message' => 'thieu gia'
            ]);
        $good->price = $request->price;
        $good->save();
        return $this->respondSuccessWithStatus([
            'message' => 'ok',
        ]);
    }
}
