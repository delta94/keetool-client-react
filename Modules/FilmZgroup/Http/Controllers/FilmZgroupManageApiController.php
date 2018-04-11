<?php

namespace Modules\FilmZgroup\Http\Controllers;

use App\Film;
use App\FilmSession;
use App\Http\Controllers\ManageApiController;
use App\SessionSeat;
use DateInterval;

use DateTime;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

class FilmZgroupManageApiController extends ManageApiController
{
    /**
     * Display a listing of the resource.
     * @return Response
     */

    public function getAllFilms()
    {
        $films = Film::orderBy("release_date", "desc")->get();
        $this->data["films"] = $films;

        return ["status" => 1, $this->data];
    }

    public function addFilm(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',

        ]);
//        if ($validator->fails()) {
//            return redirect('/')
//                ->withInput()
//                ->withErrors($validator);
//        }

        $film = new Film();
        $film->name = $request->name;
        $film->avatar_url = $request->avatar_url;
        $film->trailer_url = $request->trailer_url;
        $film->director = $request->director;
        $film->cast = $request->cast;
        $film->running_time = $request->running_time;
        $film->release_date = $request->release_date;
        $film->country = $request->country;
        $film->language = $request->language;
        $film->film_genre = $request->film_genre;
        $film->summary = $request->summary;
        $film->save();

        return ["status" => 1];
    }


    public function updateFilm(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',

        ]);
//        if ($validator->fails()) {
//            return redirect('/')
//                ->withInput()
//                ->withErrors($validator);
//        }

        $film = Film::find($id);
        $film->name = $request->name;
        $film->avatar_url = $request->avatar_url;
        $film->trailer_url = $request->trailer_url;
        $film->director = $request->director;
        $film->cast = $request->cast;
        $film->running_time = $request->running_time;
        $film->release_date = $request->release_date;
        $film->country = $request->country;
        $film->language = $request->language;
        $film->film_genre = $request->film_genre;
        $film->summary = $request->summary;
        $film->save();

        return ["status" => 1];
    }

    public function searchFilmByName(Request $request)
    {
        $results = Film::where('name', 'LIKE', '%' . $request->film_name . '%')->get();
        $data = [
            'results' => $results,
        ];
        return ["status" => 1, $data];
    }

    public function getFilmById($id)
    {
        $film = Film::find($id);
        $data = [
            'film' => $film,
        ];
        return ["status" => 1, $data];
    }

    public function deleteFilm(Request $request, $id)
    {
        $film = Film::find($id);
        $film->delete();

        return ["status" => 1];
    }


    public function getFilmsCommingSoon()
    {
        $sessions = FilmSession::where('start_date', '=', null)->get();
        $data = [
            "sessions" => $sessions,
        ];

        return ["status"=>1, $data];
    }

    public function getFilmsNowShowing()
    {
        $sessions = FilmSession::where('start_date', '>=', date('Y-m-d').' 00:00:00')->get();
        $data = [
            "sessions" => $sessions,
        ];

        return ["status"=>1, $data];
    }


    public function getFilmByRoom(Request $request)
    {
        $room_id = $request->room_id;
        $sessions = FilmSession::where('room_id',$room_id)->where('start_date', '>=', date('Y-m-d').' 00:00:00')->get();
        $data = [
            "sessions" => $sessions,
        ];

        return ["status"=>1, $data];
    }

    public function getFilmByDate(Request $request)
    {
        $start_date = $request->start_date;
        $sessions = FilmSession::where('start_date',$start_date)->get();
        $data = [
            "sessions" => $sessions,
        ];

        return ["status"=>1, $data];
    }

    public function changeSeatStatus(Request $request, $session_id)
    {
        $seat = SessionSeat::where([['session_id','=',$session_id],['seat_id','=',$request->seat_id]])->first();
        $seat->seat_status = $request->seat_status;
        $seat->save();

        return ["status"=>1];
    }

}
