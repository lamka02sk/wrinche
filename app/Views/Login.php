<?php

/* wrinche. Modern, powerful and user friendly CMS. */

namespace App\Views;

use App\Helpers\Redirect;
use App\Views\Main as MainView;
use App\Helpers\Config;
use App\Models\LocaleModel;

class Login extends MainView {

    public function __construct() {

        $this->setVendorAssets(['jquery', 'jsonLoader', 'translate', 'theme', 'selector']);
        $this->setAssets('login');
        $this->setFavicon();

        $layout = 'Auth';
        $page = 'Login';

        $this->CONFIG = Config::$file;

        // Localization
        $model = new LocaleModel;
        $model->setLanguage('login');
        $LANG = $model->start();

        require_once ROOT . '/app/Layouts/Layout/Main.php';

    }

}