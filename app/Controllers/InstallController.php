<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Controller for installation process.
 * Version: 0.9
 * Authors: lamka02sk
 */

namespace App\Controllers;

use App\Requests\Request;
use App\Views\Installation;
use App\Models\LocaleModel;
use App\Models\InstallModel;

class InstallController extends MainController {

    /**
     * Render correct view and control models
     */
    public function start() {

        // Show installer or save installation data
        if(isset(Request::$forms['installer'])) {

            // Send data to process to InstallModel
            $model = new InstallModel;
            $output = $model->start();

            // Output for the clients JS
            echo $output;

        } else {

            // Localization
            $model = new LocaleModel;
            $model->setLanguage('install');
            $LOCALE = $model->start();

            // Render Installer view
            new Installation($LOCALE);

        }

    }

}