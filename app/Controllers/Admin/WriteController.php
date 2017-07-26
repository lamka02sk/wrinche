<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Controller for writing new articles.
 * Version: 0.2.1
 * Authors: lamka02sk
 */

namespace App\Controllers\Admin;

use App\Controllers\AdminController;
use App\Errors\UserEvents;
use App\Helpers\Checker;
use App\Models\Components\SerializerModel;
use App\Models\Components\ValidatorModel;
use App\Models\ComponentsModel;
use App\Models\TemplateModel;
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

        // Preload component templates and save instance
        $model = new ComponentsModel('');
        $model->start(true);
        $this->componentsModel = $model;

        // Detect get or post
        if(strtolower((string)Request::$method) === 'post')
            $this->post();
        else
            $this->get();

    }

    public function get() {

        // Show Site
        $this->createView('Write');

    }

    public function post() {

        // Save data from components
        $postType = Request::$forms['type'];
        $componentsData = Request::$forms['components'];
        $componentsOrder = Request::$forms['order'] ?? [];
        $postAction = Request::$forms['action'] ?? false;

        if($postAction === false || $postAction < 0 || $postAction > 2)
            new UserEvents(4);  // Invalid input

        // Validate post type
        $checker = new Checker;
        if(!$checker->templateLayout($postType))
            new UserEvents(14);  // Post type does not exist

        // Validate data from components
        $componentValidator = new ValidatorModel($postType);
        $componentValidator->saveData($componentsData);
        $componentValidator->validateData();

        if(!$componentValidator->valid)
            new UserEvents(4);  // Invalid input

        // Serialize components data
        $componentSerializer = new SerializerModel($componentsData, $componentsOrder);

    }

}