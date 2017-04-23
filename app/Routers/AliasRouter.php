<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Alias Router. Checks and resolves URL route aliases
 * Version: 0.1.0
 * Authors: lamka02sk
 */

namespace App\Routers;

use App\Helpers\Config;
use App\Models\TemplateModel;

class AliasRouter {

    public $alias = '';
    public $value = '';

    public static $aliasList = [];

    public function start(Router $router, string $alias, string $value) {

        // Save values
        $this->alias = strtolower($alias);
        $this->value = strtolower($value);

        // Load aliases
        $config = new Config('');
        self::$aliasList = $config->getConfig('app/Config/alias.json');

        // Check if alias exists
        if(!$this->checkAlias())
            return false;

        // Check value
        if(!$this->checkValue())
            return false;

        // Change route value to layout name
        return $this->changeRoute($router);

    }

    public function checkAlias() {

        // Extract name from alias
        $this->alias = trim($this->alias, "{}");

        // Check alias
        if(!in_array($this->alias, self::$aliasList))
            return false;

        return true;

    }

    public function checkValue() {

        // Call the correct function for alias value checking
        return $this->{'check' . ucfirst($this->alias)}();

    }

    public function checkLayout() {

        // Load list of layouts if not loaded
        $model = new TemplateModel;
        $model->start();

        // Get list of layouts
        $layouts = TemplateModel::$template['layouts'];
        foreach($layouts as $item) {
            if(strtolower($item['name']) === $this->value)
                return true;
        }

        return false;

    }

    public function changeRoute(Router $router) {

        $router->aliasName = "{" . $this->alias . "}";
        $router->changeAlias = $this->value;
        return true;

    }

}