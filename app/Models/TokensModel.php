<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Tokens Model. Manages users' tokens list.
 * Version: 0.1.1
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Database\QueryBuilder;

class TokensModel extends MainModel {

    /**
     * @var string
     * Models' primary DB table
     */
    public $table = 'tokens';

    /**
     * Main function. Starts the model
     */
    public function start() {

        // TODO: Maybe sometimes

    }

    /**
     * @param string $token
     * @param int    $type
     * @param int    $userID
     * Add new token row to the DB
     */
    public function addToken(string $token, int $type = 0, int $userID = -1) {

        // If user is not defined, change user id to currently logged in user
        if($userID === -1)
            $userID = UserModel::$user['id'];

        // Build the query
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->insert()
            ->insertRow([[
                'user_id' => $userID,
                'token' => $token,
                'type' => $type
            ]])
            ->exec();

    }

    /**
     * @param string $token
     * @param int    $type
     * Check if the token exists in the DB
     * @return bool
     */
    public function checkToken(string $token, int $type = 0) {

        // Build the query
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->select()
            ->count()
            ->where(
                ['token', 'type'],
                ['=', '='],
                [$token, $type]
            )
            ->exec();

        $count = $builder->output[0]['count'] ?? 0;

        // Check the count of tokens matching criteria
        if($count < 1)
            return false;

        return true;

    }

    /**
     * @param string $column
     * @param        $value
     * Return token details by defined column name
     * @return array
     */
    public function getTokenBy(string $column, $value) {

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->select()
            ->selectValues()
            ->where($column, $value)
            ->exec();

        return $builder->output[0] ?? [];

    }

    /**
     * @param string $token
     * Return token details by token value
     * @return array
     */
    public function getTokenByToken(string $token) {

        return $this->getTokenBy('token', $token);

    }

    /**
     * @param string $token
     * Delete used token from the DB
     */
    public function deleteToken(string $token) {

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->delete()
            ->where('token', $token)
            ->exec();

    }

}