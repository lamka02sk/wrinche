<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Prepare system for use. Load all needed libraries and data.
 * Version: 0.9.2
 * Authors: lamka02sk
 */

namespace App\Helpers;

use App\Requests\Request;

class Prepare {

    /**
     * @var string
     * Current client language code
     */
    public $LANG;

    /**
     * Prepare constructor.
     * Prepare system for boot.
     * Load system necessary components.
     */
    public function __construct() {

        $this->systemLocalize();
        $this->setLocales();
        $this->checkRequirements();
        $this->setEnviroment();

    }

    /**
     * Set user session IP
     */
    public function setIP() {

        if(!isset($_SESSION['auth']['ip']))
            $_SESSION['auth']['ip'] = Request::$server['client']['ip'];

    }

    /**
     * Localize system
     */
    public function systemLocalize() {

        // Parse language string
        $language = Request::$server['client']['language'];
        $language = substr($language, 0, 2);

        // Get supported languages
        $supportedLanguages = [];
        foreach(Config::$file['system']['support']['languages'] as $code => $nothing)
            array_push($supportedLanguages, $code);

        // Check if users language is supported
        if(!in_array($language, $supportedLanguages))
            $language = Config::$file['system']['locale']['language'];

        // Load and save system localization
        $file = file_get_contents(ROOT . '/app/Data/Locale/' . $language . '/system.json');
        $this->LANG = json_decode($file, true);

    }

    /**
     * Prepare system enviroment.
     */
    public function setEnviroment() {

        // Get enviroment information
        $env = Config::$file['system']['env'];

        // Setup enviroment
        if($env['debug']) {

            // Turn on error reporting
            error_reporting(E_ALL);
            ini_set('display_errors', true);

        } else {

            // Turn off error reporting
            error_reporting(0);
            ini_set('display_errors', false);

        }

    }

    /**
     * Check system requirements.
     */
    public function checkRequirements() {

        // Get system requirements
        $env = Config::$file['system']['requirements'];

        // Check system requirement
        if(version_compare(PHP_VERSION, $env['php-version'], '<')) {
            echo $this->LANG['PHP_VERSION'];
            exit;
        }

    }

    /**
     * Prepare translations and timezones.
     */
    public function setLocales() {

        // Get and set timezone
        $env = Config::$file['system']['locale']['timezone'];
        date_default_timezone_set($env);

    }

    /**
     * @return bool
     * Check system installation status.
     */
    public function checkInstall() {

        // Check system installation
        $env = Config::$file['system']['installed'];

        // If is installed return true
        if($env) return true;

        return false;

    }

}