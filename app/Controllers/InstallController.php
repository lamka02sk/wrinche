<?php

/* wrinche. Modern, powerful and user friendly CMS. */

namespace App\Controllers;

use App\Views\Installation;
use App\Models\LocaleModel;

class InstallController extends MainController {

    public function start() {

        // Show installer or save installation data
        if(isset($_POST['installer'])) {
            // Send data to process to InstallModel

        } else {
            // Get locale and Show installer
            $model = new LocaleModel();
            $model->setLanguage($this->language, 'install');
            $LOCALE = $model->start();
            new Installation($LOCALE);
        }

    }

    public function setLanguage($language) {

        $this->language = substr($language, 0, 2);

    }

}