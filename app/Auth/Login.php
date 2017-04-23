<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * User login authenticator.
 * Version: 0.2.8
 * Authors: lamka02sk
 */

namespace App\Auth;

use App\Controllers\StatsController;
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

    /**
     * @var string
     * Login domain: admin or client
     */
    public $domain;

    /**
     * @var string
     * Login Cookie hash
     */
    private $hash;

    /**
     * @var string
     * Login Cookie key
     */
    private $key;

    /**
     * @var string
     * Primary login input type: username or email
     */
    private $keyType;

    /**
     * @var string
     * Login Password
     */
    private $pass;

    /**
     * @var int
     * Maximum login time in hours
     */
    private $maxLoginTime = 24; // Hours

    /**
     * Login constructor.
     * @param $domain
     */
    public function __construct($domain) {

        $this->domain = $domain;

    }

    /**
     * @return bool
     * Check if user is logged in
     */
    public function checkLogin() {

        // Check SESSION - this limits login only for limited time of Session
        /*if(!isset($_SESSION['user']['id']))
            return false;*/

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

    /**
     * Update login information
     */
    public function updateLogin() {

        // Get cookie data
        $cookie = explode('|', Request::$cookie['login']);
        $this->hash = $cookie[0];
        $this->key = $cookie[1];

        // Update cookie value and expiration time
        $cookieRequest = new CookieRequest;
        $cookieRequest->updateCookie(
            'login',
            $this->hash . '|' . $this->key,
            time() + 60 * 60 * $this->maxLoginTime
        );

        // Update login model
        $loginModel = new LoginModel;
        $loginModel->updateLogin();
        $_SESSION['user'] = UserModel::$user;

    }

    /**
     * Determine primary key type
     */
    public function keyType() {

        $key = $this->key;
        $validator = new Validator;

        $this->keyType = 'username';
        if($validator->validateEmail($key))
            $this->keyType = 'email';

    }

    /**
     * Login function, create new login and/or redirect
     */
    public function login() {

        // Save login data from forms
        $loginData = Request::$forms['login'];
        $this->key = $loginData['username'];
        $this->pass = $loginData['password'];

        $crypt = new Crypto;
        $generator = new Generator;
        $this->keyType();

        // Check if user exists
        $user = UserModel::$user;
        if(!isset($user['id'])) {
            $userModel = new UserModel;
            $user = $userModel->getUserBy($this->keyType, $this->key);
        }

        // Check login attempts limit
        $loginAttempts = new LoginAttemptsModel;
        $loginAttempts->start();
        if(!$loginAttempts->checkAttempts())
            new UserEvents(2); // Login Attempts

        // Check user and password
        if(empty($user))
            new UserEvents(3); // Invalid Login (username)

        if(!$crypt->verifyPassword($this->pass, $user['password'])) {
            $loginAttempts->addAttempt();
            new UserEvents(3); // Invalid Login (password)
        }

        // Check if user has active account
        if(!(bool)$user['active'])
            new UserEvents(10);  // Inactive account

        // Create login indentifier
        $_SESSION['user'] = $user;
        $loginHash = $generator->generateLoginHash();
        $loginKey = $generator->generateLoginKey();

        // Create Login cookie
        $cookieRequest = new CookieRequest;
        $cookieRequest->updateCookie(
            'login',
            $loginHash . '|' . $loginKey,
            time() + 60 * 60 * $this->maxLoginTime
        );

        // Save login and start user model
        $loginModel = new LoginModel;
        $loginModel->addLogin($loginKey, $loginHash);

        $userModel = new UserModel;
        $userModel->start();

    }

}