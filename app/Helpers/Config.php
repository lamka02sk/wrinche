<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * System config loader helper.
 * Version: 0.6
 * Authors: lamka02sk
 */

namespace App\Helpers;

class Config {

    // List of system config files
    private static $files = [
        'system'
    ];

    /**
     * Config constructor. Load all system config files, optionally load selected configs
     * @param string $file Single file name allowed!
     */
    public function __construct($file = 'ALL') {

        // Detect current case: all or selected configs
        switch($file) {

            case 'ALL':
                $this->loadConfigs();
                break;

            default:
                $this->loadConfig($file);
                break;

        }

    }

    /**
     * Function for load configs from array
     */
    private function loadConfigs() {

        // Load every config from array
        foreach(self::$files as $file) {
            $this->loadConfig($file);
        }

    }

    /**
     * @param $file
     * Load single config and save data into session variable.
     */
    private function loadConfig($file) {

        // Get config
        $json = file_get_contents('app/Config/' . $file . '.json');
        $array = json_decode($json, true);

        // Save config into session variable
        $_SESSION['CONFIG'][$file] = $array;

    }

}