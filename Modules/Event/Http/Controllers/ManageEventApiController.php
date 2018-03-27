<?php

namespace Modules\Event\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\ManageApiController;
use App\Event;

class ManageEventApiController extends ManageApiController
{
    public function __construct()
    {
    }

    public function saveEvent(Request $request)
    {
        $id = $request->id;
        $name = $request->name;
        $detail = $request->detail;
        $address = $request->address;
        $startTime = $request->start_time;
        $endTime = $request->end_time;
        $startDate = $request->start_date;
        $endDate = $request->end_date;
        $status = $request->status;
        $avatarUrl = $request->avatar_url;
        $coverUrl = $request->cover_url;
        $slug = $request->slug;
        $metaTitle = $request->meta_title;
        $keyword = $request->keyword;
        $metaDescription = $request->meta_description;

        if (!$name || !$avatarUrl || !$slug) {
            return $this->respondErrorWithStatus('Bạn truyền lên thiếu thông tin');
        }

        if ($id) {
            $event = Event::find($id);
        } else {
            $event = new Event();
        }

        $event->name = $name;
        $event->detail = $detail;
        $event->address = $address;
        $event->start_time = $startTime;
        $event->end_time = $endTime;
        $event->start_date = $startDate;
        $event->end_date = $endDate;
        $event->status = $status;
        $event->avatar_url = $avatarUrl;
        $event->cover_url = $coverUrl;
        $event->slug = $slug;
        $event->meta_title = $metaTitle;
        $event->keyword = $keyword;
        $event->meta_description = $metaDescription;
        $event->save();

        return $this->respondSuccessV2([
            'event' => $event
        ]);
    }
}
