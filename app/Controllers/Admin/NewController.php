<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * New controller.
 * Version: 0.1.0
 * Authors: lamka02sk
 */

namespace App\Controllers\Admin;

use App\Controllers\AdminController;
use App\Requests\Request;

class NewController extends AdminController {

    /**
     * SettingsController constructor.
     * Prepare write route for render
     * @param $subcategory
     */
    public function __construct($subcategory) {

        // Save subcategory
        $this->subcategory = $subcategory;

        // Execute the parent "constructor"
        $this->start();

        // Detect get or post
        if(Request::$method === 'POST')
            $this->post();
        else
            $this->get();

    }

    public function get() {

        // Show Site
        $this->createView('New');

    }

    public function post() {



    }

}