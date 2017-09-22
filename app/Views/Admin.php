<?php

namespace App\Views;

use App\Models\UserSettingsModel;
use App\Requests\Request;
use App\Views\Main as MainView;
use App\Helpers\Config;

class Admin extends MainView {

    public function __construct($controller, $layout) {

        if(!Request::$ajax) {

            $support = Config::$file['system']['support'];
            $this->theme = array_keys($support['themes'])[UserSettingsModel::$settings['theme']];
            $LANG = array_keys($support['languages'])[UserSettingsModel::$settings['language']];
            
            $this->setStyles('style_admin_' . $this->theme, 'dist/');
            $this->setScripts([
                'vendor', 'admin'
            ], 'dist/');
            
            $this->setFavicon();

        }

        $page = 'Main';
        $this->CONFIG = Config::$file;

        require_once ROOT . '/app/Config/timezones.php';
        require_once ROOT . '/app/Layouts/Layout/Main.php';

    }

}