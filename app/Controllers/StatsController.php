<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Statistics module for tracking user and system.
 * Version: 0.1
 * Authors: lamka02sk
 */

namespace App\Controllers;

class StatsController extends MainController {



    /**
     * StatsController constructor.
     * ??
     */
    public function __construct() {


    }

    /**
     * TEMP: Show Execution time and Memory used by current script.
     */
    public function start() {

        // TEMP
        /*echo '<br>';
        echo "Execution time: " . round((- self::$rawData['REQUEST_TIME_FLOAT'] + microtime(true)) * 1000, 4) . ' ms';

        echo '<br>';
        echo 'Memory in use: ' . round(((memory_get_usage() / 1024) / 1024), 4) .'MB';
*/
    }

}