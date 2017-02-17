<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Error Page View. Prepares error page
 * Version: 0.1.2
 * Authors: lamka02sk
 */

namespace App\Layouts\Errors;

use App\Helpers\Config;
use App\Models\LocaleModel;
use App\Views\Main as MainView;

class Error extends MainView {

    public function __construct(int $code = 404) {

        // Set assets, styles and scripts
        $this->setVendorAssets(['jquery', 'jsonLoader', 'translate', 'selector']);
        $this->setAssets('error');
        $this->setFavicon();

        // Set layout and another variables
        $layout = 'Errors';
        $page = $code;
        $this->CONFIG = Config::$file;

        // Localization
        $model = new LocaleModel;
        $model->setLanguage('error');
        $LANG = $model->start();

        // Show layout
        require_once ROOT . '/app/Layouts/Layout/Main.php';

    }

}