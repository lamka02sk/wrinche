<?php

/* wrinche. Modern, powerful and user friendly CMS. */

namespace App\Views;

use App\Views\Main as MainView;

class Installation extends MainView {

    public function __construct($page = '') {

        global $LANG;

        $this->page = $page;

        $this->setVendorAssets('jquery');
        $this->setAssets('installation');
        $this->setFavicon();

        $title = $_SESSION['CONFIG']['system']['name'] . '. ' . $_SESSION['CONFIG']['system']['description'];
        $layout = 'Install';

        if(empty($page)) {
            $page = 'Installation';
        } else {
            $page = 'Done';
        }

        require_once 'app/Layouts/Layout/Main.php';

    }

}