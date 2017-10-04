<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * User Model. Holds and manages users data.
 * Version: 0.2.7
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Errors\UserEvents;
use App\Helpers\Crypto;
use App\Helpers\Validator;
use App\Helpers\Sanitizer;
use App\Database\QueryBuilder;
use MongoDB\Driver\Query;

class UserModel extends MainModel {

    /**
     * @var string
     * Models' primary DB table
     */
    public $table = 'users';

    /**
     * @var array
     * Stores data about logged in user
     */
    public static $user = [];

    /**
     * @return bool
     * Main function. Starts the model
     * Initialize current user data and settings
     */
    public function start() {

        if(!isset(LoginModel::$login['user_id']))
            return false;

        $userID = LoginModel::$login['user_id'];
        $this->prepareUserByID($userID);

        $userSettings = new UserSettingsModel;
        $userSettings->start();
        return true;

    }

    /**
     * @param $column
     * @param $value
     * Gets user data by $COLUMN and $VALUE from DB
     * @return UserEvents
     */
    public function getUserBy($column, $value) {

        // Query DB
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->select()
            ->selectValues()
            ->where($column, $value)
            ->exec();

        return $builder->output[0] ?? new UserEvents(6);

    }

    /**
     * @param     $username
     * @param     $email
     * @param     $password
     * @param     $admin
     * Creates new user row in DB
     * @param int $active
     */
    public function addUser($username, $email, $password, $admin, $active = 0) {

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->insert()
            ->insertRow([[
                'username' => $username,
                'email' => $email,
                'password' => $password,
                'admin' => $admin,
                'active' => $active
            ]])
            ->exec();

    }

    /**
     * Updates DB user info to match current status
     */
    public function updateUser() {

        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->update()
            ->updateRow([
                'username' => UserModel::$user['username'],
                'email' => UserModel::$user['email'],
                'password' => UserModel::$user['password'],
                'admin' => UserModel::$user['admin'],
            ])
            ->where('id', UserModel::$user['id'])
            ->exec();

    }

    /**
     * @param      $username
     * @param      $email
     * @param      $password
     * @param int  $admin
     * @param bool $valid
     * Prepares needed data for creating new user
     * @param int $active
     */
    public function createUser($username, $email, $password, $admin = 0, $valid = false, $active = 0) {

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
        $this->addUser($username, $email, $password, $admin, $active);

    }

    /**
     * @param $userID
     * Prepares user info by user ID
     */
    public function prepareUserByID($userID) {

        $this->prepareUser('id', $userID);

    }

    /**
     * @param $username
     * Prepares user info by user Username
     */
    public function prepareUserByUsername($username) {

        $this->prepareUser('username', $username);

    }

    /**
     * @param $email
     * Prepares user info by user Email
     */
    public function prepareUserByEmail($email) {

        $this->prepareUser('email', $email);

    }

    /**
     * @param $type
     * @param $value
     * Prepares user info by given $TYPE and $VALUE
     */
    public function prepareUser($type, $value) {

        // Query DB
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->select()
            ->selectValues()
            ->where($type, $value)
            ->exec();

        UserModel::$user = $builder->output[0] ?? new UserEvents(3);

    }

    /**
     * @param string $username
     * Check if user with $USERNAME already exists
     * @return bool
     */
    public function isUsername(string $username) {

        // Query DB
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->select()
            ->count()
            ->where('username', $username)
            ->exec();

        $num = $builder->output[0]['count'] ?? 0;

        if($num > 0)
            return false;

        return true;

    }

    /**
     * @param string $email
     * Check if user with $EMAIL already exists
     * @return bool
     */
    public function isEmail(string $email) {

        // Query DB
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->select()
            ->count()
            ->where('email', $email)
            ->exec();

        $num = $builder->output[0]['count'] ?? 0;

        if($num > 0)
            return false;

        return true;

    }
    
    public function setPicture($path) {
    
        $builder = new QueryBuilder;
        $builder->queryCommands
            ->table($this->table)
            ->update()
            ->updateRow(['picture' => $path])
            ->where('id', self::$user['id'])
            ->exec();
        
        return true;
    
    }

}