<?php

namespace App\Models;

class LocaleModel extends MainModel {

    public $language;
    public $domain;
    public $locale;

    public function start() {

        //$this->getLocale();
        return $this->language;

    }

    public function setLanguage($language, $domain) {

        $supportedLanguages = [];
        foreach($_SESSION['CONFIG']['system']['support']['languages'] as $code => $nothing) {
            array_push($supportedLanguages, $code);
        }

        if(!in_array($language, $supportedLanguages)) {

            if($language === 'cs') {
                $language = 'sk';
            } else {
                $language = $_SESSION['CONFIG']['system']['locale']['language'];
            }
        }

        $this->language = $language;
        $this->domain = $domain;

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