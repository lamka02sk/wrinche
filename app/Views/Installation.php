<?php

/* wrinche. Modern, powerful and user friendly CMS. */

namespace App\Views;

use App\Views\Main as MainView;

class Installation extends MainView {

    public function __construct($LANG, $page = '') {

        $this->page = $page;

        $this->setVendorAssets(['jquery', 'formstone-core', 'formstone-dropdown']);
        $this->setAssets('installation');
        $this->setFavicon();

        $title = $_SESSION['CONFIG']['system']['name'] . '. ' . $_SESSION['CONFIG']['system']['description'];
        $layout = 'Install';

        if(empty($page)) {
            $page = 'Installation';
        } else {
            $page = 'Done';
        }

        require_once 'app/Config/timezones.php';

        require_once 'app/Layouts/Layout/Main.php';

    }

}