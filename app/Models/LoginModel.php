<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Logins Model. Holds and Manages User Sessions.
 * Version: 0.1.5
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Database\QueryBuilder;
use App\Helpers\DateTime;
use App\Requests\Request;

class LoginModel extends MainModel {

    public $table = 'logins';

    public static $login = [
        'hash' => '',
        'key' => '',
        'ip' => '',
        'ua' => '',
        'created' => '',
        'updated' => ''
    ];

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
                ['hash', 'key', 'updated'],
                ['=', '=', '>='],
                [$login['hash'], $login['key'], $maxTime]
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

        // Update login timestamp
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->update()
            ->updateRow([
                'inc' => self::$inc + 1
            ])
            ->where(
                ['hash', 'key'],
                ['=', '='],
                [LoginModel::$login['hash'], LoginModel::$login['key']]
            )
            ->exec();

    }

    public function removeLogin() {



    }

}