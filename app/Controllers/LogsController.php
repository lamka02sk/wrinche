<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Logging module for logging user and system activity.
 * Version: 0.1
 * Authors: lamka02sk
 */

namespace App\Controllers;

class LogsController extends MainController {

    public function start() {

        /*
         * Temporary
         */
        $append = "[" . date("Y-m-d h:i:s") . "]\n";
        $append .= "Execution time: " . round((- $_SERVER['REQUEST_TIME_FLOAT'] + microtime(true)) * 1000, 4)  . " ms\n";
        $append .= "Memory used: " . round(memory_get_peak_usage(false)/1024/1024, 4) . " MiB\n";
        $append .= str_repeat("-", 120) . "\n";
        $append .= file_get_contents(ROOT . "/app/Logs/Performance.txt");

        file_put_contents(ROOT . "/app/Logs/Performance.txt", $append);

    }

}