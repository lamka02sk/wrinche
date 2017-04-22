<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Controller for writing new articles.
 * Version: 0.1.4
 * Authors: lamka02sk
 */

namespace App\Controllers\Admin;

use App\Controllers\AdminController;
use App\Models\ComponentsModel;
use App\Render\Html;
use App\Requests\Request;

class WriteController extends AdminController {

    public $currentComponent = '';
    public $componentHtml;
    public $headerTemplates;
    public $componentEnd;

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

        // Pre-load HTML header templates
        $this->preLoadTemplates();

        // Show Site
        $this->createView('Write');

    }

    public function preLoadTemplates() {

        $json = file_get_contents(ROOT . '/app/Components/templates.json');
        $this->headerTemplates = json_decode($json, true);

    }

    public function getComponent($name) {

        // Check if components is commented out
        if($name[0] === '*')
            return false;

        // Load list of all installed components
        $model = new ComponentsModel;
        $model->start();
        $model->bindController = $this;

        // Save component name
        $this->currentComponent = $name;

        // Render component content
        $model->renderComponent($this->currentComponent);

        // Render component header
        $this->renderHeader();

        echo $this->componentHtml . $this->componentEnd;
        $this->componentEnd = '';

    }

    public function renderHeader() {

        $defaultHeader = 'component_header';

        if(ComponentsModel::$componentsContent[$this->currentComponent]['active']) {
            echo '<div class="settings-component">';
            $this->componentEnd = '</div>';
        }

        if(!isset(ComponentsModel::$componentsContent[$this->currentComponent])
            || !ComponentsModel::$componentsContent[$this->currentComponent]['defaultElements']
            || !ComponentsModel::$componentsContent[$this->currentComponent]['active'])
            return false;

        if(isset(ComponentsModel::$componentsContent[$this->currentComponent]['header']))
            $defaultHeader = 'component_header_' . ComponentsModel::$componentsContent[$this->currentComponent]['header'];

        $render = new Html($this->headerTemplates[$defaultHeader], [
            'component' => $this->currentComponent
        ]);

        echo $render->output;
        return true;

    }

    public function post() {

        // TODO

    }

}