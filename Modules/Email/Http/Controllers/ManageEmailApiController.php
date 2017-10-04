<?php

namespace Modules\Email\Http\Controllers;

use App\EmailCampaign;
use App\Http\Controllers\ManageApiController;
use App\Repositories\EmailRepository;
use App\Subscriber;
use App\SubscribersList;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Maatwebsite\Excel\Facades\Excel;

class ManageEmailApiController extends ManageApiController
{
    protected $emailRepository;

    public function __construct(EmailRepository $emailRepository)
    {
        parent::__construct();
        $this->emailRepository = $emailRepository;
    }

    public function subscribers_list(Request $request)
    {

        $query = $request->search;
        $limit = 20;
        if ($query) {
            $subscribers_lists = SubscribersList::where('name', 'like', '%' . $query . '%')
                ->orderBy('created_at', 'desc')->paginate($limit);
        } else {
            $subscribers_lists = SubscribersList::orderBy('created_at', 'desc')->paginate($limit);
        }
        $data = [
            'subscribers_list' => $this->emailRepository->subscribers_list($subscribers_lists)
        ];

        return $this->respondWithPagination($subscribers_lists, $data);
    }

    public function subscribers_list_all()
    {
        $subscribers_lists = SubscribersList::orderBy('created_at', 'desc')->get();
        $subscribers_lists = $this->emailRepository->subscribers_list($subscribers_lists);
        return $this->respondSuccessWithStatus([
            'subscribers_list' => $subscribers_lists
        ]);
    }

    public function delete_subscribers_list($subscribers_list_id)
    {
        $subscribers_list = SubscribersList::find($subscribers_list_id);
        $subscribers_list->delete();

        return $this->respondSuccess("Xóa subscribers list thành công");
    }

    public function store_subscribers_list(Request $request)
    {
        if ($request->id) {
            $sub_list = SubscribersList::find($request->id);
        } else {
            $sub_list = new SubscribersList();
        }

        $sub_list->name = $request->name;
        $sub_list->save();

        return $this->respondSuccessWithStatus([
            'subscribers_list' => $this->emailRepository->subscribers_list_item($sub_list)
        ]);

    }

    public function subscribers(Request $request)
    {
        $list_id = $request->list_id;
        $search = $request->search;

        $limit = 20;
        if ($search != null) {
            $subscribers = SubscribersList::find($list_id)->subscribers()->where('email', 'like', '%' . $search . '%');
        } else {
            $subscribers = SubscribersList::find($list_id)->subscribers();
        }

        $subscribers = $subscribers->orderBy('created_at', 'desc')->paginate($limit);

        $data = [
            'subscribers' => $subscribers->map(function ($subscriber) {
                return $this->emailRepository->subscriber($subscriber);
            }),
        ];

        return $this->respondWithPagination($subscribers, $data);

    }

    public function add_subscriber(Request $request)
    {
        $list_id = $request->list_id;
        $email = $request->email;
        $name = $request->name;

        $this->emailRepository->add_subscriber($list_id, $email, $name);

        return $this->respondSuccess("Thêm thành công");
    }

    public function edit_subscriber(Request $request)
    {
        $subscriber = Subscriber::find($request->id);

        $subscriber->name = $request->name;
        $subscriber->email = $request->email;

        $subscriber->save();
        return $this->respondSuccessWithStatus([
            'subscriber' => $this->emailRepository->subscriber($subscriber)
        ]);
    }

    public function upfile_add_subscribers(Request $request)
    {
        $list_id = $request->list_id;
        $file = $request->file('csv');

        Excel::load($file->getRealPath(), function ($reader) use (&$duplicated, &$imported, $list_id) {
            // Getting all results
            $results = $reader->all();
            foreach ($results as $i) {
                $new_email = extract_email_from_str($i->email);
                $this->emailRepository->add_subscriber($list_id, $new_email, $i->name);
            }
        })->get();

        return $this->respondSuccess("Thêm thành công");
    }

    public function delete_subscriber(Request $request)
    {
        $list_id = $request->list_id;
        $subscriber = SubscribersList::find($list_id)->subscribers()->where('id', $request->subscriber_id)->first();

        if ($subscriber) {
            $subscriber->subscribers_lists()->detach($list_id);
            return $this->respondSuccessWithStatus([
                'message' => "Xóa email thành công"
            ]);
        }

        return $this->respondErrorWithStatus("Subscriber không tồn tại");
    }

    public function get_campaigns(Request $request)
    {
        $query = $request->search;
        $limit = 20;


        $campaigns = EmailCampaign::leftJoin('email_forms', 'email_campaigns.form_id', '=', 'email_forms.id')
            ->select('email_campaigns.*', 'email_forms.hide')
            ->where(function ($q) {
                $q->whereNull("email_forms.hide")->orWhere('email_forms.hide', 0)->orWhere(function ($q) {
                    $q->where('email_forms.hide', 1)->where('email_forms.creator', $this->user->id);
                });
            });

        if ($request->owner_id) {
            $campaigns = $campaigns->where('email_campaigns.name', 'like', '%' . $query . '%')
                ->where('owner_id', $request->owner_id)->orderBy('email_campaigns.created_at', 'desc')->paginate($limit);
        } else {
            if ($query) {
                $campaigns = $campaigns->where('email_campaigns.name', 'like', '%' . $query . '%')
                    ->orderBy('email_campaigns.created_at', 'desc')->paginate($limit);
            } else {
                $campaigns = $campaigns->orderBy('email_campaigns.created_at', 'desc')->paginate($limit);
            }
        }

        $data = [
            'campaigns' => $this->emailRepository->campaingns($campaigns)
        ];


        return $this->respondWithPagination($campaigns, $data);
    }

    public function store_campaign(Request $request)
    {

        if ($request->id) {
            $campaign = EmailCampaign::find($request->id);
        } else {
            $campaign = new EmailCampaign();
            $campaign->owner_id = $this->user->id;
        }

        $campaign->sended = $request->send_status == 1 ? 1 : 0;
        $campaign->name = $request->name;
        $campaign->subject = $request->subject;
        $campaign->form_id = $request->form_id;
        $campaign->timer = $request->timer;

        $subscribers_list_ids = $request->subscribers_list;


        $campaign->save();

        $current_list_ids = $campaign->subscribers_lists()->get()->pluck('id')->toArray();
        foreach ($subscribers_list_ids as $l) {
            if (!in_array($l, $current_list_ids)) {
                $campaign->subscribers_lists()->attach($l);
            }
        }
        foreach ($current_list_ids as $i) {
            if (!in_array($i, $subscribers_list_ids)) {
                $campaign->subscribers_lists()->detach($i);
            }
        }

        return $this->respondSuccessWithStatus([
            'campaign' => $this->emailRepository->campaingn($campaign)
        ]);
    }

    public function delete_campaign($campaign_id)
    {
        $campaign = EmailCampaign::find($campaign_id);

        if ($campaign->sended == 0) {
            $campaign->delete();
            return $this->respondSuccessWithStatus(['message' => "Xóa chiến dịch thành công"]);
        }

        return $this->respondErrorWithStatus("Không thể xóa chiến dịch này");
    }

    public function subscribers_list_item($subscribers_list_id)
    {
        $subscribers_list = SubscribersList::find($subscribers_list_id);
        if ($subscribers_list) {
            return $this->respondSuccessWithStatus([
                'subscribers_list_item' => $this->emailRepository->subscribers_list_item($subscribers_list)
            ]);
        }

        return $this->respondErrorWithStatus("Có lỗi xảy ra");
    }
}
