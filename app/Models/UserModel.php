<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * User Model. Holds and manages users data.
 * Version: 0.2.5
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Errors\UserEvents;
use App\Helpers\Crypto;
use App\Helpers\Validator;
use App\Helpers\Sanitizer;
use App\Database\QueryBuilder;

class UserModel extends MainModel {

    public $table = 'users';

    public static $user = [];

    public function start() {

        if(!isset(LoginModel::$login['user_id']))
            return false;

        $userID = LoginModel::$login['user_id'];
        $this->prepareUserByID($userID);

        $userSettings = new UserSettingsModel;
        $userSettings->start();

    }

    public function getUserBy($column, $value) {

        // Query DB
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->select()
            ->selectValues()
            ->where($column, $value)
            ->exec();

        return $builder->output[0] ?? [];

    }

    public function addUser($username, $email, $password, $admin) {

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->insert()
            ->insertRow([[
                'username' => $username,
                'email' => $email,
                'password' => $password,
                'admin' => $admin
            ]])
            ->exec();

    }

    public function updateUser() {

        // TODO: Update user with user model data

    }

    public function createUser($username, $email, $password, $admin = 0, $valid = false) {

        // Validate data if they are not
        if(!$valid) {

            $results = [];
            $validator = new Validator;

            $results[] = $validator->validateUsername($username);
            $results[] = $validator->validateEmail($email);
            $results[] = $validator->validatePassword($password);

            foreach($results as $result) {
                if(!$result)
                    new UserEvents(4); // Invalid Input
            }

        }

        // Sanitize data
        $sanitizer = new Sanitizer;
        $username = $sanitizer->sanitizeMagicQuotes($username);
        $email = $sanitizer->sanitizeEmail($email);

        // Create password hash
        $crypto = new Crypto;
        $password = $crypto->encryptPassword($password);

        // Create user in database
        $this->addUser($username, $email, $password, $admin);

    }

    public function prepareUserByID($userID) {

        $this->prepareUser('id', $userID);

    }

    public function prepareUserByUsername($username) {

        $this->prepareUser('username', $username);

    }

    public function prepareUserByEmail($email) {

        $this->prepareUser('email', $email);

    }

    public function prepareUser($type, $value) {

        // Query DB
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->select()
            ->selectValues()
            ->where($type, $value)
            ->exec();

        UserModel::$user = $builder->output[0];

    }

}