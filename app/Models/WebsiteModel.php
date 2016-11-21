<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Website Model. Holds and Manages Website Info.
 * Version: 0.1
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Database\QueryBuilder;

class WebsiteModel extends MainModel {

    public $website = [];

    public function start() {

        // Load website settings if needed

    }

    public function createWebsite($name, $description, $category, $telemetry) {

        $query = new QueryBuilder;
        $query->queryCommands
            ->table('website')
            ->insert()
            ->insertRow([[
                'name' => $name,
                'description' => $description,
                'category' => $category,
                'send_stats' => $telemetry
            ]])
            ->exec();

    }

}