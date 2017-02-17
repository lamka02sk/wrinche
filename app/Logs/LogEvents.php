<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Logs Events to Events.txt Log File
 * Version: 0.1.0
 * Authors: lamka02sk
 */

namespace App\Logs;

use App\Helpers\Config;

class LogEvents {

    /**
     * @var string
     * Current information to log into file
     */
    public $content;

    /**
     * LogEvents constructor.
     * @param string $content
     * @param int    $log
     */
    public function __construct(string $content, int $log = 0) {

        if((!Config::$file['system']['tracking']['events'] && $log === 0) || $log === -1) {
            return false;
        }

        $this->content = $content;
        return $this->execute();

    }

    /**
     * @return bool
     * Append event response to log file
     */
    public function execute() {

        file_put_contents(ROOT . '/app/Logs/Events.txt', $this->content, FILE_APPEND);
        return true;

    }

}