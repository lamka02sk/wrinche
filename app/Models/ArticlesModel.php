<?php

namespace App\Models;

class ArticlesModel extends MainModel {

    public $table = 'articles';
    public static $columns = [
        'author', 'layout', 'pin', 'thumbnail', 'title_picture',
        'attachments', 'meta', 'meta_index', 'status', 'created_at',
        'edited_at', 'copyright', 'comments', 'accessibility',
        'password', 'mistakes', 'planner_auto', 'planner_publish',
        'planner_expiry', 'planner_notify', 'preview'
    ];

    public function start() {



    }

}