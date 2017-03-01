<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Controller for writing new articles.
 * Version: 0.1.0
 * Authors: lamka02sk
 */

namespace App\Controllers\Admin;

use App\Controllers\AdminController;

class WriteController extends AdminController {

    /**
     * WriteController constructor.
     * Prepare write route for render
     * @param $subcategory
     */
    public function __construct($subcategory) {

        // Save subcategory
        $this->subcategory = $subcategory;

        // Execute the parent "constructor"
        $this->start();

    }

}