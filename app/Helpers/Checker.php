<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Checks if user input selection exists.
 * Version: 0.2.2
 * Authors: lamka02sk
 */

namespace App\Helpers;

use App\Database\Connection;
use App\Models\ComponentsModel;
use App\Models\TemplateModel;

class Checker {

    /**
     * @param $input
     * @return bool
     */
    public function systemTheme($input) {

        $themes = Config::$file['system']['support']['themes'];
        if(!array_key_exists($input, $themes))
            return false;

        return true;

    }

    /**
     * @param $input
     * @return bool
     */
    public function systemLanguage($input) {

        $languages = Config::$file['system']['support']['languages'];
        if(!array_key_exists($input, $languages))
            return false;

        return true;

    }

    /**
     * @param $input
     * @return bool
     */
    public function systemTimezone($input) {

        require_once ROOT . "/app/Config/timezones.php";
        if(!array_key_exists($input, $timezones))
            return false;

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

        if($connection !== null)
            return true;

        return false;

    }

    /**+
     * @param $input
     * @return bool
     */
    public function systemWebsiteCategory($input) {

        $categories = Config::$file['system']['support']['categories'];
        if(!array_key_exists($input, $categories))
            return false;

        return true;

    }

    /**+
     * @param $layout string
     * @return bool
     */
    public function templateLayout(string $layout) {

        // Load template data if not loaded
        $model = new TemplateModel;
        $model->start();

        // Get template components
        $layouts = TemplateModel::$template['layouts'];
        foreach($layouts as $templateLayout) {
            if(strtolower($layout) === strtolower($templateLayout['name']))
                return true;
        }

        return false;

    }

    /**
     * @param int $copyright
     * @return bool
     */
    public function systemCopyright($copyright) {

        $copyrights = count(Config::$file['system']['support']['copyright']);
        return ((int)$copyright >= 0 && (int)$copyright < $copyrights);

    }

}