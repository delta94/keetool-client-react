<?php
/**
 * Created by PhpStorm.
 * User: caoquan
 * Date: 10/11/17
 * Time: 2:43 PM
 */

namespace Modules\Good\Repositories;


use App\Project;
use Modules\Good\Entities\GoodPropertyItem;

class GoodRepository
{
    public function getPropertyItems($type)
    {
        $goodPropertyItems = GoodPropertyItem::where("type", $type)->orderBy("name")->get()->map(function ($item) {
            return [
                "label" => $item->name,
                "value" => $item->name,
                "id" => $item->id
            ];
        });
        return $goodPropertyItems;
    }

    public function getProjectBoards($type)
    {
        $project = Project::where("status", $type)->first();
        return $project->boards()->where("status", "open")->get()->map(function ($board) {
            return [
                "id" => $board->id,
                "title" => $board->title,
                "label" => $board->title,
                "value" => $board->id
            ];
        });
    }
}