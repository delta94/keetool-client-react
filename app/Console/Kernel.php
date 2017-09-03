<?php

namespace App\Console;

use Illuminate\Console\Command;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        Commands\HappyBirthday::class,
        Commands\Activate::class,
        Commands\StartLesson::class,
        Commands\SendSurvey::class,
        Commands\CreateShifts::class,
        Commands\SendRemindSms::class
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
//        $schedule->command('sms:birthday')->everyMinute();
        $schedule->command('activate:class')->dailyAt('12:00');
        $schedule->command('sms:send')->dailyAt('20:00');
//        $schedule->command('mail:startlesson')->dailyAt('12:00');
        $schedule->command('survey:send')->dailyAt('01:00');
        $schedule->command('shift:create')->weekly()->fridays()->at('23:00');

    }
}
