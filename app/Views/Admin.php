<?php

/* wrinche. Modern, powerful and user friendly CMS. */

namespace App\Views;

use App\Controllers\Admin\DashboardController;
use App\Models\UserSettingsModel;
use App\Requests\Request;
use App\Views\Main as MainView;
use App\Helpers\Config;

class Admin extends MainView {

    public function __construct($controller, $layout) {

        if(!Request::$ajax) {

            $this->theme = array_keys(Config::$file['system']['support']['themes'])[UserSettingsModel::$settings['theme']];
            $LANG = array_keys(Config::$file['system']['support']['languages'])[UserSettingsModel::$settings['language']];

            $this->setVendorAssets([
                'jquery',
                'jsonLoader',
                'translate',
                'theme',
                'selector2',
                'closer',
                'loader2',
                'packery',
                'ckeditor',
                'mediaManager',
                'flatpickr',
                'sortable'
            ]);
            $this->setAssets('admin');
            $this->setScripts(strtolower($layout));
            $this->setFavicon();

        }

        $page = 'Main';
        $this->CONFIG = Config::$file;

        require_once ROOT . '/app/Config/timezones.php';
        require_once ROOT . '/app/Layouts/Layout/Main.php';

    }

}