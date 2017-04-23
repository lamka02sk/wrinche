<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Template Model. Manages all installed themes.
 * Version: 0.1.3
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Helpers\Config;

class TemplateModel extends MainModel {

    public static $template = [];

    /**
     * Main function. Starts the model
     */
    public function start() {

        // Initialize Website Model
        $model = new WebsiteModel;
        $model->start();

        // Prepare template
        if(empty(self::$template))
            $this->prepareTemplate();

    }

    public function prepareTemplate() {

        $templateID = WebsiteModel::$website['template'];
        $templateName = Config::$file['system']['support']['templates'][$templateID];

        $path = "templates/" . $templateName . "/config.json";
        $config = new Config('');
        self::$template = $config->getConfig($path);

    }

}