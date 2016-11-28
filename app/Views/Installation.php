<?php

/* wrinche. Modern, powerful and user friendly CMS. */

namespace App\Views;

use App\Views\Main as MainView;
use App\Helpers\Config;

class Installation extends MainView {

    public function __construct($LANG, $page = '') {

        $this->page = $page;

        $this->setVendorAssets(['jquery', 'selector', 'translate', 'theme']);
        $this->setAssets('installation');
        $this->setFavicon();

        $layout = 'Install';

        if(empty($page)) {
            $page = 'Installation';
        } else {
            $page = 'Done';
        }

        $this->CONFIG = Config::$file;

        require_once ROOT . '/app/Config/timezones.php';
        require_once ROOT . '/app/Layouts/Layout/Main.php';

    }

}