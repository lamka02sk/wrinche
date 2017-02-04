<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Controller for administration homepage.
 * Version: 0.1
 * Authors: lamka02sk
 */

namespace App\Controllers\Admin;

use App\Controllers\AdminController;

class HomeController extends AdminController {

    public function __construct() {

        $this->start();

    }

    public function get() {

        echo 'welcome to admin!';

    }

}