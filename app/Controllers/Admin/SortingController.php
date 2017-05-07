<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Controller for content sorting.
 * Version: 0.2.3
 * Authors: lamka02sk
 */

namespace App\Controllers\Admin;

use App\Controllers\AdminController;
use App\Errors\UserEvents;
use App\Helpers\Redirect;
use App\Models\CategoriesModel;
use App\Models\TagsModel;
use App\Requests\Request;

class SortingController extends AdminController {

    public function __construct($subcategory) {

        // Save subcategory
        $this->subcategory = $subcategory;

        // Execute the parent "constructor"
        $this->start();

        if(strtolower(Request::$method) === 'post')
            $this->post();
        else
            $this->get();

    }

    public function get() {

        // Redirect if no subcategory
        if(empty($this->subcategory))
            Redirect::route('sorting/categories');

        // Show site
        $this->createView('Sorting');

    }

    public function post() {

        $id = (int)Request::$forms['id'] ?? -1;
        $type = Request::$forms['type'] ?? '';

        if($id === -1 || $type === '')
            new UserEvents(4);  // Invalid input

        if($type === 'categories') {
            $model = new CategoriesModel;
            $model->removeCategory($id);
        } else if($type === 'tags') {
            $model = new TagsModel;
            $model->removeTag($id);
        } else
            new UserEvents(4);  // Invalid input

        echo json_encode([
            'success' => true,
            'code' => 200
        ]);

    }

}