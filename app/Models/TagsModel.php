<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Tags Model. Manages content tags
 * Version: 0.1.0
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Database\QueryBuilder;

class TagsModel extends MainModel {

    /**
     * @var string
     * Models' primary DB table
     */
    const TABLE = 'tags';

    /**
     * @var array
     * Stores data about logged in user
     */
    public static $tags = [];

    /**
     * Main function. Starts the model
     * @param bool $prepare
     */
    public function start(bool $prepare = false) {

        if($prepare)
            $this->prepareAllTags();

    }

    public function prepareTags(array $tags = [], string $column = '') {

        if(empty($tags))
            $this->prepareAllTags();

        if(empty($column))
            $column = 'id';

        foreach($tags as $tag)
            $this->prepareTag($tag, $column);

    }

    public function prepareAllTags() {

        // Get all categories from DB
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->select()
            ->selectValues()
            ->exec();

        self::$tags = [];
        foreach($builder->output as $tag)
            self::$tags[$tag['id']] = $tag;

        return true;

    }

    public function prepareTag($tag, string $column = 'id') {

        if($column === 'id')
            if(isset(self::$tags[$tag])) return true;

        // Get category from the DB
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->select()
            ->selectValues()
            ->where($column, $tag)
            ->limit(1)
            ->exec();

        if(isset($builder->output[0])) {
            $result = $builder->output[0];
            self::$tags[$result['id']] = $result;
        }

        return true;

    }

}