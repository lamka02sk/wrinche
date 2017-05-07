<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * New controller.
 * Version: 0.2.6
 * Authors: lamka02sk
 */

namespace App\Controllers\Admin;

use App\Controllers\AdminController;
use App\Models\CategoriesModel;
use App\Models\TagsModel;
use App\Requests\FormRequest;
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

        $this->{'post' . ucfirst($this->subcategory)}();

    }

    public function postCategory() {

        $name = Request::$forms['title'] ?? '';
        $url = Request::$forms['url'] ?? '';
        $parent = (Request::$forms['parent'] == null ? -1 : Request::$forms['parent']) ?? -1;
        $description = Request::$forms['description'] ?? '';
        $visibility = (Request::$forms['visibility'] === 'true' ? true : false) ?? true;
        $thumbnail = Request::$forms['thumbnail'] ?? '';

        $model = new CategoriesModel;
        $model->createCategory($name, $url, $parent, $description, $visibility, $thumbnail);

    }

    public function postTag() {

        $name = Request::$forms['title'] ?? '';
        $url = Request::$forms['url'] ?? '';
        $description = Request::$forms['description'] ?? '';
        $visibility = (Request::$forms['visibility'] === 'true' ? true : false) ?? true;

        $model = new TagsModel;
        $model->createTag($name, $url, $description, $visibility);

    }

}