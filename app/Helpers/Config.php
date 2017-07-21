<?php

namespace App\Helpers;

class Config {

    /**
     * @var array
     * List of system config files
     */
    private $files = [
        'system'
    ];

    /**
     * @var array
     * Stores config files content
     */
    public static $file = [];

    /**
     * Config constructor. Load all system config files, optionally load selected configs
     * @param string $file Single file name allowed!
     */
    public function __construct($file = 'ALL') {

        if(empty($file))
            return false;

        // Detect current case: all or selected configs
        switch($file) {
            case 'ALL':
                $this->loadConfigs();
                break;
            default:
                $this->loadConfig($file);
                break;
        }

        return true;

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
        if(file_exists(ROOT . '/app/Config/' . $file . '.json'))
            $json = file_get_contents(ROOT . '/app/Config/' . $file . '.json');
        else if(file_exists(ROOT . '/app/Config/' . $file . '.default.json'))
            $json = file_get_contents(ROOT . '/app/Config/' . $file . '.default.json');
        else
            $json = '{}';

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

    /**
     * @param $path
     * Return config from custom path
     * @return mixed
     */
    public function getConfig($path) {

        $json = file_get_contents(ROOT . '/' . $path);
        return json_decode($json, true);

    }

}