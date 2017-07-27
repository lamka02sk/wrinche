<?php

namespace App\Models\Articles;

use App\Database\QueryBuilder;
use App\Models\ArticlesModel;

class ContentModel extends ArticlesModel {

    const TABLE = 'articles_content';

    public function prepareArticleContent() {

        if(!isset($this->preloadID) || empty($this->preloadID))
            return false;

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table(self::TABLE)
            ->select()
            ->selectValues()
            ->where('article_id', $this->preloadID)
            ->exec();

        self::$article['articles_content'] = $builder->output[0] ?? [];
        return true;

    }

}