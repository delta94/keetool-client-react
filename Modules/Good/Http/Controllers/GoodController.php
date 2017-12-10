<?php

namespace Modules\Good\Http\Controllers;

use App\Good;
use App\Http\Controllers\ManageApiController;
use App\ImportedGoods;
use App\Task;
use App\Warehouse;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Good\Entities\BoardTaskTaskList;
use Modules\Good\Entities\GoodProperty;
use Modules\Good\Entities\GoodPropertyItem;
use Modules\Good\Providers\GoodServiceProvider;
use Modules\Good\Repositories\GoodRepository;


class GoodController extends ManageApiController
{
    private $goodRepository;

    public function __construct(GoodRepository $goodRepository)
    {
        $this->goodRepository = $goodRepository;
        parent::__construct();
    }

    public function assignInfoToGood(&$good, $request)
    {
        //gan thong tin cho san pham
        //cho ra rieng do dai -.-
        $name = trim($request->name);
        $code = trim($request->code);
        $description = $request->description;
        $avatarUrl = $request->avatar_url;
        $coverUrl = $request->cover_url;
        $sale_status = $request->sale_status ? $request->sale_status : 0;
        $highlight_status = $request->highlight_status ? $request->highlight_status : 0;
        $display_status = $request->display_status ? $request->display_status : 0;
        $manufacture_id = $request->manufacture_id;
        $good_category_id = $request->good_category_id;

        $good->name = $name;
        $good->code = $code;
        $good->description = $description;
        $good->avatar_url = $avatarUrl;
        $good->cover_url = $coverUrl;
        $good->sale_status = $sale_status;
        $good->highlight_status = $highlight_status;
        $good->display_status = $display_status;
        $good->manufacture_id = $manufacture_id;
        $good->good_category_id = $good_category_id;
    }

    public function getGoodsWithoutPagination(Request $request)
    {
        if ($request->type) {
            $goods = Good::where("type", $request->type)->get()->map(function ($good) {
                return $good->transform();
            });
        } else {
            $goods = Good::all()->map(function ($good) {
                return $good->transform();
            });
        }

        return $this->respondSuccessWithStatus([
            "goods" => $goods
        ]);
    }


    public function createGoodBeta(Request $request)
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

    function editGoodBeta($goodId, Request $request)
    {
        $good = Good::find($goodId);
        if ($good == null)
            return $this->respondErrorWithData([
                "message" => "Không tìm thấy sản phẩm"
            ]);
        if ($request->price === null || $request->name === null || $request->manufacture_id === null
            || $request->good_category_id === null
            || $request->avatar_url === null || $request->sale_status === null
            || $request->display_status === null || $request->highlight_status === null)
            return $this->respondErrorWithStatus([
                'message' => 'Thiếu trường'
            ]);

        $good->name = $request->name;
        $good->avatar_url = $request->avatar_url;
        $good->price = $request->price;
        $good->manufacture_id = $request->manufacture_id;
        $good->good_category_id = $request->good_category_id;
        $good->sale_status = $request->sale_status;
        $good->display_status = $request->display_status;
        $good->highlight_status = $request->highlight_status;
        $good->save();
        return $this->respondSuccessWithStatus([
            'message' => 'SUCCESS'
        ]);
    }

    public function createGood(Request $request)
    {
        if ($request->code == null && trim($request->code) == null)
            $request->code = "GOOD" . rebuild_date('YmdHis', strtotime(Carbon::now()->toDateTimeString()));
        $images_url = $request->images_url ? $request->images_url : "";
        if ($request->name == null || $request->code == null) {
            return $this->respondErrorWithStatus("Sản phẩm cần có: name, code");
        }
        if ($request->children) {
            //Tao san pham nhieu thuoc tinh
            $children = json_decode($request->children);
            foreach ($children as $child) {
                $good = new Good;
                $this->assignInfoToGood($good, $request);
                $good->barcode = $child->barcode;
                $good->price = $child->price ? $child->price : $request->price;
                $good->save();

                foreach ($child->properties as $p) {
                    $property = new GoodProperty();
                    $property->property_item_id = $p->property_item_id;
                    if ($p->property_item_id)
                        $property->name = GoodPropertyItem::find($p->property_item_id)->name;
                    else $property->name = $p->name;
                    $property->value = $p->value;
                    $property->creator_id = $this->user->id;
                    $property->editor_id = $this->user->id;
                    $property->good_id = $good->id;
                    $property->save();
                }

                $property = new GoodProperty;
                $property->name = 'images_url';
                $property->value = $images_url;
                $property->creator_id = $this->user->id;
                $property->editor_id = $this->user->id;
                $property->good_id = $good->id;
                $property->save();
            }
            return $this->respondSuccessWithStatus(['message' => 'SUCCESS']);
        }

        $good = new Good;
        $this->assignInfoToGood($good, $request);
        $good->price = $request->price;
        $good->barcode = $request->barcode;
        $good->save();

        $properties = json_decode($request->properties);

        foreach ($properties as $p) {
            $property = new GoodProperty();
            $property->property_item_id = $p->property_item_id;
            if ($p->property_item_id)
                $property->name = GoodPropertyItem::find($p->property_item_id)->name;
            else $property->name = $p->name;
            $property->value = $p->value;
            $property->creator_id = $this->user->id;
            $property->editor_id = $this->user->id;
            $property->good_id = $good->id;
            $property->save();
        }

        $property = new GoodProperty;
        $property->name = 'images_url';
        $property->value = $images_url;
        $property->creator_id = $this->user->id;
        $property->editor_id = $this->user->id;
        $property->good_id = $good->id;
        $property->save();
        return $this->respondSuccessWithStatus(["message" => "SUCCESS"]);
    }

    public function editGood($goodId, Request $request)
    {
        if ($request->code == null && trim($request->code) == null)
            $request->code = "GOOD" . rebuild_date('YmdHis', strtotime(Carbon::now()->toDateTimeString()));
        $images_url = $request->images_url ? $request->images_url : "";
        if ($request->name == null || $request->code == null) {
            return $this->respondErrorWithStatus("Sản phẩm cần có: name, code");
        }
        if ($request->children) {
            //Sua san pham nhieu thuoc tinh
            $children = json_decode($request->children);
            foreach ($children as $child) {
                $good = Good::find($child->id);
                if ($good == null)
                    $good = new Good;
                $this->assignInfoToGood($good, $request);
                $good->barcode = $child->barcode;
                $good->price = $child->price ? $child->price : $request->price;
                $good->save();

                GoodProperty::where('good_id', $good->id)->delete();
                foreach ($child->properties as $p) {
                    $property = new GoodProperty();
                    $property->property_item_id = $p->property_item_id;
                    if ($p->property_item_id)
                        $property->name = GoodPropertyItem::find($p->property_item_id)->name;
                    else $property->name = $p->name;
                    $property->value = $p->value;
                    $property->creator_id = $this->user->id;
                    $property->editor_id = $this->user->id;
                    $property->good_id = $good->id;
                    $property->save();
                }

                $property = new GoodProperty;
                $property->name = 'images_url';
                $property->value = $images_url;
                $property->creator_id = $this->user->id;
                $property->editor_id = $this->user->id;
                $property->good_id = $good->id;
                $property->save();
            }
            return $this->respondSuccessWithStatus(['message' => 'SUCCESS']);
        }

        $good = Good::find($goodId);
        if ($good == null)
            return $this->respondErrorWithStatus([
                'messgae' => 'non-existing good'
            ]);
        $this->assignInfoToGood($good, $request);
        $good->price = $request->price;
        $good->barcode = $request->barcode;
        $good->save();

        $properties = json_decode($request->properties);

        DB::table('good_properties')->where('name', '<>', 'images_url')->where('good_id', '=', $good->id)->delete();

        foreach ($properties as $p) {
            $property = new GoodProperty();
            $property->property_item_id = $p->property_item_id;
            if ($p->property_item_id)
                $property->name = GoodPropertyItem::find($p->property_item_id)->name;
            else $property->name = $p->name;
            $property->value = $p->value;
            $property->creator_id = $this->user->id;
            $property->editor_id = $this->user->id;
            $property->good_id = $good->id;
            $property->save();
        }
        $property = GoodProperty::where('good_id', $goodId)->where('name', 'images_url')->first();
        if ($property == null) {
            $property = new GoodProperty;
            $property->name = 'images_url';
        }
        $property->value = $images_url;
        $property->creator_id = $this->user->id;
        $property->editor_id = $this->user->id;
        $property->good_id = $good->id;
        $property->save();
        return $this->respondSuccessWithStatus(["message" => "SUCCESS"]);
    }

    public function propertyList($goodIds)
    {
        //get property list from good siblings
        $propertyItemIds = GoodProperty::where('name', '<>', 'images_url')->whereIn('good_id', $goodIds)->groupBy('property_item_id')->pluck('property_item_id')->toArray();
        $data = [];
        foreach ($propertyItemIds as $propertyItemId) {
            $propertiesValue = GoodProperty::where('name', '<>', 'images_url')->whereIn('good_id', $goodIds)->where('property_item_id', $propertyItemId)
                ->groupBy('value')->pluck('value')->toArray();
            array_push($data, [
                'property_item_id' => $propertyItemId,
                'name' => GoodPropertyItem::find($propertyItemId)->name,
                'value' => $propertiesValue,
            ]);
        }
        return $data;
    }

    public function good($goodId)
    {
        $good = Good::find($goodId);
        if ($goodId == null)
            return $this->respondErrorWithStatus([
                'message' => 'khong ton tai san pham'
            ]);
        $data = $good->goodProcessTransform();
        $goodProperty = GoodProperty::where('good_id', $goodId)->where('name', 'images_url')->first();
        if ($goodProperty == null)
            $images_url = null;
        else
            $images_url = $goodProperty->value;
        $goods_count = Good::where('code', $good->code)->count();
        if ($goods_count > 1) {
            $children = Good::where('code', $good->code)->get();
            $childrenIds = Good::where('code', $good->code)->pluck('id')->toArray();
            $data['property_list'] = $this->propertyList($childrenIds);
            $data->forget('properties');
            $data['children'] = $children->map(function ($child) {
                return [
                    'id' => $child->id,
                    'barcode' => $child->barcode,
                    'price' => $child->price,
                    'check' => true,
                    'properties' => $child->properties->map(function ($property) {
                        return $property->transform();
                    }),
                ];
            });
        }
        $data['images_url'] = $images_url;
        $data['goods_count'] = $goods_count;
        return $this->respondSuccessWithStatus([
            "good" => $data
        ]);
    }

    public function getPropertyItems($taskId, Request $request)
    {
        $task = Task::find($taskId);
        if ($task == null) {
            return $this->respondErrorWithStatus("Công việc không tồn tại");
        }

        $type = $request->type;
        $propertyItems = $this->goodRepository->getPropertyItems($type, $task);
        $boards = $this->goodRepository->getProjectBoards($type, $task);
        $optionalBoards = BoardTaskTaskList::where("task_id", $taskId)->get();


        return $this->respondSuccessWithStatus([
            "good_property_items" => $propertyItems,
            "boards" => $boards,
            "selected_boards" => $optionalBoards->map(function ($optionalBoard) {
                return [
                    "id" => $optionalBoard->board->id,
                    "title" => $optionalBoard->board->title,
                    "value" => $optionalBoard->board->id,
                    "label" => $optionalBoard->board->title,
                ];
            })
        ]);
    }

    public function getAllGoods(Request $request)
    {
        $limit = $request->limit && $request->limit != -1 ? $request->limit : 20;
        $keyword = $request->search;
        $type = $request->type;
        $manufacture_id = $request->manufacture_id;
        $good_category_id = $request->good_category_id;
        $startTime = $request->start_time;
        $endTime = $request->end_time;
        $sale_status = $request->sale_status;
        $display_status = $request->display_status;
        $highlight_status = $request->highlight_status;
        $goods = Good::groupBy('code');
        $goods = $goods->where(function ($query) use ($keyword) {
            $query->where("name", "like", "%" . $keyword . "%")->orWhere("code", "like", "%" . $keyword . "%");
        });
        if ($sale_status != null)
            $goods = $goods->where('sale_status', $sale_status);
        if ($display_status != null)
            $goods = $goods->where('display_status', $display_status);
        if ($highlight_status != null)
            $goods = $goods->where('highlight_status', $highlight_status);
        if ($type)
            $goods = $goods->where("type", $type);
        if ($manufacture_id)
            $goods = $goods->where('manufacture_id', $manufacture_id);
        if ($good_category_id)
            $goods = $goods->where('good_category_id', $good_category_id);
        if ($startTime)
            $goods = $goods->whereBetween('created_at', array($startTime, $endTime));

        $goods = $goods->orderBy("created_at", "desc")->paginate($limit);
        return $this->respondWithPagination(
            $goods,
            [
                "goods" => $goods->map(function ($good) {
                    $goods_count = Good::where('code', $good->code)->count();
                    $data = $good->transform();
                    if ($goods_count == 1)
                        $warehouses_count = ImportedGoods::where('good_id', $good->id)
                            ->where('quantity', '>', 0)->select(DB::raw('count(DISTINCT warehouse_id) as count'))->first();
                    else {
                        $children = Good::where('code', $good->code)->get();
                        $childrenIds = Good::where('code', $good->code)->pluck('id')->toArray();
                        $warehouses_count = ImportedGoods::whereIn('good_id', $childrenIds)
                            ->where('quantity', '>', 0)->select(DB::raw('count(DISTINCT warehouse_id) as count'))->first();
                        $data['children'] = $children->map(function ($child) {
                            return [
                                'id' => $child->id,
                                'barcode' => $child->barcode,
                                'price' => $child->price,
                                'properties' => $child->properties->map(function ($property) {
                                    return $property->transform();
                                }),
                            ];
                        });
                    }
                    $data['warehouses_count'] = $warehouses_count->count;
                    $data['goods_count'] = $goods_count;
                    return $data;
                })
            ]
        );
    }

    public function goodInformation(Request $request)
    {
        $keyword = $request->search;
        $type = $request->type;
        $manufacture_id = $request->manufacture_id;
        $good_category_id = $request->good_category_id;
        $startTime = $request->start_time;
        $endTime = $request->end_time;
        $sale_status = $request->sale_status;
        $display_status = $request->display_status;
        $highlight_status = $request->highlight_status;
        $goods = Good::query();
        $goods = $goods->where(function ($query) use ($keyword) {
            $query->where("name", "like", "%" . $keyword . "%")->orWhere("code", "like", "%" . $keyword . "%");
        });
        if ($sale_status != null)
            $goods = $goods->where('sale_status', $sale_status);
        if ($display_status != null)
            $goods = $goods->where('display_status', $display_status);
        if ($highlight_status != null)
            $goods = $goods->where('highlight_status', $highlight_status);
        if ($type)
            $goods = $goods->where("type", $type);
        if ($manufacture_id)
            $goods = $goods->where('manufacture_id', $manufacture_id);
        if ($good_category_id)
            $goods = $goods->where('good_category_id', $good_category_id);
        if ($startTime)
            $goods = $goods->whereBetween('created_at', array($startTime, $endTime));
        $count = $goods->count();
        $goods = $goods->get();
        return $this->respondSuccessWithStatus([
            'count' => $count,
            'total_quantity' => $goods->reduce(function ($total, $good) {
                return $total + $good->importedGoods->reduce(function ($total, $importedGoods) {
                        return $total + $importedGoods->quantity;
                    }, 0);
            }, 0)
        ]);
    }

    public function goodsByStatus(Request $request)
    {
        $status = $request->status;
        $limit = $request->limit ? $request->limit : 20;
        if ($status == null)
            return $this->respondErrorWithStatus([
                'message' => 'status null'
            ]);
        if ($status == 'deleted')
            $goods = DB::table('goods')->where('status', 'deleted')->paginate($limit);
        else
            $goods = Good::where('status', $status)->orderBy("created_at", "desc")->paginate($limit);
        return $this->respondWithPagination(
            $goods,
            [
                "goods" => $goods->map(function ($good) {
                    return $good->transform();
                })
            ]
        );
    }

    public function deleteGood($good_id, Request $request)
    {
        $good = Good::find($good_id);
        if ($good == null)
            return $this->respondSuccessWithStatus([
                "message" => "Không tìm thấy sản phẩm"
            ]);
        $good->status = 'deleted';
        foreach ($good->properties as $property) {
            $property->delete();
        }
        $good->delete();
        return $this->respondSuccessWithStatus([
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


    public function createChildGood($goodId, Request $request)
    {
        if ($request->code == null || $request->taskId == null) {
            return $this->respondErrorWithStatus("Thiếu code hoặc taskId");
        }
        $currentGood = Good::where("code", $request->code)->first();
        if ($currentGood != null) {
            return $this->respondErrorWithStatus("Sản phẩm với mã này đã tồn tại");
        }

        $parentGood = Good::find($goodId);

        $good = $parentGood->replicate();
        $good->parent_id = $goodId;
        $good->code = $request->code;
        $good->name = $request->name;
        $good->good_category_id = $parentGood->good_category_id;
        $good->save();


        foreach ($parentGood->properties as $property) {
            $childProperty = $property->replicate();
            $childProperty->good_id = $good->id;
            $childProperty->save();
        }

        $parentTask = Task::find($request->taskId);

        $taskList = $parentTask->taskList;

        $newTaskList = $taskList->replicate();
        $newTaskList->save();

        foreach ($taskList->tasks as $task) {
            $newTask = $task->replicate();
            $newTask->task_list_id = $newTaskList->id;
            if ($task->order < $parentTask->order) {
                $newTask->status = true;
            } else {
                $newTask->status = false;
            }
            $newTask->save();
        }

        $card = $parentGood->cards()->first();
        if ($card == null) {
            return $this->respondErrorWithStatus("Không tìm thấy thẻ của sản phẩm cha");
        } else {
            $card = $card->replicate();
            $card->good_id = $good->id;
            $card->board_id = $parentTask->current_board_id;
            $card->title = $good->name;
            $card->save();
        }
        $newTaskList->card_id = $card->id;
        $newTaskList->save();
        return $this->respondSuccessWithStatus([
            "card" => $card->transform()
        ]);
    }

}




