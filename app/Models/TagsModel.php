<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Tags Model. Manages content tags
 * Version: 0.1.0
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Database\QueryBuilder;
use App\Errors\UserEvents;
use App\Helpers\Validator;

class TagsModel extends MainModel {

    /**
     * @var string
     * Models' primary DB table
     */
    const TABLE = 'tags';

    public $name;
    public $url;
    public $description;
    public $visibility;

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

    public function saveTag() {

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->insert()
            ->insertRow([[
                'name' => $this->name,
                'url' => $this->url,
                'description' => $this->description,
                'visibility' => (int)$this->visibility
            ]])
            ->exec();

        return true;

    }

    public function validateNewTag() {

        $validator = new Validator;

        // Validate name
        if(!$validator->validateStringLength($this->name, 1, 100))
            return false;

        if(!$validator->validateTagName($this->name))
            return false;

        // Validate url
        if(!$validator->validateSimpleUrl($this->url))
            return false;

        if(!$validator->validateStringLength($this->url, 3, 120))
            return false;

        // Validate description
        if(!$validator->validateStringLength($this->description, 0, 200))
            return false;

        return true;

    }

    public function createTag(string $name, string $url, string $description, bool $visibility) {

        if(empty(self::$tags))
            $this->prepareAllTags();

        $this->name = $name;
        $this->url = $url;
        $this->description = $description;
        $this->visibility = $visibility;

        if(!$this->validateNewTag())
            new UserEvents(4);  // Invalid input

        // Check if name is free
        foreach(self::$tags as $tag) {
            $name = $tag['name'];
            $url = $tag['url'];
            if($name === $this->name)
                new UserEvents(12); // Input with the same value already exists
            if($url === $this->url)
                new UserEvents(12);
        }

        // Everything is OK, create tag
        $this->saveTag();

        // Response
        echo json_encode([
            'success' => true,
            'code' => 200
        ]);

    }

    public function removeTag(int $id) {

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->delete()
            ->where('id', $id)
            ->exec();

        return true;

    }

}