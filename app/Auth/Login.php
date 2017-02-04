<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * User login authenticator.
 * Version: 0.2.6
 * Authors: lamka02sk
 */

namespace App\Auth;

use App\Errors\UserEvents;
use App\Helpers\Crypto;
use App\Helpers\Generator;
use App\Helpers\Validator;
use App\Models\LoginAttemptsModel;
use App\Models\LoginModel;
use App\Models\UserModel;
use App\Requests\CookieRequest;
use App\Requests\Request;
use App\Views\Login as LoginView;

class Login {

    public $domain;
    private $hash;
    private $key;
    private $keyType;
    private $pass;

    private $maxLoginTime = 24; // Hours

    public function __construct($domain) {

        $this->domain = $domain;

    }

    public function checkLogin() {

        // Check SESSION
        if(!isset($_SESSION['user']['id']))
            return false;

        // If cookie does not exist, redirect to Login View
        if((!isset(Request::$cookie['login']) || empty(Request::$cookie['login'])))
            return false;

        $loginModel = new LoginModel;
        if(!$loginModel->checkLogin())
            return false;

        // User is Logged in
        $userModel = new UserModel;
        $userModel->start();
        $this->updateLogin();

        return true;

    }

    public function updateLogin() {

        $cookie = explode('|', Request::$cookie['login']);
        $this->hash = $cookie[0];
        $this->key = $cookie[1];

        $cookieRequest = new CookieRequest;
        $cookieRequest->updateCookie(
            'login',
            $this->hash . '|' . $this->key,
            time() + 60 * 60 * $this->maxLoginTime
        );

        $loginModel = new LoginModel;
        $loginModel->updateLogin();
        $_SESSION['user'] = UserModel::$user;

    }

    public function keyType() {

        $key = $this->key;
        $validator = new Validator;

        $this->keyType = 'username';
        if($validator->validateEmail($key))
            $this->keyType = 'email';

    }

    public function login() {

        $loginData = Request::$forms['login'];
        $this->key = $loginData['username'];
        $this->pass = $loginData['password'];

        $crypt = new Crypto;
        $generator = new Generator;
        $this->keyType();

        $user = UserModel::$user;
        if(!isset($user['id'])) {
            $userModel = new UserModel;
            $user = $userModel->getUserBy($this->keyType, $this->key);
        }

        $loginAttempts = new LoginAttemptsModel;
        $loginAttempts->start();

        if(!$loginAttempts->checkAttempts())
            new UserEvents(2); // Login Attempts

        if(empty($user))
            new UserEvents(3); // Invalid Login (username)

        if(!$crypt->verifyPassword($this->pass, $user['password'])) {
            $loginAttempts->addAttempt();
            new UserEvents(3); // Invalid Login (password)
        }

        $_SESSION['user'] = $user;
        $loginHash = $generator->generateLoginHash();
        $loginKey = $generator->generateLoginKey();

        $cookieRequest = new CookieRequest;
        $cookieRequest->updateCookie(
            'login',
            $loginHash . '|' . $loginKey,
            time() + 60 * 60 * $this->maxLoginTime
        );

        $loginModel = new LoginModel;
        $loginModel->addLogin($loginKey, $loginHash);

        $userModel = new UserModel;
        $userModel->start();

    }

}