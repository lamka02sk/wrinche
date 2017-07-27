<?php

namespace App\Models\Articles;

use App\Database\QueryBuilder;
use App\Models\ArticlesModel;

class RevisionsModel extends ArticlesModel {

    const TABLE = 'revisions';

    public function prepareArticleRevisions() {

        if(!isset($this->preloadID) || empty($this->preloadID))
            return false;

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->select()
            ->selectValues()
            ->where('article_id', $this->preloadID)
            ->exec();

        self::$article['revisions'] = $builder->output[0] ?? [];
        return true;

    }

}