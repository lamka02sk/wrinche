<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Checks if user input selection exists.
 * Version: 0.2
 * Authors: lamka02sk
 */

namespace App\Helpers;

use App\Database\Connection;

class Checker {

    /**
     * @param $input
     * @return bool
     */
    public function systemTheme($input) {

        $themes = $_SESSION['CONFIG']['system']['support']['themes'];
        if(!array_key_exists($input, $themes)) {
            return false;
        }

        return true;

    }

    /**
     * @param $input
     * @return bool
     */
    public function systemLanguage($input) {

        $languages = $_SESSION['CONFIG']['system']['support']['languages'];
        if(!array_key_exists($input, $languages)) {
            return false;
        }

        return true;

    }

    /**
     * @param $input
     * @return bool
     */
    public function systemTimezone($input) {

        require_once ROOT . "/app/Config/timezones.php";

        if(!array_key_exists($input, $timezones)) {
            return false;
        }

        return true;

    }

    /**
     * @param $host
     * @param $dbname
     * @param $dbuser
     * @param $dbpass
     * @return bool
     */
    public function customConnection($host, $dbname, $dbuser, $dbpass) {

        $connection = new Connection;
        $connection = $connection->checkConnection($host, $dbname, $dbuser, $dbpass);

        if($connection !== null) {
            return true;
        }

        return false;

    }

    public function systemWebsiteCategory($input) {

        $categories = $_SESSION['CONFIG']['system']['support']['categories'];
        if(!array_key_exists($input, $categories)) {
            return false;
        }

        return true;

    }

}