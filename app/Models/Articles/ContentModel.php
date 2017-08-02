<?php

namespace App\Models\Articles;

use App\Database\QueryBuilder;
use App\Models\ArticlesModel;

class ContentModel extends ArticlesModel {

    const TABLE = 'articles_content';

    public $parent;

    public function __construct(ArticlesModel $parent) {

        $this->parent = $parent;

    }

    public function prepareArticleContent() {

        if(!isset($this->parent->preloadID) || empty($this->parent->preloadID))
            return false;

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->select()
            ->selectValues()
            ->where('article_id', $this->parent->preloadID)
            ->exec();

        self::$article['articles_content'] = $builder->output[0] ?? [];
        return true;

    }

    public function saveArticleContent() {

        // Prepare articles_content table data
        $data = $this->parent->articleData['articles_content'];
        $data['article_id'] = $this->parent->articleID;

        // Save article content
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->insert()
            ->insertRow([$data])
            ->exec();

    }

    public function updateArticleContent() {

        // Prepare articles_content table data
        $data = $this->parent->articleData['articles_content'];
        $articleID = $this->parent->preloadID;

        // Save article content
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->update()
            ->updateRow($data)
            ->where('article_id', $articleID)
            ->exec();

    }

    public function isArticleUrl($url, $ignore = false) {

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->select()
            ->selectValues('article_id')
            ->where('url', $url)
            ->exec();

        $output = $builder->output[0] ?? false;
        
        if($output === false || (int)$output['article_id'] === (int)$ignore)
            return false;
        
        return true;

    }

}