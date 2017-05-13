<?php

namespace App\Models;

use App\Render\Html;

class ComponentsModel extends MainModel {

    public static $templates = [];
    public static $templatesRenders = [];
    public static $componentsList = [];
    public static $components = [];
    public static $renders = [];

    public $currentComponent;

    public function start(bool $preload = false) {

        $this->preloadTemplates();
        $this->preloadComponentsList();
        if($preload)
            $this->preloadComponents();

        return true;

    }

    public function __construct(string $component) {

        if(empty($component))
            return false;

        if(empty(self::$templates))
            $this->preloadTemplates();

        return true;

    }

    public function preloadComponentsList() {

        $json = file_get_contents(ROOT . '/app/Components/components.json');
        self::$componentsList = json_decode($json, true);

    }

    public function preloadTemplates() {

        $json = file_get_contents(ROOT . '/app/Components/templates.json');
        self::$templates = json_decode($json, true);

    }

    public function preloadComponent(string $component) {

        if(isset(self::$components[$component]))
            return false;

        $json = file_get_contents(ROOT . '/app/Components/Files/' . $component . '.json');
        self::$components[$component] = json_decode($json, true);
        return true;

    }

    public function preloadComponents() {

        if(empty(self::$componentsList))
            $this->preloadComponentsList();

        foreach(self::$componentsList['default'] as $component)
            $this->preloadComponent($component);

    }

    public function setCurrentComponent(string $component) {

        if(empty(self::$componentsList))
            $this->preloadComponentsList();

        $this->currentComponent = $component;
        return true;

    }

    public function getCurrentComponent() {

        if(empty($this->currentComponent))
            return false;

        return $this->currentComponent;

    }

    public function renderComponent() {

        if(!isset(self::$components[$this->currentComponent]))
            return false;

        if(in_array($this->currentComponent, self::$componentsList['default']))
            $this->renderDefaultComponent();
        return true;

    }

    public function renderDefaultComponent() {

        // Check if is rendered
        if(isset(self::$renders[$this->currentComponent]))
            return false;

        // Prepare component
        $component = self::$components[$this->currentComponent];

        // Check template
        $template = $component['template'] ?? [];
        if(empty($template))
            return false;

        // Check if component is activated
        if(!$component['active'])
            return false;

        // Render component header
        $this->renderComponentHeader($component);

        // Render HTML from component template
        $render = new Html($template, []);
        self::$renders[$this->currentComponent] = $render->output;
        return true;

    }

    public function renderComponentHeader($component) {

        $firstElement = '<div class="component-element" data-component="' . $this->currentComponent . '">';
        $lastElement = '</div>';

        if(!isset($component['defaultElements']) || !$component['defaultElements']) {
            if(!isset($component['header']) || !isset(self::$templates[$component['header']])) {
                self::$templatesRenders[$this->currentComponent] = $firstElement . '%content%' . $lastElement;
                return true;
            }
        }

        $headerName = self::$components[$this->currentComponent]['header'];
        $headerTemplate = self::$templates[$headerName];
        $render = new Html($headerTemplate, [
            "component" => $this->currentComponent
        ]);

        $headerElement = $render->output;
        self::$templatesRenders[$this->currentComponent] = $firstElement . $headerElement . '%content%' . $lastElement;
        return true;

    }

    public function composeComponentHTML() {

        $wrapper = self::$templatesRenders[$this->currentComponent];
        $content = self::$renders[$this->currentComponent];
        return str_replace('%content%', $content, $wrapper);

    }

}