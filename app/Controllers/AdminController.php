<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Controller for administration.
 * Version: 0.1.1
 * Authors: lamka02sk
 */

namespace App\Controllers;

use App\Auth\Login;
use App\Controllers\Admin\AuthController;
use App\Helpers\Config;
use App\Helpers\Redirect;
use App\Models\TemplateModel;
use App\Requests\Request;
use App\Views\Admin;

class AdminController extends MainController {

    /**
     * ... TODO
     */
    public function start() {

        // Load template config if not AJAX
        if(!Request::$ajax) {
            $model = new TemplateModel;
            $model->start();
        }

    }

    public function createView($layout) {

        // Call view instance
        new Admin($this, $layout);

    }

}