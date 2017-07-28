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
use App\Models\Articles\RevisionsModel;
use App\Models\ArticlesModel;
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

    public $editMode = false;
    public $subcategory;

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

        // Determine subcategory type
        if(is_numeric($this->subcategory)) {

            // If article with given ID exists
            $model = new ArticlesModel;
            if($model->checkArticle($this->subcategory) > 0) {

                // Change edit mode
                $this->editMode = true;

                // Prepare article data
                $model = new ArticlesModel;
                $model->setArticleID($this->subcategory);
                $model->prepareArticle();


            } else
                new UserEvents(15);  // Article does not exist

        }

        // Show Site
        $this->createView('Write');

    }

    public function post() {

        // Save data from components
        $postType = Request::$forms['type'];
        $componentsData = Request::$forms['components'];
        $componentsOrder = Request::$forms['order'] ?? [];
        $postAction = Request::$forms['action'] ?? false;
        $postID = Request::$forms['articleID'] ?? false;

        // Check edit mode
        if($postID !== false)
            $this->editMode = true;

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
        $serializedData = $componentSerializer->result;

        // Convert post type to numeric value
        $layoutNumber = 0;
        foreach(TemplateModel::$template['layouts'] as $layoutName => $layoutContent) {
            if(strtolower($layoutName) === strtolower($postType))
                break;
            ++$layoutNumber;
        }

        // Save data
        $model = new ArticlesModel;
        $model->setArticleData($serializedData);
        $model->setArticleAction($postAction);
        $model->setArticleType($layoutNumber);
        $model->saveArticle();

        // Success
        echo json_encode([
            'success' => true,
            'code' => 200
        ]);

    }

}