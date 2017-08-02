<?php

namespace App\Models\Articles;

use App\Database\QueryBuilder;
use App\Models\ArticlesModel;

class RevisionsModel extends ArticlesModel {

    const TABLE = 'revisions';

    public $parent;

    public function __construct(ArticlesModel $parent) {

        $this->parent = $parent;

    }

    public function prepareArticleRevisions() {

        if(!isset($this->parent->preloadID) || empty($this->parent->preloadID))
            return false;

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->select()
            ->selectValues()
            ->where('article_id', $this->parent->preloadID)
            ->exec();

        self::$article['revisions'] = $builder->output ?? [];
        return true;

    }

    public function saveArticleRevision() {

        // Create data
        $data = $this->parent->articleData['revisions'];
        $articleID = $this->parent->articleID;
        
        if(empty($articleID) || $articleID === null)
            $articleID = $this->parent->preloadID;

        // Save to DB
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->insert()
            ->insertRow([[
                'article_id' => $articleID,
                'description' => $data
            ]])
            ->exec();

    }

}