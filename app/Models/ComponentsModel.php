<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Components Model. Manages all the installed layout components
 * Version: 0.1.1
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Helpers\Config;
use App\Render\Html;

class ComponentsModel extends MainModel {

    public static $components = [];
    public static $componentsContent = [];
    public $currentComponent;
    public $bindController;

    /**
     * Main function. Starts the model
     */
    public function start() {

        // Load components list
        if(empty(self::$components))
            $this->prepareComponents();

    }

    public function prepareComponents() {

        $config = new Config('');
        $components = $config->getConfig('app/Components/components.json');
        self::$components = $components;

    }

    public function loadDefaultComponent($component = '') {

        if(empty($component))
            $component = $this->currentComponent;

        if(isset(self::$componentsContent[$component]))
            return true;

        $json = file_get_contents(ROOT . '/app/Components/Files/' . $component . '.json');
        self::$componentsContent[$component] = json_decode($json, true);
        return true;

    }

    public function renderComponent($componentName) {

        $this->currentComponent = $componentName;

        // Detect component type
        if(in_array($componentName, self::$components['default']))
            $this->renderDefaultComponent();

    }

    public function renderDefaultComponent() {

        // Clear previous output
        $this->bindController->componentHtml = null;

        // Load component content and templates
        $this->loadDefaultComponent();

        // Check template
        $component = self::$componentsContent[$this->currentComponent];
        $template = $component['template'];
        if(!$component['active'])
            return false;

        // Render HTML from component template
        $render = new Html($template, []);
        $this->bindController->componentHtml = $render->output;
        return true;

    }

}