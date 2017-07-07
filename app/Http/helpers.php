<?php
use Illuminate\Support\Facades\DB;
use Intervention\Image\ImageManagerStatic as Image;
use \Illuminate\Support\Facades\Storage as Storage;
use \RobbieP\CloudConvertLaravel\Facades\CloudConvert as CloudConvert;
use Jenssegers\Agent\Agent as Agent;
use \Aws\ElasticTranscoder\ElasticTranscoderClient as ElasticTranscoderClient;

function format_date_full_option($time)
{
    return rebuild_date("j F, Y, H:i", strtotime($time));
}

function format_date($time)
{
    return rebuild_date('d F, Y', strtotime($time));
}

function format_time($time)
{
    return rebuild_date('g:i a', $time);
}

function format_time_shift($time)
{
    return rebuild_date('H:i', $time);
}

function time_elapsed_string($ptime)
{
    $etime = time() - $ptime;
    if ($etime > 24 * 60 * 60) {
        return date("j/n/Y", $ptime);
    } else {
        if ($etime < 1) {
            return 'Vừa xong';
        }

        $a = array(365 * 24 * 60 * 60 => 'năm',
            30 * 24 * 60 * 60 => 'tháng',
            24 * 60 * 60 => 'ngày',
            60 * 60 => 'giờ',
            60 => 'phút',
            1 => 'giây'
        );

        //đổi sang số nhiều
        $a_plural = array('năm' => 'năm',
            'tháng' => 'tháng',
            'ngày' => 'ngày',
            'giờ' => 'giờ',
            'phút' => 'phút',
            'giây' => 'giây'
        );

        foreach ($a as $secs => $str) {
            $d = $etime / $secs;
            if ($d >= 1) {
                $r = round($d);
                return $r . ' ' . ($r > 1 ? $a_plural[$str] : $str) . ' trước';
            }
        }
    }

}

function timeRange($start, $end){
    $dt = new DateTime($start);
    $dt->add(new DateInterval('PT200M'));
    $interval = $dt->diff(new DateTime($end));
    return $interval->format('%Hh %Im %Ss');
}

function computeTimeInterval($start, $end) {
    $dt = new DateTime($start);
    $dt->add(new DateInterval('PT200M'));
    $interval = $dt->diff(new DateTime($end));
    return $interval;
}



function time_remain_string($ptime)
{
    $etime = $ptime - time();
    if ($etime < 1) {
        return "Hết giờ";
    } else {
        $a = array(365 * 24 * 60 * 60 => 'năm',
            30 * 24 * 60 * 60 => 'tháng',
            24 * 60 * 60 => 'ngày',
            60 * 60 => 'giờ',
            60 => 'phút',
            1 => 'giây'
        );


        foreach ($a as $secs => $str) {
            $d = $etime / $secs;
            if ($d >= 1) {
                $r = floor($d);
                return 'Còn ' . $r . ' ' . $str;
            }
        }
        return $str;
    }

}

function compute_sale_bonus($total)
{
    $A = 0;
    $B = 0;
    $C = 0;
    if ($total > 50) {
        $A = 50;
        if ($total <= 70) {
            $B = $total - 50;
        } else {
            $B = 20;
            $C = $total - 70;
        }
    } else {
        $A = $total;
    }

    $bonus = $A * 50000 + $B * 70000 + $C * 100000;
    return $bonus;
}

function format_date_eng($time)
{
    return date('d F, Y', strtotime($time));
}

function is_mobile()
{
    $agent = new Agent();
    return $agent->isMobile();
}

function format_time_to_mysql($time)
{
    return rebuild_date('Y-m-d H:i:s', $time);
}


//addTimeToDate($register->created_at,"+24 hours");
function addTimeToDate($date_str, $hour)
{
    $date = new DateTime($date_str);
    $date->modify($hour);
    return $date->format("Y-m-d H:i:s");
}

function date_shift($time)
{
    return rebuild_date('l - d/m/Y', $time);
}

function format_date_to_mysql($time)
{
    return rebuild_date('Y-m-d', strtotime($time));
}

function set_class_lesson_time($class) {
    $start_date = new DateTime(date('Y-m-d', strtotime($class->datestart)));
    $start_date->modify('yesterday');

    $schedule = $class->schedule;
    $studySessions = $schedule->studySessions;

    $classLessons = $class->classLessons()
        ->join('lessons','class_lesson.lesson_id','=','lessons.id')
        ->orderBy('lessons.order')->select('class_lesson.*')->get();


    $duration = $class->course->duration;
    $week = ceil($duration / count($studySessions));
    $count = 0;

    for ($i=0; $i < $week; $i++){
        foreach ($studySessions as $studySession) {
            $weekday = weekdayViToEn($studySession->weekday);

            $start_date->modify('next '.$weekday);
            $classLessons[$count]->time = $start_date->format('Y-m-d');

            $classLessons[$count]->save();

            $count++;
            if ($count == $duration) {
                break;
            }
        }
    }
}

function generate_class_lesson($class){
    $course = $class->course;
    $class_lessons = $class->lessons;
    $course_lessons = $course->lessons;

    foreach ($course_lessons as $lesson) {
        if (!($class->lessons->contains($lesson))) {
            DB::table('class_lesson')->insert([
                ['class_id' => $class->id, 'lesson_id' => $lesson->id]
            ]);
            $class_lessons->push($lesson);
        }
    }
    foreach ($class_lessons as $lesson) {
        if (!($course_lessons->contains($lesson))) {
            DB::table('class_lesson')->where('lesson_id', '=', $lesson->id)->where('class_id', $class->id)->delete();
        }
    }
}

function send_mail($user, $view, $subject)
{

    Mail::send($view, ['user' => $user], function ($m) use ($user, $subject) {
        $m->from('no-reply@colorme.vn', 'Color Me');

        $m->to($user['email'], $user['name'])->subject($subject);
    });
}

function send_marketing_mail($email, $view, $subject)
{

    Mail::send($view, ['email' => $email], function ($m) use ($email, $subject) {
        $m->from('no-reply@colorme.vn', 'Color Me');

        $m->to($email, $email)->subject($subject);
    });
}


function currency_vnd_format($number)
{
    return number_format($number) . " vnd";
}

function send_mail_confirm_order($order, $emailcc)
{
    $data['order'] = $order;

    $subject = "Xác nhận đơn đặt hàng mua sách";

    Mail::queue('emails.confirm_order', $data, function ($m) use ($order, $subject, $emailcc) {
        $m->from('no-reply@colorme.vn', 'Color Me');

        $m->to($order['email'], $order['name'])->bcc($emailcc)->subject($subject);
    });
}

function send_mail_confirm_registration($user, $class_id, $emailcc)
{

    $class = \App\StudyClass::find($class_id);

    $course = \App\Course::find($class->course_id);

    $data['class'] = $class;
    $data['course'] = $course;
    $data['user'] = $user;

    $subject = "[ColorME] Xác nhận đăng kí khoá học " . $course->name;

    Mail::queue('emails.confirm_email_2', $data, function ($m) use ($user, $subject, $emailcc) {
        $m->from('no-reply@colorme.vn', 'Color Me');

        $m->to($user['email'], $user['name'])->bcc($emailcc)->subject($subject);
    });
}


function send_mail_confirm_receive_studeny_money($register, $emailcc)
{

    $user = $register->user;
    $class = $register->studyClass;
    $data['class'] = $class;
    $data['course'] = $register->studyClass->course;
    $data['user'] = $user;
    $data['register'] = $register;

    $subject = "[ColorME] Xác nhận thanh toán thành công khoá học " . $data['course']->name;

    Mail::queue('emails.confirm_money_email', $data, function ($m) use ($user, $subject, $emailcc) {
        $m->from('no-reply@colorme.vn', 'Color Me');

        $m->to($user['email'], $user['name'])->bcc($emailcc)->subject($subject);
    });
}

function send_mail_goodbye($register, $emailcc)
{

    $user = $register->user;

    $data['student'] = $user;
    $data['class'] = $register->studyClass;

    $subject = "[ColorME] Lời chào tạm biệt từ ColorME";

    Mail::queue('emails.email_goodbye', $data, function ($m) use ($user, $subject, $emailcc) {
        $m->from('no-reply@colorme.vn', 'Color Me');

        $m->to($user['email'], $user['name'])->bcc($emailcc)->subject($subject);
    });
}

function encodeUtf8($text)
{
    $regex = <<<'END'
/
  (
    (?: [\x00-\x7F]                 # single-byte sequences   0xxxxxxx
    |   [\xC0-\xDF][\x80-\xBF]      # double-byte sequences   110xxxxx 10xxxxxx
    |   [\xE0-\xEF][\x80-\xBF]{2}   # triple-byte sequences   1110xxxx 10xxxxxx * 2
    |   [\xF0-\xF7][\x80-\xBF]{3}   # quadruple-byte sequence 11110xxx 10xxxxxx * 3 
    ){1,100}                        # ...one or more times
  )
| .                                 # anything else
/x
END;
    preg_replace($regex, '$1', $text);
    return $text;
}

function send_mail_delete_register($register, $staff)
{

    $user = $register->user;

    $data['student'] = $user;
    $data['class'] = $register->studyClass;
    $data['staff'] = $staff;

    $subject = "Xoá Register";

    Mail::send('emails.email_delete_register', $data, function ($m) use ($subject) {
        $m->from('no-reply@colorme.vn', 'Color Me');

        $m->to("thanghungkhi@gmail.com", "Nguyễn Việt Hùng")->bcc("aquancva@gmail.com")->subject($subject);
    });
}

function send_mail_activate_class($register, $emailcc)
{

    $user = $register->user;
    $data['class'] = $register->studyClass;
    $data['student'] = $user;
    $data['regis'] = $register;
    $data['course'] = $data['class']->course;
    $subject = "[ColorME] Thông báo khai giảng khoá học " . $data['course']->name;

    Mail::queue('emails.activate_class', $data, function ($m) use ($user, $subject, $emailcc) {
        $m->from('no-reply@colorme.vn', 'Color Me');

        $m->to($user['email'], $user['name'])->bcc($emailcc)->subject($subject);
    });
}

function send_mail_lesson($user, $lesson, $class, $study_date, $emailcc)
{

    $data['lesson'] = $lesson;
    $data['class'] = $class;
    $data['user'] = $user;
    $data['study_date'] = $study_date;

    $subject = "Lịch trình và Giáo trình Buổi " . $lesson->order . " Lớp " . $class->name;
    $data['subject'] = $subject;
    Mail::queue('emails.send_lesson', $data, function ($m) use ($user, $subject, $emailcc) {
        $m->from('no-reply@colorme.vn', 'Color Me');

        $m->to($user['email'], $user['name'])->bcc($emailcc)->subject($subject);
    });
}


function send_mail_regis_shift($user, $week, $gen, $emailcc)
{

    $data['week'] = $week;
    $data['gen'] = $gen;
    $data['user'] = $user;

    $subject = "Đăng ký trực tuần " . $week . " Khoá " . $gen->name;
    $data['subject'] = $subject;
    Mail::queue('emails.mail_regis_shift', $data, function ($m) use ($user, $subject, $emailcc) {
        $m->from('no-reply@colorme.vn', 'Color Me');
        $m->to($user['email'], $user['name'])->bcc($emailcc)->subject($subject);
    });
}


function get_first_part_of_email($string)
{
    $pos = strpos($string, '@');
    return substr($string, 0, $pos);
}

function get_blog_post_id($text)
{
    $id = end(explode("-", $text));
    echo $id;
}

function refine_url($url)
{
    $url = preg_replace('~[^\\pL0-9_]+~u', '-', $url);
    $url = trim($url, "-");
    $url = iconv("utf-8", "us-ascii//TRANSLIT", $url);
    $url = strtolower($url);
    $url = preg_replace('~[^-a-z0-9_]+~', '', $url);
    return $url;
}

function extract_class_name($name)
{
    $newName = convert_vi_to_en($name);
    return str_replace("-", "", $newName);
}

function convert_vi_to_en_not_url($str)
{
    // In thường
    $str = preg_replace("/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/", 'a', $str);
    $str = preg_replace("/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/", 'e', $str);
    $str = preg_replace("/(ì|í|ị|ỉ|ĩ)/", 'i', $str);
    $str = preg_replace("/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/", 'o', $str);
    $str = preg_replace("/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/", 'u', $str);
    $str = preg_replace("/(ỳ|ý|ỵ|ỷ|ỹ)/", 'y', $str);
    $str = preg_replace("/(đ)/", 'd', $str);
    // In đậm
    $str = preg_replace("/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/", 'A', $str);
    $str = preg_replace("/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/", 'E', $str);
    $str = preg_replace("/(Ì|Í|Ị|Ỉ|Ĩ)/", 'I', $str);
    $str = preg_replace("/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/", 'O', $str);
    $str = preg_replace("/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/", 'U', $str);
    $str = preg_replace("/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/", 'Y', $str);
    $str = preg_replace("/(Đ)/", 'D', $str);
//    $str = str_replace(" ", "-", str_replace("&*#39;", "", $str));
    return $str;
}

function convert_vi_to_en($str)
{
    // In thường
    $str = preg_replace("/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/", 'a', $str);
    $str = preg_replace("/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/", 'e', $str);
    $str = preg_replace("/(ì|í|ị|ỉ|ĩ)/", 'i', $str);
    $str = preg_replace("/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/", 'o', $str);
    $str = preg_replace("/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/", 'u', $str);
    $str = preg_replace("/(ỳ|ý|ỵ|ỷ|ỹ)/", 'y', $str);
    $str = preg_replace("/(đ)/", 'd', $str);
    // In đậm
    $str = preg_replace("/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/", 'A', $str);
    $str = preg_replace("/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/", 'E', $str);
    $str = preg_replace("/(Ì|Í|Ị|Ỉ|Ĩ)/", 'I', $str);
    $str = preg_replace("/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/", 'O', $str);
    $str = preg_replace("/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/", 'U', $str);
    $str = preg_replace("/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/", 'Y', $str);
    $str = preg_replace("/(Đ)/", 'D', $str);
    $str = str_replace(" ", "-", str_replace("&*#39;", "", $str));
    return refine_url($str);
}

function rebuild_date($format, $time = 0)
{
    if (!$time) $time = time();
    $lang = array();
    $lang['sun'] = 'CN';
    $lang['mon'] = 'T2';
    $lang['tue'] = 'T3';
    $lang['wed'] = 'T4';
    $lang['thu'] = 'T5';
    $lang['fri'] = 'T6';
    $lang['sat'] = 'T7';
    $lang['sunday'] = 'Chủ nhật';
    $lang['monday'] = 'Thứ hai';
    $lang['tuesday'] = 'Thứ ba';
    $lang['wednesday'] = 'Thứ tư';
    $lang['thursday'] = 'Thứ năm';
    $lang['friday'] = 'Thứ sáu';
    $lang['saturday'] = 'Thứ bảy';
    $lang['january'] = 'Tháng Một';
    $lang['february'] = 'Tháng Hai';
    $lang['march'] = 'Tháng Ba';
    $lang['april'] = 'Tháng Tư';
    $lang['may'] = 'Tháng Năm';
    $lang['june'] = 'Tháng Sáu';
    $lang['july'] = 'Tháng Bảy';
    $lang['august'] = 'Tháng Tám';
    $lang['september'] = 'Tháng Chín';
    $lang['october'] = 'Tháng Mười';
    $lang['november'] = 'Tháng M. một';
    $lang['december'] = 'Tháng M. hai';
    $lang['jan'] = 'T01';
    $lang['feb'] = 'T02';
    $lang['mar'] = 'T03';
    $lang['apr'] = 'T04';
    $lang['may2'] = 'T05';
    $lang['jun'] = 'T06';
    $lang['jul'] = 'T07';
    $lang['aug'] = 'T08';
    $lang['sep'] = 'T09';
    $lang['oct'] = 'T10';
    $lang['nov'] = 'T11';
    $lang['dec'] = 'T12';
    $format = str_replace("r", "D, d M Y H:i:s O", $format);
    $format = str_replace(array("D", "M"), array("[D]", "[M]"), $format);
    $return = date($format, $time);
    $replaces = array(
        '/\[Sun\](\W|$)/' => $lang['sun'] . "$1",
        '/\[Mon\](\W|$)/' => $lang['mon'] . "$1",
        '/\[Tue\](\W|$)/' => $lang['tue'] . "$1",
        '/\[Wed\](\W|$)/' => $lang['wed'] . "$1",
        '/\[Thu\](\W|$)/' => $lang['thu'] . "$1",
        '/\[Fri\](\W|$)/' => $lang['fri'] . "$1",
        '/\[Sat\](\W|$)/' => $lang['sat'] . "$1",
        '/\[Jan\](\W|$)/' => $lang['jan'] . "$1",
        '/\[Feb\](\W|$)/' => $lang['feb'] . "$1",
        '/\[Mar\](\W|$)/' => $lang['mar'] . "$1",
        '/\[Apr\](\W|$)/' => $lang['apr'] . "$1",
        '/\[May\](\W|$)/' => $lang['may2'] . "$1",
        '/\[Jun\](\W|$)/' => $lang['jun'] . "$1",
        '/\[Jul\](\W|$)/' => $lang['jul'] . "$1",
        '/\[Aug\](\W|$)/' => $lang['aug'] . "$1",
        '/\[Sep\](\W|$)/' => $lang['sep'] . "$1",
        '/\[Oct\](\W|$)/' => $lang['oct'] . "$1",
        '/\[Nov\](\W|$)/' => $lang['nov'] . "$1",
        '/\[Dec\](\W|$)/' => $lang['dec'] . "$1",
        '/Sunday(\W|$)/' => $lang['sunday'] . "$1",
        '/Monday(\W|$)/' => $lang['monday'] . "$1",
        '/Tuesday(\W|$)/' => $lang['tuesday'] . "$1",
        '/Wednesday(\W|$)/' => $lang['wednesday'] . "$1",
        '/Thursday(\W|$)/' => $lang['thursday'] . "$1",
        '/Friday(\W|$)/' => $lang['friday'] . "$1",
        '/Saturday(\W|$)/' => $lang['saturday'] . "$1",
        '/January(\W|$)/' => $lang['january'] . "$1",
        '/February(\W|$)/' => $lang['february'] . "$1",
        '/March(\W|$)/' => $lang['march'] . "$1",
        '/April(\W|$)/' => $lang['april'] . "$1",
        '/May(\W|$)/' => $lang['may'] . "$1",
        '/June(\W|$)/' => $lang['june'] . "$1",
        '/July(\W|$)/' => $lang['july'] . "$1",
        '/August(\W|$)/' => $lang['august'] . "$1",
        '/September(\W|$)/' => $lang['september'] . "$1",
        '/October(\W|$)/' => $lang['october'] . "$1",
        '/November(\W|$)/' => $lang['november'] . "$1",
        '/December(\W|$)/' => $lang['december'] . "$1");
    return preg_replace(array_keys($replaces), array_values($replaces), $return);
}

function random($length = 10, $char = FALSE)
{
    if ($char == FALSE) $s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwyz0123456789!@#$%^&*()';
    else $s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwyz0123456789';
    mt_srand((double)microtime() * 1000000);
    $salt = '';
    for ($i = 0; $i < $length; $i++) {
        $salt = $salt . substr($s, (mt_rand() % (strlen($s))), 1);
    }
    return $salt;
}

function RGBToHex($r, $g, $b)
{
    //String padding bug found and the solution put forth by Pete Williams (http://snipplr.com/users/PeteW)
    $hex = "#";
    $hex .= str_pad(dechex($r), 2, "0", STR_PAD_LEFT);
    $hex .= str_pad(dechex($g), 2, "0", STR_PAD_LEFT);
    $hex .= str_pad(dechex($b), 2, "0", STR_PAD_LEFT);

    return $hex;
}

//
//function extract_dominant_color($image_url)
//{
//    $ext = pathinfo($image_url, PATHINFO_EXTENSION);
//
//    if ($ext == 'jpg' || $ext == 'jpeg' || $ext == 'png') {
//        $image = Image::make($image_url);
//        return [
//            'width' => $image->width(),
//            'height' => $image->height(),
//            'color' => $image->pickColor(0, 0, 'hex')
//        ];
//    } else {
//        return [
//            'width' => 0,
//            'height' => 0,
//            'color' => 'white'
//        ];
//    }
//}

function deleteFileFromS3($file_name)
{
    $s3 = \Illuminate\Support\Facades\Storage::disk('s3');
    $s3->delete($file_name);
}

function uploadFileToS3(\Illuminate\Http\Request $request, $fileField, $size, $oldfile = null)
{
    $image = $request->file($fileField);

    if ($image != null) {
        $mimeType = $image->getMimeType();
        $s3 = \Illuminate\Support\Facades\Storage::disk('s3');


        if ($mimeType != 'image/gif') {
            $imageFileName = time() . random(15, true) . '.jpg';
            $img = Image::make($image->getRealPath())->encode('jpg', 90)->interlace();
            if ($img->width() > $size) {
                $img->resize($size, null, function ($constraint) {
                    $constraint->aspectRatio();
                });
            }
            $img->save($image->getRealPath());
        } else {
            $imageFileName = time() . random(15, true) . '.' . $image->getClientOriginalExtension();
        }
        $filePath = '/images/' . $imageFileName;
        $s3->getDriver()->put($filePath, fopen($image, 'r+'), ['ContentType' => $mimeType, 'visibility' => 'public']);
        if ($oldfile != null) {
            $s3->delete($oldfile);
        }
        return $filePath;
    }
    return null;

}

function uploadThunbImageToS3(\Illuminate\Http\Request $request, $fileField, $size, $oldfile = null)
{
    $image = $request->file($fileField);

    if ($image != null) {
        $mimeType = $image->getMimeType();
        $s3 = \Illuminate\Support\Facades\Storage::disk('s3');


//        if ($mimeType != 'image/gif') {
        $imageFileName = time() . random(15, true) . '.jpg';
        $img = Image::make($image->getRealPath())->encode('jpg', 90)->interlace();
        if ($img->width() > $size) {
            $img->widen($size);
        }
        $img->save($image->getRealPath());
//        } else {
//            $imageFileName = time() . random(15, true) . '.' . $image->getClientOriginalExtension();
//        }
        $filePath = '/images/' . $imageFileName;
        $s3->getDriver()->put($filePath, fopen($image, 'r+'), ['ContentType' => $mimeType, 'visibility' => 'public']);
        if ($oldfile != null) {
            $s3->delete($oldfile);
        }
        return $filePath;
    }
    return null;

}

function deleteFromS3($path)
{
    $s3 = Storage::disk('s3');
    if ($path != null) {
        $s3->delete($path);
    }

}

function uploadLargeFileToS3(\Illuminate\Http\Request $request, $fileField, $oldfile = null)
{
    $sourceFile = $request->file($fileField);
    if ($sourceFile != null) {
        $imageFileName = time() . random(15, true) . '.' . $sourceFile->getClientOriginalExtension();


        $mimeType = $sourceFile->getMimeType();
        $s3 = \Illuminate\Support\Facades\Storage::disk('s3');
        $filePath = '/videos/' . $imageFileName;

        $s3->getDriver()->put($filePath, fopen($sourceFile, 'r+'), ['ContentType' => $mimeType, 'visibility' => 'public']);
        if ($oldfile != null) {
            $s3->delete($oldfile);
        }
        return $filePath;
    }
    return null;

}

function uploadAndTranscodeVideoToS3(\Illuminate\Http\Request $request, $fileField, $oldfile = null)
{
    $sourceFile = $request->file($fileField);
    if ($sourceFile != null) {
        $imageFileName = time() . random(15, true) . '.' . $sourceFile->getClientOriginalExtension();


        $mimeType = $sourceFile->getMimeType();
        $s3 = \Illuminate\Support\Facades\Storage::disk('s3');
        $filePath = '/tmp/' . $imageFileName;

        $s3->getDriver()->put($filePath, fopen($sourceFile, 'r+'), ['ContentType' => $mimeType, 'visibility' => 'public']);
        if ($oldfile != null) {
            $s3->delete($oldfile);
        }
        return $filePath;
    }
    return null;

}

function create_elastic_transcoder_job($transcoder_client, $pipeline_id, $input_key, $preset_id, $output_key_prefix)
{
    # Setup the job input using the provided input key.
    $input = array('Key' => $input_key);

    # Setup the job output using the provided input key to generate an output key.
    $file_name = time() . hash("sha256", utf8_encode($input_key));
    $outputs = array(
        array(
            'Key' => $file_name . '.mp4',
            'PresetId' => $preset_id,
            "ThumbnailPattern" => $file_name . "-{count}"
        )
    );

    # Create the job.
    $create_job_request = array(
        'PipelineId' => $pipeline_id,
        'Input' => $input,
        'Outputs' => $outputs,
        'OutputKeyPrefix' => $output_key_prefix
    );
    $create_job_result = $transcoder_client->createJob($create_job_request)->toArray();
    return $job = $create_job_result["Job"];
}

function uploadLargeFileToS3Useffmpec(\Illuminate\Http\Request $request, $fileField, $oldfile = null)
{
    $sourceFile = $request->file($fileField);
    if ($sourceFile != null) {
        $random = random(15, true);
        $imageFileName = time() . $random . '.' . $sourceFile->getClientOriginalExtension();
        $videoFileName = time() . $random . '.mp4';

        $filePath = 'videos/' . $imageFileName;
        $videoPath = 'videos/' . $videoFileName;
        $s3 = \Illuminate\Support\Facades\Storage::disk('s3');


        if ($sourceFile->getClientOriginalExtension() == 'mov') {
            Storage::put($filePath, fopen($sourceFile, 'r+'));

            $storagePath = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();
            //            dd('ffmpeg -i ' . $storagePath . $imageFileName . ' -vcodec copy -acodec copy ' . $storagePath . $videoFileName);
            exec('ffmpeg -i ' . $storagePath . $filePath . ' -vcodec libx264 -vpre medium ' . $storagePath . $videoPath);
            //            exec('ffmpeg -y -i ' . $storagePath . $filePath . ' -an -s hd720 -vcodec libx264 -b:v BITRATE  -vcodec libx264 -pix_fmt yuv420p -preset slow -profile:v baseline -movflags faststart -y ' . $storagePath . $videoPath);

            $s3->getDriver()->put($videoPath, fopen($storagePath . $videoPath, 'r+'), ['ContentType' => 'video/mp4', 'visibility' => 'public']);
            Storage::delete($videoPath);
            Storage::delete($filePath);
        } else {
            $s3->getDriver()->put($filePath, fopen($sourceFile, 'r+'), ['ContentType' => 'video/mp4', 'visibility' => 'public']);
        }


        if ($oldfile != null) {
            $s3->delete($oldfile);
        }
        //        CloudConvert::file(CloudConvert::S3($filePath))
        //            ->to(CloudConvert::FTP('img/temp.mp4'));
        return '/' . $videoPath;
    }
    return null;

}

function uploadLargeFileToS3UseCloudConvert(\Illuminate\Http\Request $request, $fileField, $oldfile = null)
{
    $sourceFile = $request->file($fileField);
    if ($sourceFile != null) {
        $random = time() . random(15, true);

        $imageFileName = $random . '.' . $sourceFile->getClientOriginalExtension();
        $videoFileName = $random . '.mp4';

        $filePath = 'videos/' . $imageFileName;
        $videoPath = 'videos/' . $videoFileName;


        $storagePath = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();
        $s3 = Storage::disk('s3');

        if ($sourceFile->getClientOriginalExtension() == 'mov') {
            Storage::put($filePath, fopen($sourceFile, 'r+'));

            CloudConvert::file($storagePath . $filePath)->to(CloudConvert::S3($videoPath));
            //            $s3->getDriver()->put($videoPath, fopen($storagePath . $videoPath, 'r+'), ['ContentType' => 'video/mp4', 'visibility' => 'public']);
            //            Storage::delete($videoPath);
            Storage::delete($filePath);
        } else {
            $s3->getDriver()->put($filePath, fopen($sourceFile, 'r+'), ['ContentType' => 'video/mp4', 'visibility' => 'public']);
        }

        //


        //        dd($storagePath . $filePath);


        if ($oldfile != null) {
            $s3->delete($oldfile);
        }
        //        CloudConvert::file(CloudConvert::S3($filePath))
        //            ->to(CloudConvert::FTP('img/temp.mp4'));
        return '/' . $videoPath;
    }
    return null;

}

function call_status_text($num)
{
    if ($num == 1) {
        return "success";
    }
    if ($num == 2) {
        return "calling";
    }
    if ($num == 0) {
        return "failed";
    }
    if ($num == 4) {
        return "uncall";
    }
    return 'unknown status';
}

function call_status($num)
{
    if ($num == 1) {
        return "<strong class='green-text'>Thành công</strong>";
    }
    if ($num == 2) {
        return "<strong class='blue-text'>Đang gọi</strong>";
    }
    if ($num == 0) {
        return "<strong class='red-text'>Thất bại</strong>";
    }
    return 'unknown status';
}

function notification_type($type)
{
    switch ($type) {
        case 0:
            return 'like';
        case 1:
            return 'new_comment';
        case 2:
            return 'also_comment';
        case 3:
            return "money_transferring";
        case 4:
            return "money_transferred";
        case 5:
            return "new_topic";
        case 6:
            return "feature";
    }
}

function transaction_status($status)
{
    if ($status == 0) return 'Đang chờ';
    if ($status == 1) return 'Thành công';
    if ($status == -1) return 'Thất bại';
    return 'unknown status';
}

function transaction_status_raw($status)
{
    if ($status == 0) return 'pending';
    if ($status == 1) return 'success';
    if ($status == -1) return 'failed';
    return 'unknown status';
}

function diffDate($start, $end)
{
    $workingHours = (strtotime($end) - strtotime($start)) / 3600;
    return $workingHours;
}

function createDateRangeArray($iDateFrom, $iDateTo)
{
    // takes two dates formatted as YYYY-MM-DD and creates an
    // inclusive array of the dates between the from and to dates.

    // could test validity of dates here but I'm already doing
    // that in the main script

    $aryRange = array();


    if ($iDateTo >= $iDateFrom) {
        array_push($aryRange, date('Y-m-d', $iDateFrom)); // first entry
        while ($iDateFrom < $iDateTo) {
            $iDateFrom += 86400; // add 24 hours
            array_push($aryRange, date('Y-m-d', $iDateFrom));
        }
    }
    return $aryRange;
}

//0: text
//1:radio
//2:checkbox
function question_type($type)
{
    if ($type == 0) {
        return "Text";
    } else if ($type == 1) {
        return "Radio button";
    } else if ($type == 2) {
        return "Check box";
    }
}
function question_type_key($type)
{
    if ($type == 0) {
        return "text";
    } else if ($type == 1) {
        return "radio";
    } else if ($type == 2) {
        return "checkbox";
    }
}

function question_view($type)
{
    if ($type == 0) {
        return "survey.text";
    } else if ($type == 1) {
        return "survey.radio";
    } else if ($type == 2) {
        return "survey.checkbox";
    } else if ($type == 3) {
        return "survey.rating";
    }
}

function rating_color($rating)
{
    if ($rating <= 1 && $rating > 0) {
        return '#b71c1c';
    } elseif ($rating > 1 && $rating <= 2) {
        return '#ff6f00';
    } elseif ($rating > 2 && $rating <= 3) {
        return '#f9a825';
    } elseif ($rating > 3 && $rating <= 4) {
        return '#1565c0';
    } elseif ($rating > 4 && $rating <= 5) {
        return '#558b2f';
    } else {
        return '#ABABAB';
    }
}

function how_know($val)
{
    if ($val == 1) {
        return 'Facebook';
    } elseif ($val == 6) {
        return 'Instagram';
    } elseif ($val == 2) {
        return 'Người quen';
    } elseif ($val == 3) {
        return 'Google';
    } else {
        return 'Lý do khác';
    }
}

function gender($val)
{
    if ($val == 1) {
        return 'Nam';
    } elseif ($val == 2) {
        return 'Nữ';
    } else {
        return 'Khác';
    }
}

function email_status_int_to_str($status)
{
    if ($status == 1) {
        return 'Delivery';
    } elseif ($status == 2) {
        return 'Bounce';
    } elseif ($status == 3) {
        return 'Opened';
    } elseif ($status == 4) {

        return 'Complaint';
    } else {
        return 'other';
    }
}


function email_status_str_to_int($status)
{
    if ($status == 'Delivery') {
        return 1;
    } elseif ($status == 'Bounce') {
        return 2;
    } elseif ($status == 'Opened') {
        return 3;
    } elseif ($status == 'Complaint') {
        return 4;
    } else {
        return 'other';
    }
}

function extract_email_from_str($string)
{
    $pattern = '/([a-z0-9])(([-a-z0-9._])*([a-z0-9]))*\@([a-z0-9])' .
        '(([a-z0-9-])*([a-z0-9]))+' . '(\.([a-z0-9])([-a-z0-9_-])?([a-z0-9])+)/i';

    preg_match($pattern, $string, $matches);
    if (count($matches) > 0) {
        return $matches[0];
    } else {
        return null;
    }

}

function transaction_type($type)
{
    switch ($type) {
        case 0:
            return '<span class="blue-text">chuyển tiền</span>';
        case 1:
            return '<span class="green-text">thu</span>';
        case 2:
            return '<span class="red-text">chi</span>';
        default:
            return 'khác';
    }
}

function transaction_type_raw($type)
{
    switch ($type) {
        case 0:
            return "chuyentien";
        case 1:
            return 'thu';
        case 2:
            return 'chi';
        default:
            return 'khac';
    }
}

function seo_keywords()
{
    return "Khoá học thiết kế cơ bản, Học thiết kế đồ hoạ hà nội, học thiết kế đồ hoạ, học thiết kế đồ họa tp hcm colorme.";
}


//Facebook Force Re-scrape
function re_scrape($url)
{
    $graph = 'https://graph.facebook.com/';
    $post = 'id=' . urlencode($url) . '&scrape=true';
    return send_post($graph, $post);
}

function orderToWeekday($order)
{
    switch ($order) {
        case 1:
            return "Thứ hai";
        case 2:
            return "Thứ ba";
        case 3:
            return "Thứ tư";
        case 4:
            return "Thứ năm";
        case 5:
            return "Thứ sáu";
        case 6:
            return "Thứ bảy";
        case 7:
            return "Chủ nhật";
        default:
            return "unknown";
    }
}


function weekdayViToNumber($weekday)
{
    switch ($weekday) {
        case "Thứ hai":
            return 1;
        case "Thứ ba":
            return 2;
        case "Thứ tư":
            return 3;
        case "Thứ năm":
            return 4;
        case "Thứ sáu":
            return 5;
        case "Thứ bảy":
            return 6;
        case "Chủ nhật":
            return 7;
        default:
            return 1;
    }
}

function weekdayViToEn($weekday)
{
    switch ($weekday) {
        case "Thứ hai":
            return 'monday';
        case "Thứ ba":
            return 'tuesday';
        case "Thứ tư":
            return 'wednesday';
        case "Thứ năm":
            return 'thursday';
        case "Thứ sáu":
            return 'friday';
        case "Thứ bảy":
            return 'saturday';
        case "Chủ nhật":
            return 'sunday';
        default:
            return 'sunday';
    }
}

function send_post($url, $post)
{
    $r = curl_init();
    curl_setopt($r, CURLOPT_URL, $url);
    curl_setopt($r, CURLOPT_POST, 1);
    curl_setopt($r, CURLOPT_POSTFIELDS, $post);
    curl_setopt($r, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($r, CURLOPT_CONNECTTIMEOUT, 5);
    $data = curl_exec($r);
    curl_close($r);
    return $data;
}

function send_push_notification($data)
{

    $r = curl_init();
    curl_setopt($r, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Authorization: key=' . config('app.fcm_key')
    ));

    curl_setopt($r, CURLOPT_URL, "https://gcm-http.googleapis.com/gcm/send");
    curl_setopt($r, CURLOPT_POST, 1);
    curl_setopt($r, CURLOPT_POSTFIELDS, '{
          "to": "/topics/colorme",
          "data": {
            "message": ' . $data . '
           }
        }');
    curl_setopt($r, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($r, CURLOPT_CONNECTTIMEOUT, 5);
    $data = curl_exec($r);
    curl_close($r);
    return $data;
}

function random_color_part()
{
    return str_pad(dechex(mt_rand(0, 255)), 2, '0', STR_PAD_LEFT);
}

function random_color()
{
    return random_color_part() . random_color_part() . random_color_part();
}

function first_part_of_code($class_name, $waitingCode, $nextCode)
{
    if (strpos($class_name, '.') !== false) {
        return "CM" . $nextCode;
    } else {
        return "CCM" . $waitingCode;
    }
}


function send_sms_confirm_money($register)
{
    $client = new \GuzzleHttp\Client(['base_uri' => "http://api-02.worldsms.vn"]);
//    $promise = $client->post("/webapi/sendSMS");
    $headers = [
        "Content-Type" => "application/json",
        "Accept" => "application/json",
        "Authorization" => "Basic " . config('app.sms_key')
    ];
//    dd($headers);
    $text = strtoupper($register->studyClass->course->name) . "\nChao " . ucwords(convert_vi_to_en_not_url($register->user->name)) . ", ban da thanh toan thanh cong " . currency_vnd_format($register->money) . ". Ma hoc vien cua ban la: " . $register->code . ". Cam on ban.";
    $body = json_encode([
        "from" => "COLORME",
        "to" => $register->user->phone,
        "text" => $text
    ]);


    $request = new GuzzleHttp\Psr7\Request('POST', 'http://api-02.worldsms.vn/webapi/sendSMS', $headers, $body);
    $response = $client->send($request);
    $status = json_decode($response->getBody())->status;


    $sms = new \App\Sms();
    $sms->content = $text;
    $sms->user_id = $register->user_id;
    $sms->purpose = "Money Confirm";
    if ($status == 1) {
        $sms->status = "success";
    } else {
        $sms->status = "failed";
    }
    $sms->save();

    $register->sms_confirm_sended = 1;
    $register->sms_confirm_id = $sms->id;
    $register->save();

    return $status;

}

function send_sms_remind($register)
{
    $client = new \GuzzleHttp\Client(['base_uri' => "http://api-02.worldsms.vn"]);
//    $promise = $client->post("/webapi/sendSMS");
    $headers = [
        "Content-Type" => "application/json",
        "Accept" => "application/json",
        "Authorization" => "Basic " . config('app.sms_key')
    ];
    $splitted_time = explode(" ", $register->studyClass->study_time)[0];
//    dd($splitted_time);
//    dd($headers);

    $datestart = date('d/m', strtotime($register->studyClass->datestart));
//    dd($datestart);

    $text = strtoupper($register->studyClass->course->name) . "\nChao " . ucwords(convert_vi_to_en_not_url($register->user->name)) . ". Khoa hoc cua ban se bat dau vao ngay mai " . $datestart . " vao luc " . $splitted_time . ". Ban nho den som 15p de cai dat phan mem nhe.";
    $body = json_encode([
        "from" => "COLORME",
        "to" => $register->user->phone,
        "text" => $text
    ]);

    $request = new GuzzleHttp\Psr7\Request('POST', 'http://api-02.worldsms.vn/webapi/sendSMS', $headers, $body);
    $response = $client->send($request);
    $status = json_decode($response->getBody())->status;

    $sms = new \App\Sms();
    $sms->content = $text;
    $sms->user_id = $register->user_id;
    $sms->purpose = "Remind Start Date";
    if ($status == 1) {
        $sms->status = "success";
    } else {
        $sms->status = "failed";
    }
    $sms->save();

    $register->sms_remind_sended = 1;
    $register->sms_remind_id = $sms->id;
    $register->save();

    return $status;

}

function send_sms_general($register, $content)
{
    $client = new \GuzzleHttp\Client(['base_uri' => "http://api-02.worldsms.vn"]);
//    $promise = $client->post("/webapi/sendSMS");
    $headers = [
        "Content-Type" => "application/json",
        "Accept" => "application/json",
        "Authorization" => "Basic " . config('app.sms_key')
    ];


    $body = json_encode([
        "from" => "COLORME",
        "to" => $register->user->phone,
        "text" => $content
    ]);

    $request = new GuzzleHttp\Psr7\Request('POST', 'http://api-02.worldsms.vn/webapi/sendSMS', $headers, $body);
    $response = $client->send($request);
    $status = json_decode($response->getBody())->status;

    $sms = new \App\Sms();
    $sms->content = $content;
    $sms->user_id = $register->user_id;
    $sms->purpose = "Notification";
    if ($status == 1) {
        $sms->status = "success";
    } else {
        $sms->status = "failed";
    }
    $sms->save();

    $register->sms_remind_sended = 1;
    $register->sms_remind_id = $sms->id;
    $register->save();

    return $status;

}