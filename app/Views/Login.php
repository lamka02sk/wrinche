<?php

/* wrinche. Modern, powerful and user friendly CMS. */

namespace App\Views;

use App\Views\Main as MainView;
use App\Helpers\Config;
use App\Models\LocaleModel;

class Login extends MainView {

    public function __construct(string $page = 'Login') {

        $this->setVendorAssets(['jquery', 'jsonLoader', 'translate', 'theme', 'selector']);

        if($page === 'Login')
            $this->setAssets('login');
        else {
            $this->setVendorAssets('validator');
            $this->setStyles('login');
            $this->setScripts(strtolower($page));
        }

        $this->setFavicon();
        $layout = 'Auth';

        $this->CONFIG = Config::$file;

        // Localization
        $model = new LocaleModel;
        $model->setLanguage('login');
        $LANG = $model->start();

        require_once ROOT . '/app/Layouts/Layout/Main.php';

    }

}