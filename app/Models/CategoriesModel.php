<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Categories Model. Manages content categories
 * Version: 0.2.1
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Database\QueryBuilder;
use App\Errors\UserEvents;
use App\Helpers\Validator;

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

    public $name;
    public $url;
    public $parent;
    public $description;
    public $visibility;
    public $thumbnail;

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

    public function saveCategory() {

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->insert()
            ->insertRow([[
                'name' => $this->name,
                'url' => $this->url,
                'parent' => $this->parent,
                'description' => $this->description,
                'visibility' => (int)$this->visibility,
                'thumbnail' => $this->thumbnail
            ]])
            ->exec();

        return true;

    }

    public function validateNewCategory() {

        $validator = new Validator;

        // Validate name
        if(!$validator->validateStringLength($this->name, 1, 100))
            return false;

        // Validate url
        if(!$validator->validateSimpleUrl($this->url))
            return false;

        if(!$validator->validateStringLength($this->url, 3, 120))
            return false;

        // Validate parent
        if($this->parent !== null) {
            if(!$validator->validateInteger($this->parent))
                return false;
        }

        // Check if parent exists
        if($this->parent !== null) {
            if(!isset(self::$categories[$this->parent]))
                return false;
        }

        // Validate description
        if(!$validator->validateStringLength($this->description, 0, 200))
            return false;

        return true;

    }

    public function createCategory(string $name, string $url, int $parent, string $description, bool $visibility, string $thumbnail) {

        if(empty(self::$categories))
            $this->prepareAllCategories();

        $this->name = $name;
        $this->url = $url;
        $this->parent = $parent;
        $this->description = $description;
        $this->visibility = $visibility;
        $this->thumbnail = $thumbnail;

        if($this->parent === -1)
            $this->parent = null;

        if(empty($this->thumbnail))
            $this->thumbnail = null;

        if(!$this->validateNewCategory())
            new UserEvents(4);  // Invalid input

        // Check if name is free
        foreach(self::$categories as $category) {
            $name = $category['name'];
            $url = $category['url'];
            if($name === $this->name)
                new UserEvents(12); // Input with the same value already exists
            if($url === $this->url)
                new UserEvents(12);
        }

        // Everything is OK, create category
        $this->saveCategory();

        // Response
        echo json_encode([
            'success' => true,
            'code' => 200
        ]);

    }

    public function getChildren(int $id) {

        if(empty(self::$categories))
            $this->prepareAllCategories();

        $children = [];
        foreach(self::$categories as $category) {
            if((int)$category['parent'] === $id)
                $children[] = $category['id'];
        }

        return $children;

    }

    public function removeCategory(int $id) {

        $children = $this->getChildren($id);

        // Update children
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->update()
            ->updateRow([
                'parent' => null
            ])
            ->whereIn('id', $children)
            ->exec();

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->delete()
            ->where('id', $id)
            ->exec();

        return true;

    }

}