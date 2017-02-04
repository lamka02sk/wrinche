<?php

namespace App\Models;

use App\Helpers\Config;
use App\Requests\Request;

class LocaleModel extends MainModel {

    public $language;
    public $domain;
    public $locale;

    public function start() {

        //$this->getLocale();
        return $this->language;

    }

    public function setLanguage($domain) {

        $language = $this->getLanguage();
        $supportedLanguages = [];
        foreach(Config::$file['system']['support']['languages'] as $code => $nothing)
            array_push($supportedLanguages, $code);

        if(!in_array($language, $supportedLanguages)) {
            if($language === 'cs')
                $language = 'sk';
            else
                $language = Config::$file['system']['locale']['language'];
        }

        $this->language = $language;
        $this->domain = $domain;

    }

    public function getLanguage() {

        $language = Request::$server['client']['language'];
        return substr($language, 0, 2);

    }

    public function getLocale() {

        $file = $this->getLocaleFile();
        $this->parseLocaleFile($file);

    }

    public function getLocaleFile() {

        $file = file_get_contents(ROOT . '/app/Data/Locale/' . $this->language . '/' . $this->domain . '.json');
        return $file;

    }

    public function parseLocaleFile($file) {

        $this->locale = json_decode($file, true);

    }

}