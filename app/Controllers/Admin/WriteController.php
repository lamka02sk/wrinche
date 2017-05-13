<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Controller for writing new articles.
 * Version: 0.2.1
 * Authors: lamka02sk
 */

namespace App\Controllers\Admin;

use App\Controllers\AdminController;
use App\Controllers\ComponentsController;
use App\Models\ComponentsModel;
use App\Render\Html;
use App\Requests\Request;

class WriteController extends AdminController {

    public $currentComponent = '';
    public $componentHtml;
    public $headerTemplates;
    public $componentEnd;
    public $componentsModel;

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

        // Detect get or post
        if(Request::$method === 'post')
            $this->post();
        else
            $this->get();

    }

    public function get() {

        // Preload component templates and save instance
        $model = new ComponentsModel('');
        $model->start(true);
        $this->componentsModel = $model;

        // Show Site
        $this->createView('Write');

    }

    public function getComponent($name) {

        // Check if component is commented out
        if($name[0] === '*')
            return false;

        // Set current component
        $this->componentsModel->setCurrentComponent($name);

        // Render component content
        $this->componentsModel->renderComponent();

        // Display component
        echo $this->componentsModel->composeComponentHTML();
        return true;

    }

    public function post() {

        // TODO

    }

}