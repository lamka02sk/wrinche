<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * System config loader helper.
 * Version: 0.6.2
 * Authors: lamka02sk
 */

namespace App\Helpers;

class Config {

    // List of system config files
    private $files = [
        'system'
    ];

    public static $file = [];

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
        foreach($this->files as $file)
            $this->loadConfig($file);

    }

    /**
     * @param $file
     * Load single config and save data into session variable.
     */
    private function loadConfig($file) {

        // Get config
        $json = file_get_contents(ROOT . '/app/Config/' . $file . '.json');
        $array = json_decode($json, true);

        // Save config into session variable
        self::$file[$file] = $array;

    }

    /**
     * @param $config
     * Save config file with changed data
     */
    public function saveChanges($config) {

        $data = Config::$file[$config];
        $data = json_encode($data);
        file_put_contents(ROOT . '/app/Config/' . $config . '.json', $data, LOCK_EX);

    }

}