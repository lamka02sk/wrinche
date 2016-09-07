<?php

/* wrinche. Modern, powerful and user friendly CMS. */

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
     * Localize system
     */
    public function systemLocalize() {

        $env = $_SESSION['CONFIG']['system']['locale']['language'];

        $language = $this->stats->parsedData['client']['language'];
        $language = substr($language, 0, 2);

        $supportedLanguages = [];
        foreach($_SESSION['CONFIG']['system']['support']['languages'] as $code => $nothing) {
            array_push($supportedLanguages, $code);
        }

        if(!in_array($language, $supportedLanguages)) {
            $language = $_SESSION['CONFIG']['system']['locale']['language'];
        }

        $file = file_get_contents(ROOT . '/app/Data/Locale/' . $language . '/system.json');
        $this->LANG = json_decode($file, true);

    }

    /**
     * Prepare system enviroment.
     */
    public function setEnviroment() {

        $env = $_SESSION['CONFIG']['system']['env'];

        if($env['debug']) {
            error_reporting(E_ALL);
            ini_set('display_errors', true);
        } else {
            error_reporting(0);
            ini_set('display_errors', false);
        }

    }

    /**
     * Check system requirements.
     */
    public function checkRequirements() {

        global $LANG;

        $env = $_SESSION['CONFIG']['system']['requirements'];

        if(version_compare(PHP_VERSION, $env['php-version'], '<')) {
            echo $LANG['PHP_VERSION'];
            exit;
        }

    }

    /**
     * Prepare translations and timezones.
     */
    public function setLocales() {

        $env = $_SESSION['CONFIG']['system']['locale']['timezone'];
        date_default_timezone_set($env);

    }

    /**
     * @return bool
     * Check system installation status.
     */
    public function checkInstall() {

        $env = $_SESSION['CONFIG']['system']['installed'];

        if($env) {
            return true;
        }

        return false;

    }

}