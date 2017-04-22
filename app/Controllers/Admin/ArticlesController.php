<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Controller to manage existing articles
 * Version: 0.1.0
 * Authors: lamka02sk
 */

namespace App\Controllers\Admin;

use App\Controllers\AdminController;
use App\Models\ComponentsModel;
use App\Requests\Request;
use App\Views\Admin as ArticlesView;

class ArticlesController extends AdminController {

    public $currentComponent = '';

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

        // Render view
        $this->renderArticles();

    }

    public function renderArticles() {

        // Create view
        $this->createView('Articles');

    }

}