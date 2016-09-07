<?php

/* wrinche. Modern, powerful and user friendly CMS. */

namespace App\Helpers;

class Config {

    private static $files = [
        'system'
    ];

    public function __construct($file = 'ALL') {

        switch($file) {
            case 'ALL':
                $this->loadConfigs();
                break;
            default:
                $this->loadConfig($file);
                break;
        }

    }

    private function loadConfigs() {

        foreach(self::$files as $file) {
            $this->loadConfig($file);
        }

    }

    private function loadConfig($file) {

        $json = file_get_contents('app/Config/' . $file . '.json');
        $array = json_decode($json, true);
        $_SESSION['CONFIG'][$file] = $array;

    }

}