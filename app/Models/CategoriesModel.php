<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Categories Model. Manages content categories
 * Version: 0.1.0
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Database\QueryBuilder;

class CategoriesModel extends MainModel {

    /**
     * @var string
     * Models' primary DB table
     */
    const TABLE = 'categories';

    /**
     * @var array
     * Stores data about logged in user
     */
    public static $categories = [];

    /**
     * Main function. Starts the model
     * @param bool $prepare
     */
    public function start(bool $prepare = false) {

        if($prepare)
            $this->prepareAllCategories();

    }

    public function prepareCategories(array $categories = [], string $column = '') {

        if(empty($categories))
            $this->prepareAllCategories();

        if(empty($column))
            $column = 'id';

        foreach($categories as $category)
            $this->prepareCategory($category, $column);

    }

    public function prepareAllCategories() {

        // Get all categories from DB
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->select()
            ->selectValues()
            ->exec();

        self::$categories = [];
        foreach($builder->output as $category)
            self::$categories[$category['id']] = $category;

        return true;

    }

    public function prepareCategory($category, string $column = 'id') {

        if($column === 'id')
            if(isset(self::$categories[$category])) return true;

        // Get category from the DB
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->select()
            ->selectValues()
            ->where($column, $category)
            ->limit(1)
            ->exec();

        if(isset($builder->output[0])) {
            $result = $builder->output[0];
            self::$categories[$result['id']] = $result;
        }

        return true;

    }

}