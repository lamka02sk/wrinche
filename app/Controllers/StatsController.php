<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Statistics module for tracking user and system.
 * Version: 0.1
 * Authors: lamka02sk
 */

namespace App\Controllers;

use App\Helpers\Config;
use App\Logs\LogPerformance;
use App\Requests\Request;

class StatsController extends MainController {



    /**
     * StatsController constructor.
     */
    public function __construct() {


    }

    /**
     * TEMP: Show Execution time and Memory used by current script.
     */
    public function start() {

        new LogPerformance('------------------------------------------------------------------------------------------------------------
Route: ' . implode('/', Request::$url) . '
Execution time: ' . round((microtime(true) - Request::$server['client']['time']) * 1000, 4) . ' ms
Memory (allocated / used): ' . round(((memory_get_usage(true) / 1024) / 1024), 4) . ' / ' . round(((memory_get_usage() / 1024) / 1024), 4) . ' MB
');

    }

}