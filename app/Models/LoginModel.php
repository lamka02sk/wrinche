<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Logins Model. Holds and Manages User Sessions.
 * Version: 0.2.1
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Database\Connection;
use App\Database\QueryBuilder;
use App\Helpers\DateTime;
use App\Requests\Request;

class LoginModel extends MainModel {

    public $table = 'logins';

    public static $login;

    public $max = '24 hour'; // Hours

    public static $inc = 0;

    public function start() {

        // TODO: ??? Nothing to do ... maybe

    }

    public function loginData() {

        $result = [];
        $cookie = explode('|', Request::$cookie['login'] ?? '');
        $result['hash'] = $cookie[0] ?? '';
        $result['key'] = $cookie[1] ?? '';

        return $result;

    }

    public function returnSessions() {

        $dateTime = new DateTime;
        $maxTime = $dateTime->sub($this->max);

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->select()
            ->selectValues()
            ->where(
                ['active', 'user_id', 'updated'],
                ['=', '=', '>='],
                [1, UserModel::$user['id'], $maxTime]
            )
            ->exec();

        return $builder->output;

    }

    public function getLogin() {

        $login = $this->loginData();

        $dateTime = new DateTime;
        $maxTime = $dateTime->sub($this->max);

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->select()
            ->selectValues()
            ->where(
                ['hash', 'key', 'active', 'updated'],
                ['=', '=', '=', '>='],
                [$login['hash'], $login['key'], 1, $maxTime]
            )
            ->first()
            ->exec();

        if(!isset($builder->output[0]) || empty($builder->output[0]))
            return false;

        self::$inc = $builder->output[0]['inc'];
        return $builder->output[0];

    }

    public function checkLogin() {

        $loginData = $this->getLogin();
        if($loginData === false)
            return false;

        if($loginData['ip'] !== Request::$server['client']['ip'] || $loginData['ua'] !== Request::$server['client']['ua'])
            return false;

        // Save login data
        LoginModel::$login = $loginData;
        return true;

    }

    public function addLogin(string $key, string $hash) {

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->insert()
            ->insertRow([[
                'user_id' => UserModel::$user['id'],
                'hash' => $hash,
                'key' => $key,
                'ip' => Request::$server['client']['ip'],
                'ua' => Request::$server['client']['ua']
            ]], true)
            ->exec();

        $id = $builder->output[0];

        // Save login data
        LoginModel::$login = [
            'id' => $id,
            'user_id' => UserModel::$user['id'],
            'hash' => $hash,
            'key' => $key,
            'ip' => Request::$server['client']['ip'],
            'ua' => Request::$server['client']['ua'],
        ];

    }

    public function updateLogin() {

        // SUPER-SLOW!!! about 40 milliseconds, needs to be fixed!!

        // Update login timestamp
        /*$builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->update()
            ->updateRow([
                'inc' => LoginModel::$login['inc'] + 1
            ])
            ->where(
                ['id'],
                [LoginModel::$login['id']]
            )
            ->exec();*/

    }

    public function deactivateLogin() {

        // Update login token row to active FALSE
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->update()
            ->updateRow([
                'active' => 0
            ])
            ->where(
                ['hash', 'key'],
                ['=', '='],
                [LoginModel::$login['hash'], LoginModel::$login['key']]
            )
            ->exec();

    }

}