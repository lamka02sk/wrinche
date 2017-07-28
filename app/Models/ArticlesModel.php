<?php

namespace App\Models;

use App\Database\QueryBuilder;
use App\Helpers\Generator;
use App\Models\Articles\ContentModel;
use App\Models\Articles\RevisionsModel;

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

    public $articleID;
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

    /**
     * @param        $value
     * @param string $by
     * Check if article exists
     * @return null
     */
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

    /**
     * @param $articleData
     * Set article data
     */
    public function setArticleData($articleData) {
        $this->articleData = $articleData;
    }

    /**
     * @param $articleType
     * Set article type
     */
    public function setArticleType($articleType) {
        $this->articleType = $articleType;
    }

    /**
     * @param $articleAction
     * Set article action
     */
    public function setArticleAction($articleAction) {
        $this->articleAction = $articleAction;
    }

    /**
     * Save current loaded article
     */
    public function saveArticle() {

        // Prepare articles table data
        $generator = new Generator;
        $previewID = $generator->generateToken(16);

        $data = $this->articleData['articles'];
        $data['author'] = UserModel::$user['id'];
        $data['layout'] = $this->articleType;
        $data['preview'] = $previewID;

        // Save data to DB
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->insert()
            ->insertRow([$data], true)
            ->exec();
        $this->articleID = $builder->insertID;

        // Save article content
        $model = new ContentModel($this);
        $model->saveArticleContent();

        // Save article revision
        $model = new RevisionsModel($this);
        $model->saveArticleRevision();

        return $this->articleID;

    }

    /**
     * @param int $id
     * Set article identifier
     */
    public function setArticleID(int $id) {
        $this->preloadID = $id;
    }

    /**
     * @param bool $prepareContent
     * @param bool $prepareRevisions
     * Preload article by given identifier
     * @return bool
     */
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
            $model = new ContentModel($this);
            $model->prepareArticleContent();
        }

        // Prepare article revisions
        if($prepareRevisions) {
            $model = new RevisionsModel($this);
            $model->prepareArticleRevisions();
        }

        return true;

    }

}