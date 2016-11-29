<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * User Model. Holds and manages users data.
 * Version: 0.2
 * Authors: lamka02sk
 */

namespace App\Models;

use App\Helpers\Crypto;
use App\Helpers\Validator;
use App\Helpers\Sanitizer;
use App\Database\QueryBuilder;

class UserModel extends MainModel {

    public $user = [];

    public function start() {

        // TODO: If someone's logged in, create users model.

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
                if(!$result) {
                    // Create Error > Invalid Input
                }
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
        $query = new QueryBuilder;
        $query->queryCommands
            ->table('users')
            ->insert()
            ->insertRow([[
                'username' => $username,
                'email' => $email,
                'password' => $password,
                'admin' => $admin
            ]])
            ->exec();

    }

    public function prepareUserByUsername($username) {

        // Sanitize username
        $sanitizer = new Sanitizer;
        $username = $sanitizer->sanitizeMagicQuotes($username);

        // Query DB
        $query = new QueryBuilder;
        $query->queryCommands
            ->table('users')
            ->select()
            ->selectValues()
            ->where('username', $username)
            ->exec();

        $this->user = $query->output[0];

    }

}