<?php

namespace App\Logs;

class LogManager {

    const LOGS = [
        'errors', 'events', 'performance'
    ];

    public function retrieve(string $file) {

        if(!in_array($file, self::LOGS))
            return false;

        try {
            return file_get_contents(ROOT . '/app/Logs/' . ucfirst($file) . '.txt');
        } catch(\Exception $exception) {
            return false;
        }

    }

}