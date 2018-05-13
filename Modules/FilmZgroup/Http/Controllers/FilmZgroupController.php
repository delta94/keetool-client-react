<?php

namespace Modules\FilmZgroup\Http\Controllers;

use App\Film;
use App\FilmSession;
use App\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Carbon\Carbon;

class FilmZgroupController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function reloadFilmStatus(Film $film)
    {
        if (count($film->film_sessions) > 0) {
            $sessions = $film->film_sessions()->where('start_date', '>=', date('Y-m-d'))->get();
            if (count($sessions) == 0 && $film->film_status == 1) {
                $film->film_status = 0;
                $film->save();
            } elseif (count($sessions) > 0) {
                $film->film_status = 1;
                $film->save();
            }
        } elseif ($film->film_status == 1) {
            $film->film_status = 0;
            $film->save();
        }
    }

    public function index()
    {
        $filmsR = Film::all();
        foreach ($filmsR as $filmR) {
            $this->reloadFilmStatus($filmR);
        }
        $today = Carbon::today();
        $day = Carbon::today();
        $todaySessions = FilmSession::where('start_date', '=', date('Y-m-d'))->get();
        $after1DaySessions = FilmSession::where('start_date','=', Carbon::createFromFormat('Y-m-d H:i:s', $today->addDays(1)->toDateString() . ' 00:00:00'))->get();
        $after2DaySessions = FilmSession::where('start_date','=', Carbon::createFromFormat('Y-m-d H:i:s', $today->addDays(1)->toDateString() . ' 00:00:00'))->get();
        $after3DaySessions = FilmSession::where('start_date','=', Carbon::createFromFormat('Y-m-d H:i:s', $today->addDays(1)->toDateString() . ' 00:00:00'))->get();
        $after4DaySessions = FilmSession::where('start_date','=', Carbon::createFromFormat('Y-m-d H:i:s', $today->addDays(1)->toDateString() . ' 00:00:00'))->get();
        $after5DaySessions = FilmSession::where('start_date','=', Carbon::createFromFormat('Y-m-d H:i:s', $today->addDays(1)->toDateString() . ' 00:00:00'))->get();
        $after6DaySessions = FilmSession::where('start_date','=', Carbon::createFromFormat('Y-m-d H:i:s', $today->addDays(1)->toDateString() . ' 00:00:00'))->get();

        $filmsComing = Film::where('film_status',2)->orderBy('release_date')->get();
        $favoriteFilms = Film::where('is_favorite', true)->get();

        $sessionsShowing = FilmSession::where('start_date','>=',date('Y-m-d'))->orderBy('start_date','desc')->get();
        $this->data = [
            'filmsComing' => $filmsComing,
            'sessionsShowing' => $sessionsShowing,
            'day' => $day,
            "todaySessions" => $todaySessions,
            'after1DaySessions' => $after1DaySessions,
            'after2DaySessions' => $after2DaySessions,
            'after3DaySessions' => $after3DaySessions,
            'after4DaySessions' => $after4DaySessions,
            'after5DaySessions' => $after5DaySessions,
            'after6DaySessions' => $after6DaySessions,
            'favoriteFilms' => $favoriteFilms,
        ];

        return view('filmzgroup::index', $this->data);
    }

    public function film($id)
    {
        $film = Film::find($id);

        $sessionsShowing = $film->film_sessions()->where('start_date','>=',date('Y-m-d'))->orderBy('start_date','desc')->get();
        $today = Carbon::today();
        $day = Carbon::today();
        $todaySessions = $film->film_sessions()->where('start_date', '=', date('Y-m-d'))->get();
        $after1DaySessions = $film->film_sessions()->where('start_date','=', Carbon::createFromFormat('Y-m-d H:i:s', $today->addDays(1)->toDateString() . ' 00:00:00'))->get();
        $after2DaySessions = $film->film_sessions()->where('start_date','=', Carbon::createFromFormat('Y-m-d H:i:s', $today->addDays(1)->toDateString() . ' 00:00:00'))->get();
        $after3DaySessions = $film->film_sessions()->where('start_date','=', Carbon::createFromFormat('Y-m-d H:i:s', $today->addDays(1)->toDateString() . ' 00:00:00'))->get();
        $after4DaySessions = $film->film_sessions()->where('start_date','=', Carbon::createFromFormat('Y-m-d H:i:s', $today->addDays(1)->toDateString() . ' 00:00:00'))->get();
        $after5DaySessions = $film->film_sessions()->where('start_date','=', Carbon::createFromFormat('Y-m-d H:i:s', $today->addDays(1)->toDateString() . ' 00:00:00'))->get();
        $after6DaySessions = $film->film_sessions()->where('start_date','=', Carbon::createFromFormat('Y-m-d H:i:s', $today->addDays(1)->toDateString() . ' 00:00:00'))->get();
        $images_url = $this->multiStringToArray($film->images_url);
        $favoriteFilms = Film::where('is_favorite', true)->get();

        $this->data = [
            'film' => $film,
            'sessionsShowing' => $sessionsShowing,
            'day' => $day,
            "todaySessions" => $todaySessions,
            'after1DaySessions' => $after1DaySessions,
            'after2DaySessions' => $after2DaySessions,
            'after3DaySessions' => $after3DaySessions,
            'after4DaySessions' => $after4DaySessions,
            'after5DaySessions' => $after5DaySessions,
            'after6DaySessions' => $after6DaySessions,
            'images_url' => $images_url,
            'favoriteFilms' => $favoriteFilms,

        ];
        return view('filmzgroup::film', $this->data);
    }

    public function multiStringToArray($multi_string) {
        $strings = (String) $multi_string;
        str_replace(" ", "", $strings);
        $string_array = explode(",", $strings);

        return $string_array;
    }

    public function films(Request $request){
        $films = Film::orderBy('created_at','desc')->paginate(3);
        $search = $request->search;
        if ($search) {
            $films = $films->where('name', 'like', '%' . $search . '%');
        }
        $display = '';
        if ($request->page == null) {
            $page_id = 2;
        } else {
            $page_id = $request->page + 1;
        }
        if ($films->lastPage() == $page_id - 1) {
            $display = 'display:none';
        }
        $this->data['films'] = $films;
        $this->data['page_id'] = $page_id;
        $this->data['display'] = $display;
        $this->data['search'] = $search;
        $this->data['total_pages'] = ceil($films->total() / $films->perPage());
        $this->data['current_page'] = $films->currentPage();

        return view("filmzgroup::films", $this->data);
    }

    public function filmsCategory (Request $request, $category) {
        $title = "";
        $films = Film::orderBy('created_at','desc');

        if($category == "coming-soon") {
            $films = $films->where('film_status',2);
            $title = "Sắp chiếu";
        } elseif ($category == "showing") {
            $films = $films->where('film_status',1);
            $title = "Đang chiếu";
        }

        $films = $films->paginate(3);
        $search = $request->search;
        if ($search) {
            $films = $films->where('name', 'like', '%' . $search . '%');
        }
        $display = '';
        if ($request->page == null) {
            $page_id = 2;
        } else {
            $page_id = $request->page + 1;
        }
        if ($films->lastPage() == $page_id - 1) {
            $display = 'display:none';
        }


        $this->data['films'] = $films;
        $this->data['title'] = $title;
        $this->data['page_id'] = $page_id;
        $this->data['display'] = $display;
        $this->data['search'] = $search;
        $this->data['total_pages'] = ceil($films->total() / $films->perPage());
        $this->data['current_page'] = $films->currentPage();

        return view('filmzgroup::films_by_category',$this->data);
    }





    public function blog (Request $request, $id)
    {
        $blog = Product::find($id)->first();

        $this->data['blog'] = $blog;
        return view('filmzgroup::blog',$this->data);
    }

}
