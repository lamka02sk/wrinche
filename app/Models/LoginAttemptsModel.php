<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Login Attempts Model. Holds and Manages Login Attempts to User Accounts.
 * Version: 0.1.3
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Database\QueryBuilder;
use App\Helpers\DateTime;

class LoginAttemptsModel extends MainModel {

    public $table = 'login_attempts';
    public $interval = '6 minutes'; // Minutes
    public $max = 3; // Attempts in $this->interval

    public static $attempts;

    public function start() {

        $dateTime = new DateTime;
        $created = $dateTime->sub($this->interval);

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->select()
            ->count()
            ->where(
                ['user_id', 'created'],
                ['=', '>='],
                [UserModel::$user['id'], $created]
            )
            ->exec();

        LoginAttemptsModel::$attempts = $builder->output[0]['count'];

    }

    public function checkAttempts() {

        if(LoginAttemptsModel::$attempts >= $this->max)
            return false;

        return true;

    }

    public function getAttempts($from, $to) {

        // TODO: Get list of login attempts between 2 dates

    }

    public function addAttempt() {

        $userID = UserModel::$user['id'];

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->insert()
            ->insertRow([[
                'user_id' => $userID
            ]])
            ->exec();

    }

}