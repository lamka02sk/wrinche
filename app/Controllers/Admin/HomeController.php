<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Controller for administration homepage.
 * Version: 0.1
 * Authors: lamka02sk
 */

namespace App\Controllers\Admin;

use App\Controllers\AdminController;
use App\Models\UserModel;

class HomeController extends AdminController {

    /**
     * HomeController constructor.
     */
    public function __construct() {

        $this->start();

    }

    /**
     * ... TODO
     */
    public function get() {

        echo UserModel::$user['username'] . '<br>';
        echo 'welcome to admin!';

    }

}