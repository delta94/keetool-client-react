<?php

namespace App\Http\Middleware;

use Closure;
use Session;
use Request;

class Language
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $langs = [
          'en' => [
            "homepage" => "/en/",
            "mission-vision" => "/en/mission-and-vision",
            "strategy-partner" => "/",
            "media-partner" => "/en/media-partner",
            "faqs" => "/en/faqs",
            "jobs" => "/en/jobs-vacancies",
            "membership" => "/en/membership",
            "events" => "/en/event",
            "meeting-room" => "/en/meeting-room",
            "founders" => "/en/up-founders",
            "mentors" => "/en/up-s-mentors",
            "blogs" => "/",
            "contact" => "/en/contact-us",
            "tour" => "/en/book-a-tour"
          ],
          'vi' => [
            "homepage" => "/",
            "mission-vision" => "/tam-nhin-su-menh-gia-tri-cot-loi-up-coworking-space",
            "strategy-partner" => "/doi-tac-chien-luoc-cua-up",
            "media-partner" => "/doi-tac-truyen-thong-cua-up",
            "faqs" => "/nhung-cau-hoi-thuong-gap",
            "jobs" => "/thong-tin-tuyen-dung",
            "membership" => "/goi-thanh-vien-up-coworking-space",
            "events" => "/su-kien",
            "meeting-room" => "/phong-hop",
            "founders" => "/up-founders",
            "mentors" => "/up-s-mentors",
            "blogs" => "/tin-tuc-startup",
            "contact" => "/lien-he-voi-up-co-working-space",
            "tour" => "/dang-ky-trai-nghiem"
          ]  
        ];

        // dd($segments['en']['faqs']);

        $url = Request::server('REQUEST_URI');
        $previousLang = Session::get('lang');
        if($request->lang){
            if(Session::get('lang') != $request->lang) Session::put('lang',$request->lang);
            $url = substr($url, 0, strpos($url, "?lang="));
        }    
        dd($url);
        $segment = "";
        if(Session::has('lang')){
            // dd(Session::all());
            $lang = Session::get('lang');
            $segments = $langs[$previousLang];
            // dd($segments); 
            // echo $url;  
            foreach($segments as $key => $value){
                // echo $key . "=>";
                // echo $value . "\n";

                if($value == $url){
                    $segment = $key;
                    break;
                }
            }
            // dd(1);
        }else{
            $lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
        }
        
        
        // dd(gettype($url));
        // dd($lang);
        
        // dd($segment);
        
        // dd($request->segment(1));
        // dd($url);
        $request->attributes->add(['lang' => $lang]);
        dd($segment);
        if($lang == 'vi'){
            return ($url == "/" || substr($url,0,3) != "/en") ? $next($request) : redirect($langs[$lang][$segment]);
        }else{
            return ($url == "/en" || substr($url,0,3) == "/en") ? $next($request) : redirect($langs[$lang][$segment]);
        }
        
    }
}
