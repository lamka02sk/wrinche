<?php

namespace App\Models;

use App\Database\QueryBuilder;

class ArticlesModel extends MainModel {

    const TABLE = 'articles';
    const COLUMNS = [
        'author', 'layout', 'pin', 'thumbnail', 'title_picture',
        'attachments', 'meta', 'meta_index', 'status', 'created_at',
        'edited_at', 'copyright', 'comments', 'accessibility',
        'password', 'mistakes', 'planner_auto', 'planner_publish',
        'planner_expiry', 'planner_notify', 'preview'
    ];

    const CONTENT_COLUMNS = [
        'articles.article_id', 'title', 'excerpt', 'url',
        'perex_date', 'perex_location', 'tags', 'categories',
        'custom_fields', 'meta_keywords', 'meta_description',
        'sources', 'content', 'prerender'
    ];

    public $articleData = [];

    public $articleType;
    public $articleAction;

    protected $preloadID;

    public static $article = [
        'articles' => [],
        'articles_content' => [],
        'revisions' => []
    ];

    public function start() {}

    public function checkArticle($value, $by = 'id') {

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->select()
            ->count()
            ->where($by, $value)
            ->exec();

        return $builder->output[0]['count'] ?? null;

    }

    public function saveArticle() {

        // Check if article exists


    }

    public function setArticleID(int $id) {
        $this->preloadID = $id;
    }

    public function prepareArticle($prepareContent = true, $prepareRevisions = true) {

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->select()
            ->selectValues()
            ->where('id', $this->preloadID)
            ->exec();

        self::$article['articles'] = $builder->output[0] ?? [];

        // Prepare article content
        if($prepareContent) {

        }

        // Prepare article revisions
        if($prepareRevisions) {

        }

        return true;

    }

}