<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Old Passwords Model. Manages old passwords.
 * Version: 0.1.2
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Database\QueryBuilder;

class OldPasswords extends MainModel {

    /**
     * @var string
     * Models' primary DB table
     */
    public $table = 'passwords_old';

    /**
     * Main function. Starts the model
     */
    public function start() {

        // TODO: Maybe sometimes

    }

    /**
     * Add new old password to the DB
     */
    public function addOldPassword() {

        // Create the DB query
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->insert()
            ->insertRow([[
                'user_id' => UserModel::$user['id'],
                'password' => UserModel::$user['password']
            ]])
            ->exec();

    }

    /**
     * @param int $userID
     * Get list of all old password used by the defined user
     * @return array
     */
    public function getOldPasswords(int $userID = -1) {

        // If userID is undefined, use current userID
        if($userID === -1)
            $userID = UserModel::$user['id'];

        // Create the DB query
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->select()
            ->selectValues()
            ->where('user_id', $userID)
            ->exec();

        return $builder->output;

    }

}