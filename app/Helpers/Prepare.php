<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Prepare system for use. Load all needed libraries and data.
 * Version: 0.9
 * Authors: lamka02sk
 */

namespace App\Helpers;

use App\Controllers\StatsController;

class Prepare {

    private $stats;
    public $LANG;

    /**
     * Prepare constructor.
     * Prepare system for boot.
     * Load system necessary components.
     * @param StatsController $stats
     */
    public function __construct(StatsController $stats) {

        $this->stats = $stats;

        $this->systemLocalize();
        $this->setLocales();
        $this->checkRequirements();
        $this->setEnviroment();

    }

    /**
     * Set user session IP
     */
    public function setIP() {

        if(!isset($_SESSION['auth']['ip'])) {

            // Set IP
            $_SESSION['auth']['ip'] = $this->stats->parsedData['client']['ip'];

        }

    }

    /**
     * Localize system
     */
    public function systemLocalize() {

        // Parse language string
        $language = $this->stats->parsedData['client']['language'];
        $language = substr($language, 0, 2);

        // Get supported languages
        $supportedLanguages = [];
        foreach($_SESSION['CONFIG']['system']['support']['languages'] as $code => $nothing) {
            array_push($supportedLanguages, $code);
        }

        // Check if users language is supported
        if(!in_array($language, $supportedLanguages)) {
            $language = $_SESSION['CONFIG']['system']['locale']['language'];
        }

        // Load and save system localization
        $file = file_get_contents(ROOT . '/app/Data/Locale/' . $language . '/system.json');
        $this->LANG = json_decode($file, true);

    }

    /**
     * Prepare system enviroment.
     */
    public function setEnviroment() {

        // Get enviroment information
        $env = $_SESSION['CONFIG']['system']['env'];

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
        $env = $_SESSION['CONFIG']['system']['requirements'];

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
        $env = $_SESSION['CONFIG']['system']['locale']['timezone'];
        date_default_timezone_set($env);

    }

    /**
     * @return bool
     * Check system installation status.
     */
    public function checkInstall() {

        // Check system installation
        $env = $_SESSION['CONFIG']['system']['installed'];

        // If is installed return true
        if($env) {
            return true;
        }

        return false;

    }

}