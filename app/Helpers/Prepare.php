<?php

/* wrinche. Modern, powerful and user friendly CMS. */

namespace App\Helpers;

class Prepare {

    public static function env() {

        $env = $_SESSION['CONFIG']['system']['env'];

        if(!$env['production']) {
            error_reporting(E_ALL);
            ini_set('display_errors', true);
        } else {
            error_reporting(0);
            ini_set('display_errors', false);
        }

    }

    public static function req() {

        global $LANG;

        $env = $_SESSION['CONFIG']['system']['requirements'];

        if(version_compare(PHP_VERSION, $env['php-version'], '<')) {
            echo $LANG['PHP_VERSION'];
            exit;
        }

    }

    public static function lang() {

        global $LANG;

        $env = $_SESSION['CONFIG']['system']['locale']['language'];

        if(empty($env)) {
            $locale = 'en';
        } else {
            $locale = strtolower($env);
        }

        $json = file_get_contents('app/Data/Locale/' . $locale . '/messages.json');
        $array = json_decode($json, true);
        $LANG = $array;

        $env = $_SESSION['CONFIG']['system']['locale']['timezone'];

        date_default_timezone_set($env);

    }

    public static function install() {

        $env = $_SESSION['CONFIG']['system']['installed'];

        if($env) {
            return true;
        }

        return false;

    }

}