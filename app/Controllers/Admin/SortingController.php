<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Controller for content sorting.
 * Version: 0.1.0
 * Authors: lamka02sk
 */

namespace App\Controllers\Admin;

use App\Controllers\AdminController;
use App\Helpers\Redirect;
use App\Requests\Request;

class SortingController extends AdminController {

    public function __construct($subcategory) {

        // Save subcategory
        $this->subcategory = $subcategory;

        // Execute the parent "constructor"
        $this->start();

        // Redirect if no subcategory
        if(empty($subcategory))
            Redirect::route('sorting/categories');

        // Detect POST or GET
        if(Request::$method === 'post')
            $this->post();
        else
            $this->get();

    }

    public function get() {

        // Show site
        $this->createView('Sorting');

    }

    public function post() {



    }

}