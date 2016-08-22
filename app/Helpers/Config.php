<?php

/* wrinche. Modern, powerful and user friendly CMS. */

namespace App\Helpers;

class Config {

    private static $files = [
        'system'
    ];

    public static function load($file = 'ALL') {

        switch($file) {
            case 'ALL':
                return self::loadAll();
                break;
            default:
                return self::loadFile($file);
                break;
        }

    }

    private static function loadAll() {

        foreach(self::$files as $file) {
            self::loadFile($file);
        }

    }

    private static function loadFile($file) {

        $json = file_get_contents('app/Config/' . $file . '.json');
        $array = json_decode($json, true);
        $_SESSION['CONFIG'][$file] = $array;

    }

}