<?php

/**
 * wrinche. Modern, powerful and user friendly CMS.
 * @author Samuel Illo
 * @since 0.0.3
 */

namespace App\Controllers\Admin;

use App\Controllers\AdminController;
use App\Errors\UserEvents;
use App\Models\CategoriesModel;
use App\Requests\Request;

class CategoryController extends AdminController {

    public $type = 'category';

    /**
     * CategoryController constructor.
     * @param $subcategory
     */
    public function __construct($subcategory) {

        // Save subcategory
        $this->subcategory = $subcategory;

        // Execute the parent "constructor"
        $this->start();

        // Detect get or post
        if(strtolower(Request::$method) === 'post')
            $this->post();
        else
            $this->get();

    }

    public function get() {

        // Show site
        $this->createView('Category');

    }

    public function post() {

        // TODO

    }

    public function currentCategory() {

        $model = new CategoriesModel;
        $category = $model->prepareCategory($this->subcategory, 'url', true);

        // TEMPORARY
        if(!is_array($category) || empty($category))
            new UserEvents(13);

        if($category['parent'] === null)
            $category['parent'] = -1;

        return $category;

    }

}